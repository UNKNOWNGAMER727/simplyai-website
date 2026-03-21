#!/bin/bash
# Simply AI — Stop Everything
echo "Stopping Simply AI..."
pkill -f "webhook-server.mjs" 2>/dev/null && echo "  ✅ Webhook server stopped"
pkill -f "cloudflared tunnel" 2>/dev/null && echo "  ✅ Tunnel stopped"
pkill -f "vite" 2>/dev/null && echo "  ✅ CRM dashboard stopped"
pkill -f "tsx src/index.ts" 2>/dev/null && echo "  ✅ Paperclip stopped"
echo "Done."
