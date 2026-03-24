#!/usr/bin/env node
/**
 * SimplyAI — Pixel Agent Monitor
 * Serves agent-hq.html + /api/status endpoint.
 */
import http from 'node:http';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT     = 4242;
const __dir    = path.dirname(fileURLToPath(import.meta.url));
const HTML_FILE = path.join(__dir, 'agent-hq.html');

const AGENTS = [
  {
    id: 'mobile',
    outputFile: '/private/tmp/claude-501/-Users-kyleopenclaw/2730cbe0-b344-4992-8fc8-0dba2fb4d49f/tasks/a16fa53b9413c2ad8.output',
  },
  {
    id: 'webhook',
    outputFile: '/private/tmp/claude-501/-Users-kyleopenclaw/2730cbe0-b344-4992-8fc8-0dba2fb4d49f/tasks/a1a47e5c48bcb8df1.output',
  },
];

function parseActivity(filePath) {
  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); } catch {
    return { status: 'waiting', events: [], currentTool: null, currentText: '' };
  }
  const lines = raw.split('\n').filter(l => l.trim());
  const events = [];
  let status = 'running';
  let currentTool = null;
  let currentText = '';

  for (const line of lines) {
    try {
      const msg = JSON.parse(line);

      if (msg.type === 'assistant' && msg.message?.content) {
        for (const block of msg.message.content) {
          if (block.type === 'tool_use') {
            const tool  = block.name;
            const input = block.input || {};
            let detail  = '';
            if (['Edit', 'Write'].includes(tool)) detail = input.file_path?.split('/').pop() || '';
            else if (tool === 'Read')  detail = input.file_path?.split('/').pop() || '';
            else if (tool === 'Bash')  detail = (input.command || '').replace(/\s+/g, ' ').slice(0, 55);
            else if (tool === 'Grep')  detail = (input.pattern  || '').slice(0, 40);
            events.push({ kind: 'tool', tool, detail, ts: msg.timestamp });
            currentTool = tool;
          }
          if (block.type === 'text' && block.text?.trim()) {
            const text = block.text.trim().slice(0, 100);
            events.push({ kind: 'thought', text, ts: msg.timestamp });
            currentText = text;
          }
        }
        if (msg.message.stop_reason === 'end_turn') {
          const hasLong = msg.message.content.some(b => b.type === 'text' && b.text?.length > 80);
          if (hasLong) { status = 'done'; currentTool = null; }
        }
      }

      if (msg.type === 'user' && msg.message?.content) {
        for (const block of msg.message.content) {
          if (block.is_error) {
            events.push({ kind: 'error', text: String(block.content || '').slice(0, 80), ts: msg.timestamp });
          }
        }
      }
    } catch { /* skip malformed lines */ }
  }

  return { status, events: events.slice(-50), currentTool, currentText: currentText.slice(0, 80) };
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    const agents = AGENTS.map(a => ({ id: a.id, ...parseActivity(a.outputFile) }));
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(JSON.stringify({ agents, ts: Date.now() }));
    return;
  }

  // Serve HTML
  try {
    const html = fs.readFileSync(HTML_FILE, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' });
    res.end(html);
  } catch {
    res.writeHead(500);
    res.end('Could not read agent-hq.html');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  SimplyAI — Pixel Agent HQ');
  console.log('  http://localhost:' + PORT + '\n');
});
