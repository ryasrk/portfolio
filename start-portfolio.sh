#!/usr/bin/env bash
# =============================================================================
# Portfolio bundle launcher — situs + admin API dalam SATU command.
#
#   ./start-portfolio.sh          -> jalan di port 8080 (default)
#   ./start-portfolio.sh 9000     -> custom port
#
# - API pasti online: health-checked setelah start, retry 15x.
# - Kalau port sudah dipakai instance lama, instance lama dimatikan dulu.
# - Server tetap hidup setelah terminal ditutup (setsid + nohup).
# =============================================================================
set -u
cd "$(dirname "$0")"

PORT="${1:-8080}"
LOG="/tmp/portfolio-server.log"
PIDFILE="/tmp/portfolio-server.pid"

# 1) Matikan instance lama pada port yang sama (pidfile ATAU proses di port)
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "[bundle] menghentikan instance lama (pidfile $(cat "$PIDFILE"))"
  kill "$(cat "$PIDFILE")" 2>/dev/null
  sleep 1
fi
OLD_PID=$(ss -tlnp 2>/dev/null | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1)
if [ -n "$OLD_PID" ]; then
  echo "[bundle] menghentikan proses lain di port $PORT (pid $OLD_PID)"
  kill "$OLD_PID" 2>/dev/null
  sleep 1
fi

# 2) Start server baru (detached)
setsid nohup python3 admin-server.py "$PORT" > "$LOG" 2>&1 < /dev/null &
echo $! > "$PIDFILE"

# 3) Health check — API WAJIB online sebelum launcher keluar
ok=""
for i in $(seq 1 15); do
  sleep 0.4
  if curl -sf "http://127.0.0.1:$PORT/api/health" > /dev/null 2>&1; then
    ok=1
    break
  fi
done

if [ -z "$ok" ]; then
  echo "[bundle] GAGAL: API tidak merespons. Log:"
  cat "$LOG"
  exit 1
fi

echo "[bundle] ✓ API online"
echo "[bundle] ✓ Situs   : http://127.0.0.1:$PORT/"
echo "[bundle] ✓ Admin   : http://127.0.0.1:$PORT/admin.html  (password diperlukan)"
echo "[bundle] Log server: $LOG"
