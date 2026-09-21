"""Shared WSGI plumbing for the portfolio admin serverless functions.

Vercel's Python runtime imports each api/<name>.py and calls the `app`
callable (WSGI) with the request. Each endpoint file binds its route name
explicitly, so no path-rewrite inference is needed.
"""

import base64
import json
import os
import urllib.error
import urllib.request
from http import cookies

ADMIN_PASSWORDS = ("Ryas4321", "Ryas4312")
REPO = os.environ.get("GITHUB_REPO", "ryasrk/portfolio")
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
CONTENT_PATH = "assets/data/content.json"

MAX_BODY = 4 * 1024 * 1024  # Vercel request body limit


class Resp:
    def __init__(self, status=200, body=b"", content_type="application/json", extra_headers=None):
        self.status = status
        self.body = body if isinstance(body, bytes) else str(body).encode()
        self.content_type = content_type
        self.extra_headers = extra_headers or []


def _gh_request(method, url, token, payload=None):
    data = None
    headers = {
        "User-Agent": "portfolio-admin",
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
    }
    if payload is not None:
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            body = json.loads(body)
        except Exception:
            pass
        return e.code, body


def github_token_from_env():
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or ""


def gh_get_content(token, path=CONTENT_PATH):
    """Return (sha, bytes) of a file in the repo, or (None, None)."""
    url = f"https://api.github.com/repos/{REPO}/contents/{path}?ref={BRANCH}"
    status, body = _gh_request("GET", url, token)
    if status != 200 or not isinstance(body, dict):
        return None, None
    try:
        return body.get("sha"), base64.b64decode(body.get("content") or "")
    except Exception:
        return body.get("sha"), None


def gh_put_content(token, path, data_bytes, sha=None, message="admin update"):
    url = f"https://api.github.com/repos/{REPO}/contents/{path}"
    payload = {
        "message": message,
        "content": base64.b64encode(data_bytes).decode(),
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha
    return _gh_request("PUT", url, token, payload)


def get_token(environ):
    """Token from X-Admin-Token, Bearer header, or pa_token cookie."""
    import hmac

    auth = environ.get("HTTP_AUTHORIZATION") or ""
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    header = (environ.get("HTTP_X_ADMIN_TOKEN") or "").strip()
    if header:
        return header
    jar = cookies.SimpleCookie()
    try:
        jar.load(environ.get("HTTP_COOKIE") or "")
    except Exception:
        return ""
    morsel = jar.get("pa_token")
    return morsel.value if morsel else ""


def token_ok(token):
    if not token:
        return False
    import hmac

    return any(hmac.compare_digest(token, p) for p in ADMIN_PASSWORDS)


def authorized(environ):
    return token_ok(get_token(environ))


def read_body(environ):
    length = int(environ.get("CONTENT_LENGTH") or 0)
    if length > MAX_BODY:
        raise ValueError("payload too large (Vercel limit 4MB)")
    return environ["wsgi.input"].read(length)


def parse_json_body(raw):
    try:
        return json.loads((raw or b"").decode("utf-8"))
    except Exception as e:
        raise ValueError(f"invalid JSON: {e}")


def send(start_response, status, obj, extra_headers=None):
    if isinstance(obj, Resp):
        body = obj.body
        ctype = obj.content_type
        extra_headers = (extra_headers or []) + obj.extra_headers
    elif isinstance(obj, (bytes, bytearray)):
        body = bytes(obj)
        ctype = "application/json"
    else:
        body = json.dumps(obj).encode()
        ctype = "application/json"
    headers = [
        ("Content-Type", ctype),
        ("Content-Length", str(len(body))),
        ("Cache-Control", "no-store"),
    ]
    headers.extend(extra_headers or [])
    start_response(f"{status} OK", headers)
    return [body]


def wsgi_app(handler):
    """Wrap an endpoint handler(environ) -> (status, obj, extra_headers) into WSGI."""

    def application(environ, start_response):
        try:
            status, obj, extra = handler(environ)
            return send(start_response, status, obj, extra)
        except Exception as e:  # never leak a stack trace
            return send(start_response, 500, {"ok": False, "error": f"server error: {e}"})

    return application
