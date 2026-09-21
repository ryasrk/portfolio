#!/usr/bin/env python3
"""
Portfolio Admin Server.

Serves the portfolio site AND a small local-only API used by /admin:

  GET  /                     -> index.html (static hosting, like http.server)
  GET  /api/content          -> assets/data/content.json
  POST /api/content          -> replace assets/data/content.json (JSON body)
  POST /api/upload           -> multipart upload: field "file", "target" in
                                {timeline, certificates, videos, images}
  GET  /api/health           -> {"ok": true}

Run:  python3 admin-server.py [port]     (default 8080, binds 127.0.0.1)
"""

import json
import mimetypes
import re
import sys
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
CONTENT_FILE = ROOT / "assets" / "data" / "content.json"
UPLOAD_DIRS = {
    "timeline": ROOT / "assets" / "timeline",
    "certificates": ROOT / "assets" / "certificates",
    "videos": ROOT / "assets" / "videos",
    "images": ROOT / "assets" / "images",
}
ALLOWED_EXT = {
    "timeline": {".jpg", ".jpeg", ".png", ".webp", ".avif"},
    "certificates": {".jpg", ".jpeg", ".png", ".webp", ".avif"},
    "videos": {".mp4", ".webm", ".mov"},
    "images": {".jpg", ".jpeg", ".png", ".webp", ".avif"},
}
MAX_UPLOAD = 512 * 1024 * 1024  # 512 MB, videos can be large

MIME_OVERRIDES = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".webp": "image/webp",
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".svg": "image/svg+xml",
}


def safe_name(name: str) -> str:
    """Lowercase, slugified filename with extension preserved."""
    name = unquote(str(name))
    stem = Path(name).stem.lower()
    ext = Path(name).suffix.lower()
    stem = re.sub(r"[^a-z0-9._-]+", "-", stem).strip("-.") or "file"
    return f"{stem}{ext}"


class AdminHandler(BaseHTTPRequestHandler):
    server_version = "PortfolioAdmin/1.0"

    # ---------------- helpers ----------------

    def _send(self, code: int, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code: int, obj: dict):
        self._send(code, json.dumps(obj).encode(), "application/json")

    def _serve_static(self, url_path: str):
        path = unquote(urlparse(url_path).path)
        if path in ("/", ""):
            path = "/index.html"
        file_path = (ROOT / path.lstrip("/")).resolve()

        # Path traversal guard
        if not str(file_path).startswith(str(ROOT)):
            return self._json(403, {"ok": False, "error": "forbidden"})
        if file_path.is_dir():
            file_path = file_path / "index.html"

        if not file_path.is_file():
            return self._send(404, b"Not found", "text/plain")

        ext = file_path.suffix.lower()
        ctype = MIME_OVERRIDES.get(ext) or mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
        self._send(200, file_path.read_bytes(), ctype)

    # ---------------- API ----------------

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            return self._json(200, {"ok": True})
        if parsed.path == "/api/content":
            if CONTENT_FILE.is_file():
                return self._send(200, CONTENT_FILE.read_bytes(), "application/json")
            return self._json(404, {"ok": False, "error": "content.json missing"})
        return self._serve_static(parsed.path)

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/content":
            length = int(self.headers.get("Content-Length") or 0)
            if length > MAX_UPLOAD:
                return self._json(413, {"ok": False, "error": "payload too large"})
            raw = self.rfile.read(length)
            try:
                data = json.loads(raw.decode("utf-8"))
            except Exception as e:
                return self._json(400, {"ok": False, "error": f"invalid JSON: {e}"})

            # Basic shape validation
            for key in ("timeline", "certificates", "videos"):
                if not isinstance(data.get(key), list):
                    return self._json(400, {"ok": False, "error": f"'{key}' must be a list"})

            CONTENT_FILE.parent.mkdir(parents=True, exist_ok=True)
            CONTENT_FILE.write_text(
                json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            return self._json(200, {"ok": True, "path": str(CONTENT_FILE.relative_to(ROOT))})

        if parsed.path == "/api/upload":
            return self._handle_upload()
        if parsed.path == "/api/upload-video":
            return self._handle_upload_video()

        return self._json(404, {"ok": False, "error": "unknown endpoint"})

    def _handle_upload_video(self):
        """Single-file raw upload: /api/upload-video/<videos|images>/<filename>"""
        m = re.match(r"^/api/upload-video/(videos|images)/(.+)$", urlparse(self.path).path)
        if not m:
            return self._json(400, {"ok": False, "error": "bad upload path"})
        target, filename = m.group(1), safe_name(m.group(2))
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXT[target]:
            return self._json(415, {"ok": False, "error": f"extension {ext} not allowed in {target}"})

        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_UPLOAD:
            return self._json(413, {"ok": False, "error": "file too large"})
        data = self.rfile.read(length)

        dest_dir = UPLOAD_DIRS[target]
        dest_dir.mkdir(parents=True, exist_ok=True)
        (dest_dir / filename).write_bytes(data)
        rel = f"assets/{target}/{filename}"
        return self._json(200, {"ok": True, "path": rel})

    def _handle_upload(self):
        """Multipart upload with fields: target, file (multiple allowed)."""
        ctype = self.headers.get("Content-Type", "")
        if not ctype.startswith("multipart/form-data"):
            return self._json(400, {"ok": False, "error": "expected multipart/form-data"})

        boundary = re.search(r'boundary=([^;]+)', ctype)
        if not boundary:
            return self._json(400, {"ok": False, "error": "missing boundary"})
        delim = b"--" + boundary.group(1).encode()

        raw = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        if len(raw) > MAX_UPLOAD:
            return self._json(413, {"ok": False, "error": "file too large"})

        target = None
        saved = []
        for part in raw.split(delim):
            if not part or part in (b"--", b"--\r\n", b"\r\n"):
                continue
            header_end = part.find(b"\r\n\r\n")
            if header_end == -1:
                continue
            headers = part[:header_end].decode("utf-8", "replace")
            body = part[header_end + 4:]
            if body.endswith(b"\r\n"):
                body = body[:-2]

            name_m = re.search(r'name="([^"]+)"', headers)
            if not name_m:
                continue
            field = name_m.group(1)

            if field == "target":
                target = body.decode("utf-8", "replace").strip()
                continue
            if field != "file":
                continue

            fn_m = re.search(r'filename="([^"]+)"', headers)
            if not fn_m or target not in UPLOAD_DIRS:
                continue
            filename = safe_name(fn_m.group(1))
            ext = Path(filename).suffix.lower()
            if ext not in ALLOWED_EXT[target]:
                return self._json(
                    415, {"ok": False, "error": f"{ext} not allowed in {target}"}
                )
            dest_dir = UPLOAD_DIRS[target]
            dest_dir.mkdir(parents=True, exist_ok=True)
            (dest_dir / filename).write_bytes(body)
            saved.append(f"assets/{target}/{filename}")

        if not saved:
            return self._json(400, {"ok": False, "error": "no files saved"})
        return self._json(200, {"ok": True, "files": saved})

    def log_message(self, fmt, *args):  # quieter logs
        sys.stderr.write("[admin] " + (fmt % args) + "\n")


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = ThreadingHTTPServer(("127.0.0.1", port), AdminHandler)
    print(f"Portfolio + Admin API on http://127.0.0.1:{port}  (admin: /admin.html)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
