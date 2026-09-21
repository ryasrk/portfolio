"""POST /api/upload-video — disabled on Vercel (4MB request limit)."""

from api._common import send, wsgi_app


def handler(environ):
    return (
        501,
        {
            "ok": False,
            "error": "upload via web dinonaktifkan di mode Vercel (limit 4MB). "
            "Commit file ke assets/… secara manual, atau pakai mode lokal: ./start-portfolio.sh",
        },
        None,
    )


app = wsgi_app(handler)
