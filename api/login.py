"""POST /api/login — password in, session token (+ HttpOnly cookie) out."""

import json

from api._common import parse_json_body, read_body, send, token_ok, wsgi_app


def handler(environ):
    if environ.get("REQUEST_METHOD", "GET").upper() != "POST":
        return 405, {"ok": False, "error": "method not allowed"}, None
    try:
        data = parse_json_body(read_body(environ))
    except ValueError as e:
        return 400, {"ok": False, "error": str(e)}, None
    password = str(data.get("password") or "")
    if token_ok(password):
        cookie = (
            f"pa_token={password}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200"
        )
        return 200, {"ok": True, "token": password}, [("Set-Cookie", cookie)]
    return 401, {"ok": False, "error": "password salah"}, None


app = wsgi_app(handler)
