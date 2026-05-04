import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertCircle, X } from 'lucide-react';
import { streamChat, buildSystemPrompt, MissingKeyError, type ChatMsg } from '../lib/openai';
import type { AilmentContent } from '../lib/content';
import clsx from 'clsx';

type Props = {
  ailment?: AilmentContent | null;
  onClose?: () => void;
};

export function ChatPanel({ ailment, onClose }: Props) {
  const [history, setHistory] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamBuf, setStreamBuf] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const system = buildSystemPrompt({ ailment: ailment ?? null });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamBuf]);

  async function send() {
    const txt = input.trim();
    if (!txt || loading) return;
    setInput('');
    setError('');
    const newHistory: ChatMsg[] = [...history, { role: 'user', content: txt }];
    setHistory(newHistory);
    setLoading(true);
    setStreamBuf('');
    try {
      let full = '';
      await streamChat(system, newHistory, (chunk) => {
        full += chunk;
        setStreamBuf(full);
      });
      setHistory([...newHistory, { role: 'assistant', content: full }]);
      setStreamBuf('');
    } catch (e) {
      const msg = e instanceof MissingKeyError
        ? 'Add your OpenAI key in Settings to use AI chat.'
        : e instanceof Error ? e.message : 'Error. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-brand-500" />
          <span className="font-semibold text-sm">
            {ailment ? `Ask about ${ailment.title}` : 'Ask anything'}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {history.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-10 text-center text-slate-400">
            <Bot size={36} className="opacity-30" />
            <p className="text-sm max-w-xs">
              {ailment
                ? `Ask me anything about ${ailment.title} — diet, symptoms, lifestyle tips.`
                : 'Ask me about any of the 9 common ailments — diet, symptoms, lifestyle.'}
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {history.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={14} className="text-brand-600 dark:text-brand-300" />
                </div>
              )}
              <div
                className={clsx(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm',
                )}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </motion.div>
          ))}
          {/* streaming bubble */}
          {streamBuf && (
            <motion.div
              key="stream"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 justify-start"
            >
              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={14} className="text-brand-600 dark:text-brand-300" />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                {streamBuf}
                <span className="inline-block w-1.5 h-3.5 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 text-sm">
            <AlertCircle size={15} />
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question…"
            className="flex-1 resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 max-h-28"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={send}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-full bg-brand-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
