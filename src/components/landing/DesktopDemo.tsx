import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, Mail, Calendar, Globe, Zap, FileText, Copy } from 'lucide-react';

interface ScenarioDef { command: string; appType: 'email' | 'research' | 'document' }

const SCENARIOS: readonly ScenarioDef[] = [
  { command: 'Send Mrs. Johnson a follow-up about her Tuesday appointment', appType: 'email' },
  { command: 'Research competitor pricing for dental offices in the Valley', appType: 'research' },
  { command: 'Write a proposal for the Martinez renovation project', appType: 'document' },
] as const;

type Phase = 'idle' | 'dock-bounce' | 'command-open' | 'typing' | 'processing'
  | 'app-open' | 'autofill' | 'action' | 'success' | 'reset';

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };
const dots = [0, 1, 2] as const;

function Lights({ o = 0.9 }: { o?: number }) {
  return (
    <div className="flex gap-1.5">
      {['#ff5f57', '#febc2e', '#28c840'].map(c => (
        <div key={c} className="w-[7px] h-[7px] rounded-full" style={{ background: c, opacity: o }} />
      ))}
    </div>
  );
}

function DockIcon({ isAI, glowing, bouncing, children }: {
  isAI?: boolean; glowing?: boolean; bouncing?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div className="relative flex flex-col items-center"
      animate={bouncing ? { y: [0, -8, 0, -4, 0] } : { y: 0 }}
      transition={bouncing ? { duration: 0.45, ease: 'easeOut' } : {}}>
      <div className={`relative w-7 h-7 sm:w-9 sm:h-9 rounded-[22%] flex items-center justify-center border border-white/10 ${isAI ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-white/[0.07]'}`}>
        {children}
        {glowing && <motion.div className="absolute inset-0 rounded-[22%] bg-blue-500/30"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />}
      </div>
      {isAI && <div className="w-1 h-1 rounded-full bg-blue-400/70 mt-0.5" />}
    </motion.div>
  );
}

function Cursor() {
  return <motion.span className="inline-block w-[1.5px] h-[11px] bg-blue-400 ml-0.5 align-middle"
    animate={{ opacity: [1, 0] }} transition={{ duration: 0.55, repeat: Infinity }} />;
}

function EmailContent({ step }: { step: number }) {
  const fields = [{ l: 'To', v: 'johnson@email.com' }, { l: 'Subject', v: 'Your Tuesday appointment' }];
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-1.5 space-y-1 border-b border-white/[0.06]">
        {fields.map((f, i) => (
          <div key={f.l} className="flex items-center gap-2">
            <span className="text-[8px] sm:text-[9px] text-white/30 w-8 shrink-0">{f.l}:</span>
            <span className="text-[9px] sm:text-[10px] text-white/70 font-mono">{step > i ? f.v : '\u00A0'}</span>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 flex-1">
        <p className="text-[8px] sm:text-[9px] text-white/60 leading-relaxed whitespace-pre-line">
          {step > 2 ? 'Hi Mrs. Johnson,\n\nJust confirming your appointment this Tuesday at 2pm. Please let us know if you need to reschedule.\n\nBest regards' : '\u00A0'}
        </p>
      </div>
    </div>
  );
}

function ResearchContent({ step }: { step: number }) {
  const rows = [
    { n: 'Valley Dental Care', p: '$150/cleaning' },
    { n: 'Smile Studio Encino', p: '$175/cleaning' },
    { n: 'LA Dental Group', p: '$125/cleaning' },
  ];
  return (
    <div className="px-3 py-2 space-y-1.5">
      <p className="text-[8px] sm:text-[9px] text-white/40 font-medium">Competitor pricing results</p>
      {rows.map((r, i) => (
        <motion.div key={r.n} initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: step > i ? 1 : 0, x: step > i ? 0 : -6 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between bg-white/[0.04] rounded-md px-2.5 py-1.5">
          <span className="text-[9px] sm:text-[10px] text-white/70">{r.n}</span>
          <span className="text-[9px] sm:text-[10px] text-blue-400 font-mono">{r.p}</span>
        </motion.div>
      ))}
      {step > 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-1 px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-[8px] sm:text-[9px] text-blue-300">Average: $150 | Your price is competitive</p>
        </motion.div>
      )}
    </div>
  );
}

function DocumentContent({ step }: { step: number }) {
  const s = [
    { t: 'Project Scope', b: 'Complete interior renovation including kitchen, master bath, and flooring throughout.' },
    { t: 'Timeline', b: '6-8 weeks' },
    { t: 'Estimated Cost', b: '$45,000' },
  ];
  return (
    <div className="px-3 py-2 space-y-2">
      <p className="text-[10px] sm:text-[11px] text-white/80 font-semibold">Renovation Proposal — Martinez Residence</p>
      <div className="w-8 h-px bg-blue-500/40" />
      {s.map((x, i) => (
        <motion.div key={x.t} initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : 4 }} transition={{ duration: 0.3 }}>
          <p className="text-[8px] sm:text-[9px] text-white/50 font-medium uppercase tracking-wider">{x.t}</p>
          <p className="text-[9px] sm:text-[10px] text-white/70 leading-relaxed mt-0.5">{x.b}</p>
        </motion.div>
      ))}
      {step > 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 mt-1 border-t border-white/[0.06]">
          <div className="w-20 h-px bg-white/20" />
          <p className="text-[8px] text-white/30 mt-1">Authorized Signature</p>
        </motion.div>
      )}
    </div>
  );
}

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; ok: string }> = {
  email: { label: 'Send', icon: <Mail className="w-2.5 h-2.5" />, ok: 'Email sent!' },
  research: { label: 'Copy to clipboard', icon: <Copy className="w-2.5 h-2.5" />, ok: 'Copied!' },
  document: { label: 'Save as PDF', icon: <FileText className="w-2.5 h-2.5" />, ok: 'Saved to Documents' },
};
const APP_TITLES: Record<string, string> = { email: 'Mail', research: 'Research', document: 'Documents' };
const bezel = { background: 'linear-gradient(to bottom, #2a2a2c, #1c1c1e)' };

