"""POST /api/upload-image — gambar-only upload.

Multipart fields:
  file   — gambar (.jpg/.jpeg/.png/.webp/.avif), maks 4MB
  target — folder tujuan: timeline | certificates | images

Mode Vercel: file di-commit ke GitHub via Contents API (filesystem serverless
adalah efemeral, jadi commit adalah satu-satunya cara agar file permanen dan
langsung ter-serve oleh CDN Vercel setelah redeploy).
"""

import base64
import mimetypes
import re
from pathlib import PurePosixPath
from urllib.parse import unquote

from api._common import (
    authorized,
    gh_get_content,
    gh_put_content,
    github_token_from_env,
    send,
    wsgi_app,
)

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
TARGETS = {
    "timeline": "assets/timeline",
    "certificates": "assets/certificates",
    "images": "assets/images",
}
MAX_IMAGE = 4 * 1024 * 1024

GITHUB_RAW_MIME = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
}


def safe_name(name):
    name = unquote(str(name))
    stem = PurePosixPath(name).stem.lower()
    ext = PurePosixPath(name).suffix.lower()
    stem = re.sub(r"[^a-z0-9._-]+", "-", stem).strip("-.") or "file"
    return f"{stem}{ext}"


def parse_multipart(environ):
    """Minimal multipart parser -> dict[field] = value, files: list of (filename, bytes)."""
    ctype = environ.get("CONTENT_TYPE", "")
    if not ctype.startswith("multipart/form-data"):
        raise ValueError("expected multipart/form-data")
    m = re.search(r'boundary=([^;]+)', ctype)
    if not m:
        raise ValueError("missing boundary")
    delim = b"--" + m.group(1).encode()

    raw = environ["wsgi.input"].read(int(environ.get("CONTENT_LENGTH") or 0))
    if len(raw) > MAX_IMAGE + 65536:
        raise ValueError("file terlalu besar (maks 4MB di Vercel)")

    fields, files = {}, []
    for part in raw.split(delim):
        if not part or part in (b"--", b"--\r\n", b"\r\n"):
            continue
        head_end = part.find(b"\r\n\r\n")
        if head_end == -1:
            continue
        headers = part[:head_end].decode("utf-8", "replace")
        body = part[head_end + 4:]
        if body.endswith(b"\r\n"):
            body = body[:-2]
        name_m = re.search(r'name="([^"]+)"', headers)
        if not name_m:
            continue
        field = name_m.group(1)
        fn_m = re.search(r'filename="([^"]+)"', headers)
        if fn_m:
            files.append((fn_m.group(1), body))
        else:
            fields[field] = body.decode("utf-8", "replace").strip()
    return fields, files


def handler(environ):
    if environ.get("REQUEST_METHOD", "GET").upper() != "POST":
        return 405, {"ok": False, "error": "method not allowed"}, None
    if not authorized(environ):
        return 401, {"ok": False, "error": "unauthorized — login required"}, None

    try:
        fields, files = parse_multipart(environ)
    except ValueError as e:
        return 400, {"ok": False, "error": str(e)}, None

    target = fields.get("target", "")
    if target not in TARGETS:
        return 400, {"ok": False, "error": f"target harus salah satu dari: {', '.join(TARGETS)}"}, None
    if not files:
        return 400, {"ok": False, "error": "tidak ada file"}, None

    filename, data = files[0]
    filename = safe_name(filename)
    ext = PurePosixPath(filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        return 415, {"ok": False, "error": f"ekstensi {ext} tidak diizinkan (gambar: jpg/png/webp/avif)"}, None
    if len(data) > MAX_IMAGE:
        return 413, {"ok": False, "error": "file terlalu besar (maks 4MB)"}, None

    rel_path = f"{TARGETS[target]}/{filename}"

    # --- Mode lokal: tulis langsung ke disk ---
    if environ.get("HTTP_X_ADMIN_MODE") == "local":
        from pathlib import Path
        dest = Path(__file__).resolve().parent.parent / rel_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return 200, {"ok": True, "path": rel_path, "mode": "local"}, None

    # --- Mode Vercel: commit ke GitHub ---
    tok = github_token_from_env()
    if not tok:
        return (
            503,
            {
                "ok": False,
                "error": "GITHUB_TOKEN belum di-set di Vercel — upload gambar butuh token repo untuk commit",
            },
            None,
        )
    sha, _ = gh_get_content(tok, rel_path)
    message = f"admin: upload {target}/{filename}"
    status, out = gh_put_content(tok, rel_path, data, sha, message=message)
    if status not in (200, 201):
        return 502, {"ok": False, "error": f"GitHub commit gagal ({status}): {out}"}, None

    return (
        200,
        {
            "ok": True,
            "mode": "vercel",
            "path": rel_path,
            "commit": out.get("commit", {}).get("sha", "")[:8],
            "note": "gambar ter-commit — ter-serve setelah redeploy otomatis ±1 menit",
        },
        None,
    )


app = wsgi_app(handler)
