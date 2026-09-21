"""Shared helpers for the portfolio admin serverless functions."""

import base64
import json
import os
import urllib.error
import urllib.request
from http import cookies
from urllib.parse import urlparse

ADMIN_PASSWORDS = ("Ryas4321", "Ryas4312")
REPO = os.environ.get("GITHUB_REPO", "ryasrk/portfolio")
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
CONTENT_PATH = "assets/data/content.json"

MAX_BODY = 4 * 1024 * 1024  # Vercel request body limit


class Resp:
    def __init__(self, status=200, body=b"", content_type="application/json"):
        self.status = status
        self.body = body if isinstance(body, bytes) else str(body).encode()
        self.content_type = content_type


def json_resp(status, obj):
    return Resp(status, json.dumps(obj).encode(), "application/json")


def read_body(environ):
    length = int(environ.get("CONTENT_LENGTH") or 0)
    if length > MAX_BODY:
        raise ValueError("payload too large")
    return environ["wsgi.input"].read(length)


def get_cookie_token(environ):
    raw = environ.get("HTTP_COOKIE") or ""
    jar = cookies.SimpleCookie()
    try:
        jar.load(raw)
    except Exception:
        return ""
    morsel = jar.get("pa_token")
    return morsel.value if morsel else ""


def get_token(environ):
    """Token from X-Admin-Token, Bearer header, or session cookie."""
    auth = environ.get("HTTP_AUTHORIZATION") or ""
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    header = (environ.get("HTTP_X_ADMIN_TOKEN") or "").strip()
    if header:
        return header
    return get_cookie_token(environ)


def token_ok(token):
    if not token:
        return False
    # constant-time compare against any accepted password
    import hmac
    return any(hmac.compare_digest(token, p) for p in ADMIN_PASSWORDS)


def authorized(environ):
    return token_ok(get_token(environ))


def _gh_request(method, url, token, payload=None, accept="application/vnd.github+json"):
    data = None
    headers = {
        "User-Agent": "portfolio-admin",
        "Accept": accept,
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
    return (
        os.environ.get("GITHUB_TOKEN")
        or os.environ.get("GH_TOKEN")
        or ""
    )


def gh_get_content(token, path=CONTENT_PATH):
    """Return (sha, bytes) of a file in the repo, or (None, None)."""
    url = f"https://api.github.com/repos/{REPO}/contents/{path}?ref={BRANCH}"
    status, body = _gh_request("GET", url, token)
    if status != 200 or not isinstance(body, dict):
        return None, None
    content = body.get("content") or ""
    try:
        return body.get("sha"), base64.b64decode(content)
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


def parse_json_body(raw):
    try:
        return json.loads((raw or b"").decode("utf-8"))
    except Exception as e:
        raise ValueError(f"invalid JSON: {e}")


def is_admin_path(path):
    return path == "/admin" or path.startswith("/admin.html")


def route_path(environ):
    return urlparse(environ.get("PATH_INFO", "")).path
