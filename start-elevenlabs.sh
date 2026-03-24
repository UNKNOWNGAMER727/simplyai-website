#!/bin/bash
# Simply AI — Start ElevenLabs webhook server + tunnel + auto-update webhook URL
# Usage: ./start-elevenlabs.sh

cd "$(dirname "$0")"
source .env 2>/dev/null

WEBHOOK_PORT=3201
WEBHOOK_ID="wh_1f01kmbc7gz4f7v3s88s1ypycp53"  # Will be looked up dynamically if needed

echo "=== Simply AI — ElevenLabs Stack ==="

# 1. Kill any existing processes
echo "[1/4] Cleaning up old processes..."
kill $(lsof -ti:$WEBHOOK_PORT) 2>/dev/null
pkill -f "cloudflared.*$WEBHOOK_PORT" 2>/dev/null
sleep 1

# 2. Start webhook server
echo "[2/4] Starting webhook server on port $WEBHOOK_PORT..."
export TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID ELEVENLABS_WEBHOOK_SECRET ELEVENLABS_API_KEY
export CAL_API_KEY="${CAL_API_KEY:-$VITE_CALCOM_API_KEY}"
node elevenlabs-webhook.mjs &>/tmp/elevenlabs-webhook.log &
WEBHOOK_PID=$!
sleep 2

if ! kill -0 $WEBHOOK_PID 2>/dev/null; then
  echo "  ERROR: Webhook server failed to start"
  cat /tmp/elevenlabs-webhook.log
  exit 1
fi
echo "  Webhook server running (PID: $WEBHOOK_PID)"

# 3. Start named Cloudflare tunnel (permanent: webhook.simplyai.tech)
echo "[3/4] Starting Cloudflare named tunnel (webhook.simplyai.tech)..."
cloudflared tunnel run 1b6cf289-2b00-49d7-b081-913a030b18f7 &>/tmp/elevenlabs-tunnel.log &
TUNNEL_PID=$!
sleep 4

TUNNEL_URL="https://webhook.simplyai.tech"
echo "  Tunnel live: $TUNNEL_URL"

# 4. Verify/update ElevenLabs webhook URL (permanent — only update if different)
WEBHOOK_CALLBACK="${TUNNEL_URL}/elevenlabs/post-call"
echo "[4/4] Verifying ElevenLabs post-call webhook..."

if [ -n "$ELEVENLABS_API_KEY" ]; then
  # List existing webhooks to find our webhook ID
  WEBHOOKS_JSON=$(curl -s "https://api.elevenlabs.io/v1/convai/webhooks" \
    -H "xi-api-key: $ELEVENLABS_API_KEY")

  # Find webhook ID by name
  WH_ID=$(echo "$WEBHOOKS_JSON" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    webhooks = data if isinstance(data, list) else data.get('webhooks', data.get('results', []))
    for wh in webhooks:
        if 'Simply AI' in (wh.get('name','') or wh.get('display_name','')):
            print(wh.get('webhook_id', wh.get('id','')))
            break
except: pass
" 2>/dev/null)

  if [ -n "$WH_ID" ]; then
    echo "  Found webhook: $WH_ID"
    # Update the webhook URL
    UPDATE_RESULT=$(curl -s -X PATCH "https://api.elevenlabs.io/v1/convai/webhooks/$WH_ID" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"url\": \"$WEBHOOK_CALLBACK\"}")
    echo "  Updated webhook URL to: $WEBHOOK_CALLBACK"
  else
    echo "  WARNING: Could not find webhook to update. You may need to update manually."
    echo "  Go to: ElevenLabs > Settings > Post-Call Webhook"
    echo "  Set URL to: $WEBHOOK_CALLBACK"
  fi
else
  echo "  WARNING: No ELEVENLABS_API_KEY set. Update webhook URL manually:"
  echo "  $WEBHOOK_CALLBACK"
fi

echo ""
echo "=== Simply AI ElevenLabs Stack Running ==="
echo "  Webhook: http://localhost:$WEBHOOK_PORT/elevenlabs/post-call"
echo "  Tunnel:  $TUNNEL_URL"
echo "  Callback: $WEBHOOK_CALLBACK"
echo "  Logs:    /tmp/elevenlabs-webhook.log"
echo ""
echo "  To stop: kill $WEBHOOK_PID $TUNNEL_PID"