export function DesktopDemo() {
  const reduceMotion = useReducedMotion();
  const alive = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState(0);
  const [fill, setFill] = useState(0);
  const sc = SCENARIOS[idx];
  const meta = useMemo(() => ACTION_META[sc.appType], [sc.appType]);
  const title = useMemo(() => APP_TITLES[sc.appType], [sc.appType]);

  useEffect(() => { alive.current = true; return () => { alive.current = false; timers.current.forEach(clearTimeout); }; }, []);

  const wait = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => { if (alive.current) fn(); }, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduceMotion) return;
    const map: Partial<Record<Phase, [() => void, number]>> = {
      idle: [() => setPhase('dock-bounce'), 1000],
      'dock-bounce': [() => setPhase('command-open'), 700],
      'command-open': [() => setPhase('typing'), 400],
      processing: [() => setPhase('app-open'), 500],
      'app-open': [() => { setFill(0); setPhase('autofill'); }, 600],
      success: [() => setPhase('reset'), 1800],
    };
    if (phase === 'autofill') {
      const max = sc.appType === 'email' ? 3 : 4;
      wait(fill >= max ? () => setPhase('action') : () => setFill(n => n + 1), fill >= max ? 400 : 500);
      return;
    }
    if (phase === 'action') { wait(() => setPhase('success'), 700); return; }
    if (phase === 'reset') {
      wait(() => { setIdx(i => (i + 1) % SCENARIOS.length); setTyped(0); setFill(0); setPhase('idle'); }, 1000);
      return;
    }
    const e = map[phase];
    if (e) wait(e[0], e[1]);
  }, [phase, fill, reduceMotion, wait, sc.appType]);

  useEffect(() => {
    if (phase !== 'typing' || reduceMotion) return;
    if (typed >= sc.command.length) { wait(() => setPhase('processing'), 400); return; }
    const id = wait(() => setTyped(n => n + 1), Math.random() * 18 + 35);
    return () => clearTimeout(id);
  }, [phase, typed, sc.command.length, reduceMotion, wait]);

  const cmdBar = ['command-open', 'typing', 'processing'].includes(phase);
  const appWin = ['app-open', 'autofill', 'action', 'success'].includes(phase);
  const ok = phase === 'success';

  if (reduceMotion) {
    return (
      <div className="w-full max-w-[600px] mx-auto">
        <div className="rounded-t-xl border border-white/[0.08] p-1.5" style={bezel}>
          <div className="bg-[#0e0e10] rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
              <Lights o={0.5} /><span className="text-[9px] text-white/40 ml-2">AI Assistant</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-mono text-blue-400 mb-2">{SCENARIOS[0].command}</p>
              <div className="bg-white/[0.05] rounded-md p-2.5">
                <p className="text-[9px] text-white/60">Email composed and sent to johnson@email.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-3 rounded-b-xl border border-t-0 border-white/[0.08]" style={bezel} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <motion.div animate={{ opacity: phase === 'reset' ? 0 : 1 }} transition={{ duration: 0.45 }}>
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl blur-[60px] -z-10"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.08), transparent 70%)' }} aria-hidden="true" />

          <div className="rounded-t-xl sm:rounded-t-2xl border border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.5)]"
            style={{ ...bezel, padding: '6px 6px 0' }}>
            <div className="relative bg-[#0c0c0e] rounded-lg sm:rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
              <div className="absolute inset-0 z-30 pointer-events-none"
                style={{ background: 'linear-gradient(165deg, rgba(255,255,255,0.02), transparent 40%)' }} aria-hidden="true" />
              <div className="absolute inset-0">
                <div className="absolute top-[20%] left-[25%] w-[45%] h-[40%] rounded-full bg-blue-600/[0.07] blur-[80px]" />
                <div className="absolute bottom-[15%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/[0.05] blur-[60px]" />
              </div>

              <div className="relative z-20 flex items-center justify-between px-3 py-[3px] bg-black/40 backdrop-blur-sm border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="text-[8px] sm:text-[9px] text-white/50 font-semibold">&#63743;</span>
                  {['Finder', 'File', 'Edit', 'View'].map(t => (
                    <span key={t} className="text-[7px] sm:text-[8px] text-white/35">{t}</span>
                  ))}
                </div>
                <span className="text-[7px] sm:text-[8px] text-white/35">
                  {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>

              <div className="absolute top-[15%] left-[5%] w-[35%] h-[50%] bg-white/[0.02] rounded-lg border border-white/[0.03] z-10" />

              <AnimatePresence>
                {cmdBar && (
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }} transition={{ ...spring, stiffness: 400, damping: 28 }}
                    className="absolute left-[12%] right-[12%] top-[28%] z-20">
                    <div className="bg-[#1c1c20]/90 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.12)] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                          <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] sm:text-[10px] font-mono text-white/85">
                            {phase === 'command-open' ? '' : sc.command.slice(0, typed)}
                          </span>
                          {(phase === 'typing' || phase === 'command-open') && <Cursor />}
                        </div>
                      </div>
                      {phase === 'processing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 pb-2 flex items-center gap-2">
                          <motion.div className="flex gap-0.5" animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}>
                            {dots.map(i => <motion.div key={i} className="w-1 h-1 rounded-full bg-blue-400"
                              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />)}
                          </motion.div>
                          <span className="text-[8px] text-white/30 italic">Working on it...</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {appWin && (
                  <motion.div initial={{ opacity: 0, y: 60, scale: 0.88 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={ok ? { opacity: 0, y: -30, scale: 0.95 } : { opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="absolute inset-x-[8%] top-[10%] bottom-[18%] bg-[#1a1a1e]/95 backdrop-blur-xl rounded-xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] shrink-0 bg-[#1e1e22]/80">
                      <Lights />
                      <span className="text-[8px] sm:text-[9px] font-medium text-white/40 ml-2">{title}</span>
                      <div className="ml-auto flex gap-1">
                        {SCENARIOS.map((_, i) => <div key={i} className={`w-1 h-1 rounded-full ${i === idx ? 'bg-blue-500' : 'bg-white/15'}`} />)}
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                      {sc.appType === 'email' && <EmailContent step={fill} />}
                      {sc.appType === 'research' && <ResearchContent step={fill} />}
                      {sc.appType === 'document' && <DocumentContent step={fill} />}
                    </div>
                    <div className="px-3 py-2 border-t border-white/[0.06] shrink-0 flex justify-end">
                      <AnimatePresence mode="wait">
                        {!ok ? (
                          <motion.button key="btn" initial={{ opacity: 0 }}
                            animate={{ opacity: phase === 'action' ? 1 : 0.5 }}
                            exit={{ opacity: 0, scale: 0.9 }} whileTap={{ scale: 0.92 }}
                            className="flex items-center gap-1.5 bg-blue-500 text-white text-[8px] sm:text-[9px] font-medium px-3 py-1 rounded-md">
                            {meta.icon}{meta.label}
                          </motion.button>
                        ) : (
                          <motion.div key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                              <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={3} />
                            </motion.div>
                            <span className="text-[9px] sm:text-[10px] font-medium text-green-400">{meta.ok}</span>
                            {[0, 1, 2, 3].map(i => (
                              <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-green-400/70"
                                initial={{ opacity: 1, x: 0, y: 0 }}
                                animate={{ opacity: 0, x: (i % 2 === 0 ? 1 : -1) * (8 + i * 4), y: -(6 + i * 3) }}
                                transition={{ duration: 0.6, ease: 'easeOut' }} />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1.5 sm:gap-2 bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-2.5 sm:px-3 py-1.5 z-20">
                <DockIcon><Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300/60" strokeWidth={1.5} /></DockIcon>
                <DockIcon><Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-300/60" strokeWidth={1.5} /></DockIcon>
                <DockIcon><Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" strokeWidth={1.5} /></DockIcon>
                <div className="w-px h-5 sm:h-6 bg-white/10 mx-0.5" />
                <DockIcon isAI glowing bouncing={phase === 'dock-bounce'}>
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={2} />
                </DockIcon>
              </div>
            </div>
          </div>

          <div className="h-3 sm:h-4 rounded-b-xl sm:rounded-b-2xl border border-t-0 border-white/[0.08] relative" style={bezel}>
            <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 sm:h-1.5 rounded-sm bg-white/[0.04]" />
          </div>
          <div className="bg-black/20 h-[2px] w-[75%] mx-auto rounded-b-sm blur-[1px]" />
        </div>
      </motion.div>
    </div>
  );
}
