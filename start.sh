#!/bin/bash
# Simply AI — Start Everything
# Usage: ./start.sh

set -e

echo "🚀 Starting Simply AI..."
echo ""

# ── Config ──────────────────────────────────────────────────────────────────
CALCOM_API_KEY="cal_live_a0192585ce3f7d1b1d60e4a6e4825d0e"
WEBHOOK_PORT=3200
CRM_DIR="$HOME/ai-setup-crm"
PAPERCLIP_DIR="$HOME/paperclip"

# ── 1. Start Paperclip ─────────────────────────────────────────────────────
echo "1️⃣  Starting Paperclip..."
if lsof -i :3100 -t >/dev/null 2>&1; then
  echo "   Paperclip already running on :3100"
else
  cd "$PAPERCLIP_DIR"
  PAPERCLIP_AGENT_JWT_SECRET=$(grep PAPERCLIP_AGENT_JWT_SECRET ~/.paperclip/.env 2>/dev/null | cut -d= -f2)
  OPENAI_API_KEY=$(grep OPENAI_API_KEY ~/.paperclip/.env 2>/dev/null | cut -d= -f2)
  export PAPERCLIP_AGENT_JWT_SECRET OPENAI_API_KEY
  pnpm dev:once > /tmp/paperclip.log 2>&1 &
  echo "   Waiting for Paperclip to start..."
  for i in $(seq 1 30); do
    if curl -s http://localhost:3100/api/health >/dev/null 2>&1; then
      echo "   ✅ Paperclip running on :3100"
      break
    fi
    sleep 1
  done
fi

# ── 2. Start Webhook + Email Server ────────────────────────────────────────
echo "2️⃣  Starting Webhook + Email Server..."
if lsof -i :$WEBHOOK_PORT -t >/dev/null 2>&1; then
  echo "   Webhook server already running on :$WEBHOOK_PORT"
else
  cd "$CRM_DIR"
  node webhook-server.mjs > /tmp/webhook-server.log 2>&1 &
  sleep 2
  if curl -s http://localhost:$WEBHOOK_PORT/health >/dev/null 2>&1; then
    echo "   ✅ Webhook server running on :$WEBHOOK_PORT"
  else
    echo "   ❌ Webhook server failed to start"
  fi
fi

# ── 2b. Start ElevenLabs Webhook Server ────────────────────────────────────
echo "2️⃣b Starting ElevenLabs Webhook Server..."
if lsof -i :3201 -t >/dev/null 2>&1; then
  echo "   ElevenLabs webhook server already running on :3201"
else
  cd "$CRM_DIR"
  node elevenlabs-webhook.mjs > /tmp/elevenlabs-webhook.log 2>&1 &
  sleep 2
  if curl -s http://localhost:3201/health >/dev/null 2>&1; then
    echo "   ✅ ElevenLabs webhook server running on :3201"
  else
    echo "   ❌ ElevenLabs webhook server failed to start"
  fi
fi

# ── 3. Start Cloudflare Tunnel ─────────────────────────────────────────────
echo "3️⃣  Starting Cloudflare Tunnel..."
if pgrep -f "cloudflared tunnel" >/dev/null 2>&1; then
  echo "   Tunnel already running"
else
  cloudflared tunnel --url http://localhost:$WEBHOOK_PORT > /tmp/cloudflared.log 2>&1 &
  sleep 5
  TUNNEL_URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' /tmp/cloudflared.log 2>/dev/null | head -1)
  if [ -n "$TUNNEL_URL" ]; then
    echo "   ✅ Tunnel: $TUNNEL_URL"

    # Update Cal.com webhook with new tunnel URL
    echo "   Updating Cal.com webhook..."
    # Delete old webhook
    OLD_HOOKS=$(curl -s "https://api.cal.com/v2/webhooks" \
      -H "Authorization: Bearer $CALCOM_API_KEY" \
      -H "cal-api-version: 2024-08-13" 2>/dev/null)
    OLD_IDS=$(echo "$OLD_HOOKS" | python3 -c "
import sys,json
d=json.load(sys.stdin)
data=d.get('data',d)
if isinstance(data,list):
  for w in data:
    if 'trycloudflare' in w.get('subscriberUrl','') or 'loca.lt' in w.get('subscriberUrl',''):
      print(w['id'])
" 2>/dev/null)
    for wid in $OLD_IDS; do
      curl -s -X DELETE "https://api.cal.com/v2/webhooks/$wid" \
        -H "Authorization: Bearer $CALCOM_API_KEY" \
        -H "cal-api-version: 2024-08-13" >/dev/null 2>&1
    done

    # Create new webhook
    curl -s -X POST "https://api.cal.com/v2/webhooks" \
      -H "Authorization: Bearer $CALCOM_API_KEY" \
      -H "cal-api-version: 2024-08-13" \
      -H "Content-Type: application/json" \
      -d "{
        \"subscriberUrl\": \"$TUNNEL_URL/webhook/calcom\",
        \"triggers\": [\"BOOKING_CREATED\", \"BOOKING_CANCELLED\", \"BOOKING_RESCHEDULED\"],
        \"active\": true
      }" >/dev/null 2>&1
    echo "   ✅ Cal.com webhook updated to: $TUNNEL_URL/webhook/calcom"
  else
    echo "   ❌ Could not get tunnel URL"
  fi
fi

# ── 4. Start CRM Dashboard ────────────────────────────────────────────────
echo "4️⃣  Starting CRM Dashboard..."
if lsof -i :5173 -t >/dev/null 2>&1; then
  echo "   CRM already running on :5173"
else
  cd "$CRM_DIR"
  npm run dev > /tmp/crm-dashboard.log 2>&1 &
  sleep 3
  echo "   ✅ CRM Dashboard: http://localhost:5173/internal/dashboard"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Simply AI is running!"
echo ""
echo "  🖥  Dashboard:  http://localhost:5173/internal/dashboard"
echo "  📋 Paperclip:   http://localhost:3100"
echo "  📧 Webhooks:    http://localhost:$WEBHOOK_PORT"
echo "  📞 ElevenLabs:  http://localhost:3201"
echo "  🌐 Public URL:  ${TUNNEL_URL:-check /tmp/cloudflared.log}"
echo ""
echo "  📞 Phone:       (818) 600-6825"
echo "  📅 Booking:     cal.com/simplytech.ai"
echo "  🌐 Website:     simplyai.tech"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Logs:"
echo "    tail -f /tmp/paperclip.log"
echo "    tail -f /tmp/webhook-server.log"
echo "    tail -f /tmp/cloudflared.log"
echo "    tail -f /tmp/elevenlabs-webhook.log"
echo "    tail -f /tmp/crm-dashboard.log"
echo ""
