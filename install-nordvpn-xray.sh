#!/usr/bin/env bash
# install-nordvpn-xray.sh — online installer & launcher for nordvpn-xray container
set -Eeuo pipefail

# 0) ensure Docker + curl exist
command -v docker >/dev/null 2>&1 || { echo "❌ Install Docker first" >&2; exit 1; }
command -v curl   >/dev/null 2>&1 || { echo "❌ Install curl first" >&2;   exit 1; }

# 1) creds
: "${NORD_USERNAME:?ERROR: export NORD_USERNAME}"
: "${NORD_PASSWORD:?ERROR: export NORD_PASSWORD}"

# 2) cache‑bust timestamp for downstream fetches
TS=$(date +%s)

# 3) URLs for emoji utilities (with ?nocache to bust CDN caches)
EMOJI_DATA_URL="https://raw.githubusercontent.com/Slinesx/Proxy-Utilities/main/emoji_data.sh?nocache=${TS}"
EMOJI_UTILS_URL="https://raw.githubusercontent.com/Slinesx/Proxy-Utilities/main/emoji_utils.sh?nocache=${TS}"

# 4) temp files
EMOJI_DATA_TMP=$(mktemp /tmp/emoji_data.XXXXXX.sh)
EMOJI_UTILS_TMP=$(mktemp /tmp/emoji_utils.XXXXXX.sh)
OVPN_TMP=""

# 5) cleanup on EXIT
cleanup() {
  [[ -n "$EMOJI_DATA_TMP"   && -f "$EMOJI_DATA_TMP"  ]] && rm -f "$EMOJI_DATA_TMP"
  [[ -n "$EMOJI_UTILS_TMP"  && -f "$EMOJI_UTILS_TMP" ]] && rm -f "$EMOJI_UTILS_TMP"
  [[ -n "$OVPN_TMP"         && -f "$OVPN_TMP"        ]] && rm -f "$OVPN_TMP"
}
trap cleanup EXIT

# 6) grab emoji_data & emoji_utils
curl -H 'Cache-Control: no-cache, no-store' -fsSL "$EMOJI_DATA_URL"  -o "$EMOJI_DATA_TMP"
curl -H 'Cache-Control: no-cache, no-store' -fsSL "$EMOJI_UTILS_URL" -o "$EMOJI_UTILS_TMP"
source "$EMOJI_DATA_TMP"
source "$EMOJI_UTILS_TMP"

# 7) server code from arg or prompt
if [[ $# -ge 1 ]]; then
  srv="$1"
else
  read -rp "NordVPN server code (e.g. tr54): " srv
fi
[[ -n "$srv" ]] || { echo "❌ No server code provided" >&2; exit 1; }

# 8) download the .ovpn
OVPN_URL="https://downloads.nordcdn.com/configs/files/ovpn_udp/servers/${srv}.nordvpn.com.udp.ovpn"
OVPN_TMP=$(mktemp /tmp/${srv}.nordvpn.XXXXXX.ovpn)
echo "→ Downloading OpenVPN config for: $srv"
curl -fsSL "$OVPN_URL" -o "$OVPN_TMP"

# 9) tag + Shadowsocks password
generate_tag "$srv"
SS_PASSWORD="${SS_PASSWORD:-$(openssl rand -base64 16)}"

# 10) pick a free host port
while :; do
  PORT=$(shuf -i20000-65000 -n1)
  ss -tln | awk '{print $4}' | grep -q ":${PORT}$" || break
done

# 11) pull & run
echo "→ Pulling latest liafonx/nordvpn-xray:latest"
docker pull liafonx/nordvpn-xray:latest

container="nordxray-${srv}"
docker rm -f "$container" &>/dev/null || true
docker run -d --name "$container" \
  --pull=always \
  --cap-add=NET_ADMIN --device=/dev/net/tun \
  -p "0.0.0.0:${PORT}:1080/tcp" \
  -p "0.0.0.0:${PORT}:1080/udp" \
  --sysctl net.ipv6.conf.all.disable_ipv6=1 \
  --sysctl net.ipv6.conf.default.disable_ipv6=1 \
  -e NORD_SERVER="$srv" \
  -e NORD_USERNAME="$NORD_USERNAME" \
  -e NORD_PASSWORD="$NORD_PASSWORD" \
  -e SS_PASSWORD="$SS_PASSWORD" \
  -v "$OVPN_TMP":/nordvpn.ovpn:ro \
  liafonx/nordvpn-xray:latest

# 12) verify
sleep 2
if [[ "$(docker inspect -f '{{.State.Running}}' "$container")" != "true" ]]; then
  echo "❌ Container failed to start — logs:" >&2
  docker logs --tail 50 "$container" >&2
  exit 1
fi

# 13) output
HOST_IP=$(hostname -I | awk '{print $1}')
cat <<EOF
-----------------------------------------------------------------
  ✅  Shadowsocks proxy is ready!

  Container   : ${container}
  Xray: shadowsocks=${HOST_IP}:${PORT}, method=2022-blake3-aes-128-gcm, password=${SS_PASSWORD}, fast-open=false, udp-relay=true, tag=${TAG}
-----------------------------------------------------------------
EOF
