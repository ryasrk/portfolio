"""GET/POST /api/content — read/write content.json via the GitHub Contents API."""

import json

from api._common import (
    authorized,
    gh_get_content,
    gh_put_content,
    github_token_from_env,
    parse_json_body,
    read_body,
    send,
    wsgi_app,
)

MAX_BODY = 4 * 1024 * 1024


def handler(environ):
    method = environ.get("REQUEST_METHOD", "GET").upper()

    if not authorized(environ):
        return 401, {"ok": False, "error": "unauthorized — login required"}, None

    if method == "POST":
        # Validate input before touching GitHub
        try:
            data = parse_json_body(read_body(environ))
        except ValueError as e:
            return 400, {"ok": False, "error": str(e)}, None
        for key in ("timeline", "certificates", "videos"):
            if not isinstance(data.get(key), list):
                return 400, {"ok": False, "error": f"'{key}' must be a list"}, None

    tok = github_token_from_env()
    if not tok:
        return (
            503,
            {
                "ok": False,
                "error": "GITHUB_TOKEN belum di-set di Vercel — tambahkan di Project Settings → Environment Variables",
            },
            None,
        )

    if method == "GET":
        sha, raw = gh_get_content(tok)
        if raw is None:
            return (
                503,
                {
                    "ok": False,
                    "error": "tidak dapat membaca content.json dari GitHub — cek GITHUB_TOKEN scope (perlu repo)",
                },
                None,
            )
        return 200, raw, None

    if method == "POST":
        sha, _ = gh_get_content(tok)
        raw = json.dumps(data, indent=2, ensure_ascii=False).encode()
        status, out = gh_put_content(
            tok, "assets/data/content.json", raw, sha, message="admin: update site content"
        )
        if status not in (200, 201):
            return (
                502,
                {"ok": False, "error": f"GitHub commit gagal ({status}): {out}"},
                None,
            )
        return (
            200,
            {
                "ok": True,
                "commit": out.get("commit", {}).get("sha", "")[:8],
                "note": "tersimpan sebagai commit — Vercel redeploy otomatis ±1 menit",
            },
            None,
        )

    return 405, {"ok": False, "error": "method not allowed"}, None


app = wsgi_app(handler)
