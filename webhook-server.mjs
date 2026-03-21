#!/usr/bin/env node
/**
 * Simply AI — Webhook Server
 * Receives Cal.com booking webhooks and creates Paperclip tasks automatically.
 * Run: node webhook-server.mjs
 */

import http from 'node:http';

const PORT = 3200;
const PAPERCLIP_URL = 'http://127.0.0.1:3100/api';
const COMPANY_ID = 'a9af7a13-74bd-4be3-a900-0a9b269c8cb1';

// Agent IDs
const AGENTS = {
  bookingCoordinator: '42b8a098-62b3-4c3e-aa9e-c24535c10c56',
  reviewAgent: 'faa7fdb6-d143-4eb0-95ff-e77303c19e27',
  leadHandler: '447674da-25a5-4be1-93b5-64894c7b0ac9',
  operationsManager: '850c8159-9e91-4f55-b12b-7b9b38ae56ff',
};

// ── Paperclip helpers ──────────────────────────────────────────────────────

async function createTask(title, description, agentId, priority = 'high') {
  const res = await fetch(`${PAPERCLIP_URL}/companies/${COMPANY_ID}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      description,
      priority,
      status: 'todo',
      assigneeAgentId: agentId,
    }),
  });
  const data = await res.json();
  console.log(`  Task created: ${data.identifier} — ${title}`);
  return data;
}

async function wakeAgent(agentId) {
  const res = await fetch(`${PAPERCLIP_URL}/agents/${agentId}/heartbeat/invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const data = await res.json();
  console.log(`  Agent woken: ${data.id?.slice(0, 8)} (${data.status})`);
  return data;
}

// ── Event handlers ─────────────────────────────────────────────────────────

async function handleBookingCreated(payload) {
  const booking = payload;
  const attendee = booking.attendees?.[0] || booking.responses?.name || {};
  const name = attendee.name || booking.responses?.name?.value || 'Customer';
  const email = attendee.email || booking.responses?.email?.value || '';
  const startTime = new Date(booking.startTime || booking.start);
  const date = startTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const eventTitle = booking.title || booking.eventTitle || 'AI Setup';
  const location = booking.location || booking.meetingUrl ? 'Remote via Zoom' : 'In-person';

  console.log(`\n📅 NEW BOOKING: ${name} — ${date} at ${time}`);

  // 1. Create confirmation task for Booking Coordinator
  await createTask(
    `Send booking confirmation to ${name}`,
    `New booking received!\n\n- Customer: ${name} (${email})\n- Service: ${eventTitle}\n- Date: ${date} at ${time}\n- Location: ${location}\n\nSend a confirmation email within 30 minutes. Include:\n- Date/time and service details\n- Prep instructions: "Have your computer on and connected to Wi-Fi"\n- For remote: Zoom link\n- For in-person: confirm address\n\nBe warm and reassuring — this customer may be nervous about technology.`,
    AGENTS.bookingCoordinator,
    'high',
  );
  await wakeAgent(AGENTS.bookingCoordinator);

  // 2. Notify Operations Manager
  await createTask(
    `New booking alert: ${name} on ${date}`,
    `A new booking just came in. Customer: ${name} (${email}), ${eventTitle} on ${date} at ${time}. Booking Coordinator has been assigned the confirmation task. Log this in your daily briefing.`,
    AGENTS.operationsManager,
    'medium',
  );
  await wakeAgent(AGENTS.operationsManager);
}

async function handleBookingCancelled(payload) {
  const booking = payload;
  const attendee = booking.attendees?.[0] || {};
  const name = attendee.name || 'Customer';

  console.log(`\n❌ BOOKING CANCELLED: ${name}`);

  await createTask(
    `Booking cancelled: ${name}`,
    `${name} cancelled their booking. Reason: ${booking.cancellationReason || 'Not provided'}. Reach out to understand why and offer to reschedule. Be empathetic — don't be pushy. Send reschedule link: cal.com/simplytech.ai`,
    AGENTS.leadHandler,
    'high',
  );
  await wakeAgent(AGENTS.leadHandler);
}

async function handleBookingRescheduled(payload) {
  const booking = payload;
  const attendee = booking.attendees?.[0] || {};
  const name = attendee.name || 'Customer';
  const startTime = new Date(booking.startTime || booking.start);
  const date = startTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const time = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  console.log(`\n🔄 BOOKING RESCHEDULED: ${name} → ${date} at ${time}`);

  await createTask(
    `Send rescheduled confirmation to ${name}`,
    `${name} rescheduled their booking to ${date} at ${time}. Send an updated confirmation email with the new date/time and all the usual prep details.`,
    AGENTS.bookingCoordinator,
    'high',
  );
  await wakeAgent(AGENTS.bookingCoordinator);
}

// ── HTTP server ────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'simply-ai-webhooks' }));
    return;
  }

  // Cal.com webhook
  if (req.method === 'POST' && req.url === '/webhook/calcom') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const event = JSON.parse(body);
        const triggerEvent = event.triggerEvent || event.trigger || '';
        const payload = event.payload || event;

        console.log(`\n[${new Date().toLocaleTimeString()}] Cal.com webhook: ${triggerEvent}`);

        switch (triggerEvent) {
          case 'BOOKING_CREATED':
            await handleBookingCreated(payload);
            break;
          case 'BOOKING_CANCELLED':
            await handleBookingCancelled(payload);
            break;
          case 'BOOKING_RESCHEDULED':
            await handleBookingRescheduled(payload);
            break;
          default:
            console.log(`  Unhandled event: ${triggerEvent}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      } catch (err) {
        console.error('  Webhook error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Simply AI Webhook Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Webhook: http://localhost:${PORT}/webhook/calcom`);
  console.log(`   Paperclip: ${PAPERCLIP_URL}`);
  console.log(`\n   Waiting for Cal.com events...\n`);
});
