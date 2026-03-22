#!/usr/bin/env node
/**
 * Simply AI — ElevenLabs Post-Call Webhook Server
 * Receives ElevenLabs post-call webhooks → logs calls → creates Paperclip tasks → sends Telegram alerts.
 * Run: node elevenlabs-webhook.mjs
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const PORT = 3201;
const PAPERCLIP_URL = 'http://127.0.0.1:3100/api';
const COMPANY_ID = 'a9af7a13-74bd-4be3-a900-0a9b269c8cb1';
const CALCOM_USERNAME = 'simplytech.ai';
const CALCOM_BOOKING_URL = `https://cal.com/${CALCOM_USERNAME}`;

// ElevenLabs agent ID for validation (optional)
const ELEVENLABS_AGENT_ID = 'agent_4501kmad398vfvxv9bd6ztm5abg6';

// Env vars
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const CAL_API_KEY = process.env.CAL_API_KEY || process.env.VITE_CALCOM_API_KEY || '';
const ELEVENLABS_WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || '';

// Cal.com event slugs → display names
const CAL_EVENTS = {
  'basic-ai-setup-300': { name: 'Basic AI Setup', price: '$300' },
  'pro-ai-setup-500': { name: 'Pro AI Setup', price: '$500' },
  'premium-ai-setup-1000': { name: 'Premium AI Setup', price: '$1,000' },
};

// Paperclip agent IDs (same as webhook-server.mjs)
const AGENTS = {
  bookingCoordinator: '42b8a098-62b3-4c3e-aa9e-c24535c10c56',
  leadHandler: '447674da-25a5-4be1-93b5-64894c7b0ac9',
  operationsManager: '850c8159-9e91-4f55-b12b-7b9b38ae56ff',
};

// ── Call log file ─────────────────────────────────────────────────────────────
const CALL_LOG_PATH = path.join(__dirname, 'elevenlabs-calls.json');

function loadCallLog() {
  try {
    const data = fs.readFileSync(CALL_LOG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveCallLog(log) {
  fs.writeFileSync(CALL_LOG_PATH, JSON.stringify(log, null, 2));
}

function appendCall(entry) {
  const log = loadCallLog();
  log.unshift(entry);
  // Keep last 500 calls
  if (log.length > 500) log.length = 500;
  saveCallLog(log);
  return log;
}

// ── Telegram ──────────────────────────────────────────────────────────────────
async function sendTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('  [telegram] Skipped — no bot token or chat ID configured');
    return null;
  }
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    const data = await res.json();
    if (data.ok) {
      console.log('  [telegram] Notification sent');
    } else {
      console.error('  [telegram] Failed:', data.description);
    }
    return data;
  } catch (err) {
    console.error('  [telegram] Error:', err.message);
    return null;
  }
}

// ── Paperclip helpers ─────────────────────────────────────────────────────────
async function createTask(title, description, agentId, priority = 'high') {
  try {
    const res = await fetch(`${PAPERCLIP_URL}/companies/${COMPANY_ID}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority, status: 'todo', assigneeAgentId: agentId }),
    });
    const data = await res.json();
    console.log(`  [paperclip] Task created: ${data.identifier} — ${title}`);
    return data;
  } catch (err) {
    console.error(`  [paperclip] Task creation failed: ${err.message}`);
    return null;
  }
}

async function wakeAgent(agentId) {
  try {
    const res = await fetch(`${PAPERCLIP_URL}/agents/${agentId}/heartbeat/invoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const data = await res.json();
    console.log(`  [paperclip] Agent woken: ${data.id?.slice(0, 8)} (${data.status})`);
    return data;
  } catch (err) {
    console.error(`  [paperclip] Wake agent failed: ${err.message}`);
    return null;
  }
}

// ── ElevenLabs payload parsing ────────────────────────────────────────────────
function parseElevenLabsPayload(body) {
  // ElevenLabs actual webhook format (verified 2026-03-22):
  // { type: "post_call_transcription", event_timestamp, data: { agent_id, status, user_id, metadata, analysis, transcript } }
  // - data.metadata.call_duration_secs
  // - data.analysis.data_collection_results.{field}.value
  // - data.analysis.transcript_summary
  // - data.analysis.call_successful
  // - data.transcript = array of { role, message, time_in_call_secs }
  // - data.user_id = caller phone number
  // - data.conversation_id = unique call ID

  const d = body.data || body;
  const metadata = d.metadata || {};
  const analysis = d.analysis || {};
  const dcr = analysis.data_collection_results || {};

  // Helper to extract collected data field values
  const getField = (key) => dcr[key]?.value || '';

  const callId = d.conversation_id || body.call_id || `el-${Date.now()}`;
  const agentId = d.agent_id || '';
  const status = d.status || 'completed';
  const durationSecs = metadata.call_duration_secs || 0;
  const startTime = metadata.start_time_unix_secs ? new Date(metadata.start_time_unix_secs * 1000).toISOString() : null;
  const endTime = null;

  // Transcript — array of turns with role + message
  let transcript = '';
  const rawTranscript = d.transcript || [];
  if (typeof rawTranscript === 'string') {
    transcript = rawTranscript;
  } else if (Array.isArray(rawTranscript)) {
    transcript = rawTranscript
      .map((turn) => `${turn.role || 'unknown'}: ${turn.message || turn.text || ''}`)
      .join('\n');
  }

  const summary = analysis.transcript_summary || analysis.call_summary || '';
  const callSuccessful = analysis.call_successful;

  // Collected fields from agent's data collection
  const businessName = getField('business_name');
  const contactName = getField('contact_name');
  const contactEmail = getField('contact_email');
  const contactPhone = getField('contact_phone') || d.user_id || '';
  const interestLevel = (getField('interest_level') || '').toLowerCase();

  // Direction from type
  const direction = body.type || 'unknown';

  return {
    callId,
    agentId,
    status,
    startTime,
    endTime,
    durationSecs,
    transcript,
    summary,
    callSuccessful,
    businessName,
    contactName,
    contactEmail,
    contactPhone,
    interestLevel,
    direction,
    raw: body,
  };
}

// ── Interest level classification ─────────────────────────────────────────────
function isHighInterest(level) {
  const high = ['high', 'interested', 'very interested', 'hot', 'ready', 'yes'];
  return high.some((h) => level.includes(h));
}

function isLowInterest(level) {
  const low = ['low', 'not interested', 'not_interested', 'no', 'cold', 'none'];
  return low.some((l) => level.includes(l));
}

// ── Build booking links ───────────────────────────────────────────────────────
function buildBookingLinks(contactName, contactEmail) {
  const params = new URLSearchParams();
  if (contactName) params.set('name', contactName);
  if (contactEmail) params.set('email', contactEmail);
  const qs = params.toString() ? `?${params.toString()}` : '';

  return Object.entries(CAL_EVENTS).map(([slug, info]) => ({
    slug,
    name: info.name,
    price: info.price,
    url: `${CALCOM_BOOKING_URL}/${slug}${qs}`,
  }));
}

// ── Handle high-interest call ─────────────────────────────────────────────────
async function handleHighInterest(parsed) {
  const { contactName, contactEmail, contactPhone, businessName, summary, durationSecs } = parsed;
  const displayName = contactName || businessName || contactPhone || 'Unknown Lead';
  const bookingLinks = buildBookingLinks(contactName, contactEmail);

  console.log(`  [high-interest] Processing lead: ${displayName}`);

  // 1. Create Paperclip follow-up task
  const taskDesc = [
    `HOT LEAD from ElevenLabs call (Simi)`,
    ``,
    `Contact: ${displayName}`,
    businessName ? `Business: ${businessName}` : '',
    contactEmail ? `Email: ${contactEmail}` : '',
    contactPhone ? `Phone: ${contactPhone}` : '',
    `Interest: ${parsed.interestLevel}`,
    `Call Duration: ${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`,
    summary ? `\nCall Summary: ${summary}` : '',
    ``,
    `Booking Links:`,
    ...bookingLinks.map((l) => `  - ${l.name} (${l.price}): ${l.url}`),
    ``,
    `ACTION: Follow up ASAP. Send booking link via email/text. Be warm and enthusiastic.`,
  ].filter(Boolean).join('\n');

  await createTask(
    `HOT LEAD: Follow up with ${displayName}`,
    taskDesc,
    AGENTS.leadHandler,
    'urgent',
  );
  await wakeAgent(AGENTS.leadHandler);

  // 2. Notify Operations Manager
  await createTask(
    `New hot lead from Simi call: ${displayName}`,
    `${displayName} showed high interest during a call with Simi. Lead Handler has been assigned. Track in daily briefing.\n\n${summary || 'No summary available.'}`,
    AGENTS.operationsManager,
    'high',
  );

  // 3. Send Telegram notification
  const telegramMsg = [
    `🔥 HOT LEAD from Simi Call`,
    ``,
    `👤 *${displayName}*`,
    businessName ? `🏢 ${businessName}` : '',
    contactPhone ? `📞 ${contactPhone}` : '',
    contactEmail ? `📧 ${contactEmail}` : '',
    `⏱ Call: ${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`,
    `📊 Interest: ${parsed.interestLevel}`,
    summary ? `\n📝 ${summary}` : '',
    ``,
    `📅 *Booking Links:*`,
    ...bookingLinks.map((l) => `  [${l.name} (${l.price})](${l.url})`),
  ].filter(Boolean).join('\n');

  await sendTelegram(telegramMsg);
}

// ── Handle low-interest call ──────────────────────────────────────────────────
async function handleLowInterest(parsed) {
  const { contactName, contactPhone, businessName, summary, durationSecs } = parsed;
  const displayName = contactName || businessName || contactPhone || 'Unknown';

  console.log(`  [low-interest] Logging call from: ${displayName}`);

  // Brief Telegram summary (optional, but useful for awareness)
  const telegramMsg = [
    `📞 Simi Call — Low Interest`,
    `👤 ${displayName}`,
    contactPhone ? `📞 ${contactPhone}` : '',
    `⏱ ${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`,
    summary ? `📝 ${summary.substring(0, 200)}` : '',
  ].filter(Boolean).join('\n');

  await sendTelegram(telegramMsg);
}

// ── Handle medium/unknown interest ────────────────────────────────────────────
async function handleMediumInterest(parsed) {
  const { contactName, contactPhone, businessName, summary, durationSecs } = parsed;
  const displayName = contactName || businessName || contactPhone || 'Unknown';
  const bookingLinks = buildBookingLinks(parsed.contactName, parsed.contactEmail);

  console.log(`  [medium-interest] Processing: ${displayName}`);

  // Create a standard follow-up task
  await createTask(
    `Follow up on Simi call with ${displayName}`,
    [
      `Simi spoke with ${displayName}. Interest level: ${parsed.interestLevel || 'not assessed'}.`,
      businessName ? `Business: ${businessName}` : '',
      parsed.contactEmail ? `Email: ${parsed.contactEmail}` : '',
      contactPhone ? `Phone: ${contactPhone}` : '',
      `Duration: ${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`,
      summary ? `\nSummary: ${summary}` : '',
      ``,
      `Booking Links:`,
      ...bookingLinks.map((l) => `  - ${l.name} (${l.price}): ${l.url}`),
      ``,
      `ACTION: Reach out within 24 hours. Gauge interest and share booking link if appropriate.`,
    ].filter(Boolean).join('\n'),
    AGENTS.leadHandler,
    'medium',
  );
  await wakeAgent(AGENTS.leadHandler);

  // Telegram notification
  const telegramMsg = [
    `📞 Simi Call — Medium Interest`,
    `👤 ${displayName}`,
    contactPhone ? `📞 ${contactPhone}` : '',
    `📊 Interest: ${parsed.interestLevel || 'unknown'}`,
    `⏱ ${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`,
    summary ? `📝 ${summary.substring(0, 200)}` : '',
  ].filter(Boolean).join('\n');

  await sendTelegram(telegramMsg);
}

// ── HTTP server ────────────────────────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  const respond = (code, data) => {
    res.writeHead(code, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(JSON.stringify(data));
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return respond(204, '');
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    return respond(200, {
      status: 'ok',
      service: 'elevenlabs-webhook',
      telegram: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
      calApiKey: !!CAL_API_KEY,
    });
  }

  // Get call log
  if (req.method === 'GET' && req.url === '/calls') {
    return respond(200, loadCallLog());
  }

  // ElevenLabs post-call webhook
  if (req.method === 'POST' && req.url === '/elevenlabs/post-call') {
    const rawBody = await readBody(req);

    try {
      const body = JSON.parse(rawBody);

      // Dump raw payload for debugging
      const debugPath = path.join(__dirname, 'elevenlabs-raw-payload.json');
      fs.writeFileSync(debugPath, JSON.stringify(body, null, 2));
      console.log(`\n  [debug] Raw payload saved to ${debugPath}`);
      console.log(`  [debug] Top-level keys: ${Object.keys(body).join(', ')}`);

      const parsed = parseElevenLabsPayload(body);

      console.log(`\n[${new Date().toLocaleTimeString()}] ElevenLabs post-call webhook`);
      console.log(`  Call ID: ${parsed.callId}`);
      console.log(`  Contact: ${parsed.contactName || parsed.contactPhone || 'unknown'}`);
      console.log(`  Business: ${parsed.businessName || 'n/a'}`);
      console.log(`  Interest: ${parsed.interestLevel || 'not assessed'}`);
      console.log(`  Duration: ${Math.floor(parsed.durationSecs / 60)}m ${parsed.durationSecs % 60}s`);
      if (parsed.summary) console.log(`  Summary: ${parsed.summary.substring(0, 120)}`);

      // Optional: validate agent ID
      if (parsed.agentId && parsed.agentId !== ELEVENLABS_AGENT_ID) {
        console.log(`  [warn] Agent ID mismatch: got ${parsed.agentId}, expected ${ELEVENLABS_AGENT_ID}`);
      }

      // Log to JSON file (all calls)
      const logEntry = {
        id: parsed.callId,
        agentId: parsed.agentId,
        direction: parsed.direction,
        contactName: parsed.contactName || null,
        contactPhone: parsed.contactPhone || null,
        contactEmail: parsed.contactEmail || null,
        businessName: parsed.businessName || null,
        interestLevel: parsed.interestLevel || null,
        durationSecs: parsed.durationSecs,
        summary: parsed.summary || null,
        transcript: parsed.transcript || null,
        status: parsed.status,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        receivedAt: new Date().toISOString(),
      };
      appendCall(logEntry);
      console.log(`  [log] Call saved to ${CALL_LOG_PATH}`);

      // Route based on interest level
      if (isHighInterest(parsed.interestLevel)) {
        await handleHighInterest(parsed);
      } else if (isLowInterest(parsed.interestLevel)) {
        await handleLowInterest(parsed);
      } else {
        // Medium or unassessed interest — still follow up
        await handleMediumInterest(parsed);
      }

      return respond(200, { received: true, callId: parsed.callId, interest: parsed.interestLevel });
    } catch (err) {
      console.error(`  [error] Webhook processing failed: ${err.message}`);
      console.error(err.stack);
      return respond(500, { error: err.message });
    }
  }

  respond(404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`\nSimply AI — ElevenLabs Webhook Server`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  Webhook: POST http://localhost:${PORT}/elevenlabs/post-call`);
  console.log(`  Call Log: GET http://localhost:${PORT}/calls`);
  console.log(`  Telegram: ${TELEGRAM_BOT_TOKEN ? 'configured' : 'NOT configured'}`);
  console.log(`  Cal.com API: ${CAL_API_KEY ? 'configured' : 'NOT configured'}`);
  console.log(`  Agent ID: ${ELEVENLABS_AGENT_ID}`);
  console.log(`  Call log file: ${CALL_LOG_PATH}`);
  console.log(`\n  Waiting for ElevenLabs webhooks...\n`);
});
