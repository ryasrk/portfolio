"""WSGI entrypoint shared by all /api/* Vercel functions."""

import json

from urllib.parse import urlparse

from api._common import (
    Resp,
    authorized,
    json_resp,
    parse_json_body,
    read_body,
    route_path,
    token_ok,
    gh_get_content,
    gh_put_content,
    github_token_from_env,
    CONTENT_PATH,
    REPO,
    BRANCH,
)


def _require_auth(environ):
    if not authorized(environ):
        return json_resp(
            401, {"ok": False, "error": "unauthorized — login required"}
        )
    return None


def handle(environ, start_response):
    path = route_path(environ).rstrip("/") or "/"
    method = environ.get("REQUEST_METHOD", "GET").upper()

    # ---------------- public ----------------
    if path == "/api/health":
        body = {
            "ok": True,
            "mode": "vercel",
            "github": bool(github_token_from_env()),
        }
        return _send(start_response, 200, body)

    # ---------------- login ----------------
    if path == "/api/login" and method == "POST":
        try:
            data = parse_json_body(read_body(environ))
        except ValueError as e:
            return _send(start_response, 400, {"ok": False, "error": str(e)})
        password = str(data.get("password") or "")
        if token_ok(password):
            resp = Resp(
                200,
                json.dumps({"ok": True, "token": password}).encode(),
            )
            resp.extra_headers = [
                (
                    "Set-Cookie",
                    f"pa_token={password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200",
                )
            ]
            return _raw_send(start_response, resp)
        return _send(start_response, 401, {"ok": False, "error": "password salah"})

    # ---------------- session probe (used by admin UI) ----------------
    if path == "/api/session":
        authed = authorized(environ)
        return _send(
            start_response,
            200,
            {
                "ok": True,
                "mode": "vercel",
                "authenticated": authed,
                "github": bool(github_token_from_env()),
            },
        )

    # ---------------- protected ----------------
    guard = _require_auth(environ)
    if guard:
        return _send(start_response, 401, {"ok": False, "error": "unauthorized — login required"})

    if path == "/api/content" and method == "GET":
        tok = github_token_from_env()
        if not tok:
            return _send(
                start_response,
                503,
                {
                    "ok": False,
                    "error": "GITHUB_TOKEN belum di-set di Vercel environment variables",
                },
            )
        sha, raw = gh_get_content(tok)
        if raw is None:
            return _send(
                start_response,
                503,
                {
                    "ok": False,
                    "error": "tidak dapat membaca content.json dari GitHub — cek GITHUB_TOKEN scope (perlu repo)",
                },
            )
        return _raw_send(start_response, Resp(200, raw, "application/json"))

    if path == "/api/content" and method == "POST":
        tok = github_token_from_env()
        if not tok:
            return _send(
                start_response,
                503,
                {"ok": False, "error": "GITHUB_TOKEN belum di-set di Vercel"},
            )
        try:
            data = parse_json_body(read_body(environ))
        except ValueError as e:
            return _send(start_response, 400, {"ok": False, "error": str(e)})
        for key in ("timeline", "certificates", "videos"):
            if not isinstance(data.get(key), list):
                return _send(
                    start_response, 400, {"ok": False, "error": f"'{key}' must be a list"}
                )
        sha, _ = gh_get_content(tok)
        raw = json.dumps(data, indent=2, ensure_ascii=False).encode()
        status, out = gh_put_content(
            tok, CONTENT_PATH, raw, sha, message="admin: update site content"
        )
        if status not in (200, 201):
            return _send(
                start_response,
                502,
                {"ok": False, "error": f"GitHub commit gagal ({status}): {out}"},
            )
        return _send(
            start_response,
            200,
            {
                "ok": True,
                "mode": "vercel",
                "commit": out.get("commit", {}).get("sha", "")[:8],
                "note": "tersimpan sebagai commit — Vercel akan redeploy otomatis (±1 menit)",
            },
        )

    if path == "/api/upload":
        return _send(
            start_response,
            501,
            {
                "ok": False,
                "error": "upload via web dinonaktifkan di mode Vercel (limit 4MB). "
                "Commit file ke assets/… secara manual, atau pakai mode lokal: ./start-portfolio.sh",
            },
        )

    return _send(start_response, 404, {"ok": False, "error": "unknown endpoint"})


def _send(start_response, status, obj):
    body = json.dumps(obj).encode() if not isinstance(obj, (bytes, Resp)) else obj
    if isinstance(body, Resp):
        return _raw_send(start_response, body)
    start_response(
        f"{status} OK",
        [
            ("Content-Type", "application/json"),
            ("Content-Length", str(len(body))),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]


def _raw_send(start_response, resp: Resp):
    headers = [
        ("Content-Type", resp.content_type),
        ("Content-Length", str(len(resp.body))),
        ("Cache-Control", "no-store"),
    ]
    for h in getattr(resp, "extra_headers", []):
        headers.append(h)
    start_response(f"{resp.status} OK", headers)
    return [resp.body]


def application(environ, start_response):
    try:
        return handle(environ, start_response)
    except Exception as e:  # never leak a stack trace
        try:
            return _send(start_response, 500, {"ok": False, "error": f"server error: {e}"})
        except Exception:
            raise
