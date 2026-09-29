#!/bin/sh
set -eu

if [ -n "${MARKET_SOCKET_URL:-}" ]; then
  socket_url=$MARKET_SOCKET_URL
elif [ -n "${PUBLIC_HOST:-}" ]; then
  socket_url="http://${PUBLIC_HOST}:3000/market"
else
  socket_url="http://localhost:3000/market"
fi

escaped=$(printf '%s' "$socket_url" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf 'window.__MARKET_SOCKET_URL = "%s";\n' "$escaped" > /usr/share/nginx/html/app-config.js

exec nginx -g 'daemon off;'
