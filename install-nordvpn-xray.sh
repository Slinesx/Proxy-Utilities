#!/usr/bin/env bash
# install-nordvpn-xray.sh — online installer & launcher for nordvpn‑xray container
set -Eeuo pipefail

# 0) prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Install Docker first" >&2; exit 1; }
command -v curl   >/dev/null 2>&1 || { echo "❌ Install curl first" >&2;   exit 1; }

# 1) credentials
: "${NORD_USERNAME:?ERROR: export NORD_USERNAME}"
: "${NORD_PASSWORD:?ERROR: export NORD_PASSWORD}"

# 2) temp workspace
TMPDIR="$(mktemp -d)"
cleanup(){ rm -rf "$TMPDIR"; }
trap cleanup EXIT

# 3) cache‑bust timestamp
TS="$(date +%s)"

# 4) download emoji_data.sh & emoji_utils.sh into TMPDIR
EMOJI_DATA_URL="https://raw.githubusercontent.com/Slinesx/Proxy-Utilities/main/emoji_data.sh?ts=${TS}"
EMOJI_UTILS_URL="https://raw.githubusercontent.com/Slinesx/Proxy-Utilities/main/emoji_utils.sh?ts=${TS}"

echo "→ Fetching emoji mappings…"
curl -H 'Cache-Control: no-cache, no-store' -fsSL "$EMOJI_DATA_URL"  -o "$TMPDIR/emoji_data.sh"
curl -H 'Cache-Control: no-cache, no-store' -fsSL "$EMOJI_UTILS_URL" -o "$TMPDIR/emoji_utils.sh"

# 5) source them (emoji_utils.sh will source emoji_data.sh via dirname)
source "$TMPDIR/emoji_utils.sh"

# 6) server code from arg or prompt
if [[ $# -ge 1 ]]; then
  srv="$1"
else
  read -rp "NordVPN server code (e.g. tr54): " srv
fi
[[ -n "$srv" ]] || { echo "❌ No server code provided" >&2; exit 1; }

# 7) download the .ovpn
OVPN_URL="https://downloads.nordcdn.com/configs/files/ovpn_udp/servers/${srv}.nordvpn.com.udp.ovpn"
OVPN_TMP="$TMPDIR/${srv}.nordvpn.ovpn"
echo "→ Downloading OpenVPN config for: $srv"
curl -fsSL "$OVPN_URL" -o "$OVPN_TMP"

# 8) generate tag & Shadowsocks password
generate_tag "$srv"
SS_PASSWORD="${SS_PASSWORD:-$(openssl rand -base64 16)}"

# 9) pick a free host port
while :; do
  PORT=$(shuf -i20000-65000 -n1)
  ss -tln | awk '{print $4}' | grep -q ":${PORT}$" || break
done

# 10) pull & run the container
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

# 11) verify
sleep 2
if [[ "$(docker inspect -f '{{.State.Running}}' "$container")" != "true" ]]; then
  echo "❌ Container failed to start — logs:" >&2
  docker logs --tail 50 "$container" >&2
  exit 1
fi

# 12) output
HOST_IP=$(hostname -I | awk '{print $1}')
cat <<EOF
-----------------------------------------------------------------
  ✅  Shadowsocks proxy is ready!

  Container   : ${container}
  Xray: shadowsocks=${HOST_IP}:${PORT}, method=2022-blake3-aes-128-gcm, password=${SS_PASSWORD}, fast-open=false, udp-relay=true, tag=${TAG}
-----------------------------------------------------------------
EOF
