#!/usr/bin/env node
/**
 * Simply AI — Webhook + Email Server
 * Receives Cal.com webhooks → creates Paperclip tasks → agents can send emails.
 * Run: node webhook-server.mjs
 */

import http from 'node:http';
import { createTransport } from 'nodemailer';

const PORT = 3200;
const PAPERCLIP_URL = 'http://127.0.0.1:3100/api';
const COMPANY_ID = 'a9af7a13-74bd-4be3-a900-0a9b269c8cb1';

// Gmail SMTP
const mailer = createTransport({
  service: 'gmail',
  auth: {
    user: '4kylelee@gmail.com',
    pass: 'suci xtyo buee jdsq',
  },
});

// ── In-memory storage (persists until server restart) ──────────────────
const callLog = [];
const leadLog = [];

// Agent IDs
const AGENTS = {
  bookingCoordinator: '42b8a098-62b3-4c3e-aa9e-c24535c10c56',
  reviewAgent: 'faa7fdb6-d143-4eb0-95ff-e77303c19e27',
  leadHandler: '447674da-25a5-4be1-93b5-64894c7b0ac9',
  operationsManager: '850c8159-9e91-4f55-b12b-7b9b38ae56ff',
  contentAgent: '01fe0195-2e82-4c15-aba4-e41b9c85b19f',
};

// ── Paperclip helpers ──────────────────────────────────────────────────────

