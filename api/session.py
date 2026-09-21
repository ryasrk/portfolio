"""GET /api/session — probe: mode + auth state (used by the admin UI)."""

from api._common import authorized, github_token_from_env, send, wsgi_app


def handler(environ):
    return (
        200,
        {
            "ok": True,
            "mode": "vercel",
            "authenticated": authorized(environ),
            "github": bool(github_token_from_env()),
        },
        None,
    )


app = wsgi_app(handler)
