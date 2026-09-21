"""GET /api/health — public liveness probe."""

from api._common import github_token_from_env, send, wsgi_app


def handler(environ):
    return (
        200,
        {"ok": True, "mode": "vercel", "github": bool(github_token_from_env())},
        None,
    )


app = wsgi_app(handler)