async function createTask(title, description, agentId, priority = 'high') {
  const res = await fetch(`${PAPERCLIP_URL}/companies/${COMPANY_ID}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority, status: 'todo', assigneeAgentId: agentId }),
  });
  const data = await res.json();
  console.log(`  📋 Task created: ${data.identifier} — ${title}`);
  return data;
}

async function wakeAgent(agentId) {
  const res = await fetch(`${PAPERCLIP_URL}/agents/${agentId}/heartbeat/invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const data = await res.json();
  console.log(`  ⚡ Agent woken: ${data.id?.slice(0, 8)} (${data.status})`);
  return data;
}

// ── Email sender ───────────────────────────────────────────────────────────

async function sendEmail(to, subject, body, replyTo) {
  const info = await mailer.sendMail({
    from: '"Simply AI" <4kylelee@gmail.com>',
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
    replyTo: replyTo || '4kylelee@gmail.com',
  });
  console.log(`  📧 Email sent to ${to}: ${info.messageId}`);
  return info;
}

// ── Cal.com event handlers ─────────────────────────────────────────────────

function extractBookingInfo(payload) {
  const attendee = payload.attendees?.[0] || payload.responses?.name || {};
  const name = attendee.name || payload.responses?.name?.value || 'Customer';
  const email = attendee.email || payload.responses?.email?.value || '';
  const startTime = new Date(payload.startTime || payload.start);
  const date = startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const time = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' });
  const eventTitle = payload.title || payload.eventTitle || 'AI Setup';
  const isRemote = !!(payload.meetingUrl || payload.location?.includes('daily') || payload.location?.includes('video'));
  const meetingUrl = payload.meetingUrl || '';

  // Determine tier from title
  let tier = 'Basic';
  let price = '$300';
  if (eventTitle.toLowerCase().includes('pro')) { tier = 'Pro'; price = '$500'; }
  if (eventTitle.toLowerCase().includes('premium')) { tier = 'Premium'; price = '$1,000'; }

  return { name, email, date, time, eventTitle, isRemote, meetingUrl, tier, price };
}

async function handleBookingCreated(payload) {
  const info = extractBookingInfo(payload);
  console.log(`\n📅 NEW BOOKING: ${info.name} — ${info.date} at ${info.time}`);

  // 1. Send confirmation email immediately
  if (info.email) {
    const emailBody = `Hi ${info.name},\n\nThank you for booking with Simply AI! Here are your appointment details:\n\n` +
      `📅 Date: ${info.date}\n` +
      `🕐 Time: ${info.time} (Pacific Time)\n` +
      `💼 Service: ${info.tier} AI Setup (${info.price})\n` +
      `📍 Location: ${info.isRemote ? 'Remote via Zoom' : 'In-person'}\n` +
      (info.meetingUrl ? `🔗 Meeting Link: ${info.meetingUrl}\n` : '') +
      `\n📋 Before your appointment, please:\n` +
      `• Have your computer turned on and connected to Wi-Fi\n` +
      `• Close any sensitive documents or files\n` +
      `• Have your computer login password ready\n` +
      `\nIf you need to reschedule, visit: cal.com/simplytech.ai\n` +
      `\nQuestions? Call us at (818) 600-6825 or reply to this email.\n` +
      `\nWe're excited to help you get started with AI!\n\n` +
      `— Kyle & the Simply AI team\n` +
      `simplyai.tech`;

    try {
      await sendEmail(info.email, `Your Simply AI Appointment — ${info.date}`, emailBody);
    } catch (err) {
      console.error(`  ❌ Email failed: ${err.message}`);
    }
  }

  // 2. Create task for Booking Coordinator (reminders, prep)
  await createTask(
    `Manage booking for ${info.name} on ${info.date}`,
    `Booking confirmed and confirmation email sent.\n\n- Customer: ${info.name} (${info.email})\n- Service: ${info.tier} AI Setup (${info.price})\n- Date: ${info.date} at ${info.time}\n- Location: ${info.isRemote ? 'Remote' : 'In-person'}\n\nTODO:\n1. Set up 24-hour reminder (send day before)\n2. Set up 1-hour reminder\n3. Confirm no calendar conflicts\n4. After appointment: hand off to Review Agent for follow-up`,
    AGENTS.bookingCoordinator,
    'high',
  );
  await wakeAgent(AGENTS.bookingCoordinator);

  // 3. Notify Operations Manager
  await createTask(
    `New booking: ${info.name} — ${info.tier} on ${info.date}`,
    `New booking received and confirmation sent. ${info.name} (${info.email}) booked ${info.tier} AI Setup for ${info.date} at ${info.time}. Booking Coordinator is handling reminders.`,
    AGENTS.operationsManager,
    'medium',
  );
}

async function handleBookingCancelled(payload) {
  const info = extractBookingInfo(payload);
  console.log(`\n❌ BOOKING CANCELLED: ${info.name}`);

  // Send cancellation acknowledgment
  if (info.email) {
    const emailBody = `Hi ${info.name},\n\nWe're sorry to see you cancel your appointment. We understand schedules can change!\n\n` +
      `If you'd like to reschedule, it's easy:\n` +
      `📅 Book a new time: cal.com/simplytech.ai\n` +
      `📞 Or call us: (818) 600-6825\n\n` +
      `We'd love to help you get started with AI whenever you're ready.\n\n` +
      `— Kyle & the Simply AI team`;

    try {
      await sendEmail(info.email, `Your Simply AI Appointment — Cancelled`, emailBody);
    } catch (err) {
      console.error(`  ❌ Email failed: ${err.message}`);
    }
  }

  await createTask(
    `Follow up on cancellation: ${info.name}`,
    `${info.name} cancelled their ${info.tier} booking. Cancellation reason: ${payload.cancellationReason || 'Not provided'}.\n\nReach out in 2-3 days with a gentle "still thinking about it?" message. Be warm, not pushy. Include booking link: cal.com/simplytech.ai`,
    AGENTS.leadHandler,
    'medium',
  );
  await wakeAgent(AGENTS.leadHandler);
}

async function handleBookingRescheduled(payload) {
  const info = extractBookingInfo(payload);
  console.log(`\n🔄 BOOKING RESCHEDULED: ${info.name} → ${info.date} at ${info.time}`);

  if (info.email) {
    const emailBody = `Hi ${info.name},\n\nYour appointment has been rescheduled! Here are your updated details:\n\n` +
      `📅 New Date: ${info.date}\n` +
      `🕐 New Time: ${info.time} (Pacific Time)\n` +
      `💼 Service: ${info.tier} AI Setup\n` +
      `📍 Location: ${info.isRemote ? 'Remote via Zoom' : 'In-person'}\n` +
      (info.meetingUrl ? `🔗 Meeting Link: ${info.meetingUrl}\n` : '') +
      `\nSame prep applies — have your computer on, connected to Wi-Fi, and ready to go!\n\n` +
      `Questions? Call (818) 600-6825 or reply to this email.\n\n` +
      `— Kyle & the Simply AI team`;

    try {
      await sendEmail(info.email, `Updated: Your Simply AI Appointment — ${info.date}`, emailBody);
    } catch (err) {
      console.error(`  ❌ Email failed: ${err.message}`);
    }
  }

  await createTask(
    `Update reminders for rescheduled booking: ${info.name}`,
    `${info.name} rescheduled to ${info.date} at ${info.time}. Confirmation email sent. Update any existing reminders for the new date/time.`,
    AGENTS.bookingCoordinator,
    'high',
  );
  await wakeAgent(AGENTS.bookingCoordinator);
}

// ── Agent email API ────────────────────────────────────────────────────────

async function handleSendEmail(body) {
  const { to, subject, text, html } = body;
  if (!to || !subject || (!text && !html)) {
    throw new Error('Missing required fields: to, subject, and text or html');
  }
  const info = await sendEmail(to, subject, text || '', null);
  return { sent: true, messageId: info.messageId };
}

// ── HTTP server ────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  const respond = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    return respond(200, { status: 'ok', service: 'simply-ai-webhooks', email: true });
  }

  // Call log API — GET /calls
  if (req.method === 'GET' && req.url === '/calls') {
    return respond(200, callLog);
  }

  // Leads API — GET /leads
  if (req.method === 'GET' && req.url === '/leads') {
    return respond(200, leadLog);
  }

  // Leads API — POST /leads (add a lead)
  if (req.method === 'POST' && req.url === '/leads') {
    const body = await readBody(req);
    try {
      const data = JSON.parse(body);
      const lead = {
        id: `lead-${Date.now()}`,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        source: data.source || 'CRM',
        status: data.status || 'new',
        interest: data.interest || '',
        followUpDate: data.followUpDate || null,
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      leadLog.unshift(lead);
      console.log(`  👤 Lead added: ${lead.name} (${lead.phone})`);
      return respond(200, lead);
    } catch (err) {
      return respond(500, { error: err.message });
    }
  }

  // Leads API — DELETE /leads/:id
  if (req.method === 'DELETE' && req.url?.startsWith('/leads/')) {
    const id = req.url.split('/leads/')[1];
    const idx = leadLog.findIndex(l => l.id === id);
    if (idx !== -1) {
      const removed = leadLog.splice(idx, 1)[0];
      console.log(`  🗑️ Lead deleted: ${removed.name}`);
      return respond(200, { deleted: true, id });
    }
    return respond(404, { error: 'Lead not found' });
  }

  // Calls API — DELETE /calls/:id
  if (req.method === 'DELETE' && req.url?.startsWith('/calls/')) {
    const id = req.url.split('/calls/')[1];
    const idx = callLog.findIndex(c => c.id === id);
    if (idx !== -1) {
      const removed = callLog.splice(idx, 1)[0];
      console.log(`  🗑️ Call deleted: ${removed.callerName || removed.callerPhone}`);
      return respond(200, { deleted: true, id });
    }
    return respond(404, { error: 'Call not found' });
  }

  // Cal.com webhook
  if (req.method === 'POST' && req.url === '/webhook/calcom') {
    const body = await readBody(req);
    try {
      const event = JSON.parse(body);
      const triggerEvent = event.triggerEvent || event.trigger || '';
      const payload = event.payload || event;

      console.log(`\n[${new Date().toLocaleTimeString()}] Cal.com webhook: ${triggerEvent}`);

      switch (triggerEvent) {
        case 'BOOKING_CREATED': await handleBookingCreated(payload); break;
        case 'BOOKING_CANCELLED': await handleBookingCancelled(payload); break;
        case 'BOOKING_RESCHEDULED': await handleBookingRescheduled(payload); break;
        default: console.log(`  Unhandled event: ${triggerEvent}`);
      }
      return respond(200, { received: true });
    } catch (err) {
      console.error('  Webhook error:', err.message);
      return respond(500, { error: err.message });
    }
  }

  // SkipCalls webhook — POST /webhook/skipcalls
  if (req.method === 'POST' && req.url === '/webhook/skipcalls') {
    const body = await readBody(req);
    try {
      const data = JSON.parse(body);
      console.log(`\n[${new Date().toLocaleTimeString()}] SkipCalls webhook received`);
      console.log(`  Event: ${data.event || data.type || 'unknown'}`);

      // Extract call data — handle various SkipCalls payload shapes
      const call = data.call || data.data || data;
      const callerPhone = call.caller_phone || call.callerPhone || call.from || call.phone || '';
      const callerName = call.caller_name || call.callerName || call.contact_name || '';
      const duration = call.duration || call.call_duration || 0;
      const summary = call.summary || call.ai_summary || call.transcript_summary || call.notes || '';
      const transcript = call.transcript || call.full_transcript || '';
      const direction = call.direction || call.type || 'inbound';
      const status = call.status || call.call_status || 'completed';
      const agentName = call.agent_name || call.receptionist_name || 'Simi';
      const didBook = call.booking_made || call.did_book || false;
      const callerEmail = call.caller_email || call.email || '';

      const displayName = callerName || callerPhone || 'Unknown Caller';

      console.log(`  📞 ${direction} call from ${displayName} (${callerPhone})`);
      console.log(`  Duration: ${duration}s | Booked: ${didBook}`);
      if (summary) console.log(`  Summary: ${summary.substring(0, 100)}`);

      // Store in call log
      callLog.unshift({
        id: `call-${Date.now()}`,
        callerName: callerName || null,
        callerPhone,
        date: new Date().toISOString(),
        duration: `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`,
        summary: summary || `${direction} call from ${displayName}`,
        transcript: transcript || null,
        didBook,
        followUpStatus: 'none',
        leadId: null,
      });
      if (callLog.length > 100) callLog.length = 100; // keep last 100

      // Create task for Lead Handler
      const taskTitle = didBook
        ? `New booking call from ${displayName}`
        : callerPhone
          ? `Follow up on call from ${displayName}`
          : `Process incoming call`;

      const taskDesc = [
        `📞 ${direction.charAt(0).toUpperCase() + direction.slice(1)} call handled by ${agentName}`,
        `Caller: ${displayName}${callerPhone ? ` (${callerPhone})` : ''}${callerEmail ? ` — ${callerEmail}` : ''}`,
        `Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`,
        `Status: ${status}`,
        didBook ? '✅ Customer booked during the call' : '❌ Customer did NOT book',
        summary ? `\nAI Summary: ${summary}` : '',
        transcript ? `\nTranscript available` : '',
        `\nAction needed:`,
        didBook
          ? `Verify the booking in Cal.com and send a confirmation.`
          : `Follow up within 2 hours. Send booking link: cal.com/simplytech.ai. Be warm and helpful.`,
      ].filter(Boolean).join('\n');

      await createTask(taskTitle, taskDesc, AGENTS.leadHandler, 'high');
      await wakeAgent(AGENTS.leadHandler);

      // If caller didn't book, also notify Operations Manager
      if (!didBook && callerPhone) {
        await createTask(
          `Missed opportunity: ${displayName} called but didn't book`,
          `${displayName} (${callerPhone}) called Simply AI but didn't book. Lead Handler has been assigned follow-up. Track this in your daily briefing.`,
          AGENTS.operationsManager,
          'medium',
        );
      }

      return respond(200, { received: true, caller: displayName });
    } catch (err) {
      console.error('  SkipCalls webhook error:', err.message);
      return respond(500, { error: err.message });
    }
  }

  // Agent email API — POST /send-email { to, subject, text }
  if (req.method === 'POST' && req.url === '/send-email') {
    const body = await readBody(req);
    try {
      const result = await handleSendEmail(JSON.parse(body));
      return respond(200, result);
    } catch (err) {
      console.error('  Email API error:', err.message);
      return respond(500, { error: err.message });
    }
  }

  respond(404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Simply AI Webhook + Email Server`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Webhook: http://localhost:${PORT}/webhook/calcom`);
  console.log(`   Email API: POST http://localhost:${PORT}/send-email`);
  console.log(`   Gmail: 4kylelee@gmail.com`);
  console.log(`\n   Waiting for events...\n`);
});
