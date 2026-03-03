import { useMemo, useState } from 'react';
import { Bot, X } from 'lucide-react';
import api from '../services/api';

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canAsk = useMemo(() => question.trim().length > 0 && !loading, [question, loading]);

  const ask = async () => {
    if (!canAsk) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await api.post('/ai/chat', {
        message: question.trim(),
        max_tokens: 320,
        temperature: 0.4,
      });
      const text = res.data?.data?.text || res.data?.text || '';
      if (!text) {
        setError('AI response empty');
      } else {
        setAnswer(String(text).trim());
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed right-4 z-[9998] w-[min(92vw,380px)] bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl overflow-hidden"
          style={{ bottom: 96 }}
        >
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="flex items-center gap-2 text-white font-bold">
              <Bot className="w-4 h-4" />
              <span>Daily AI</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white transition-colors"
              aria-label="Close AI widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Ask about markets, politics, crypto, trends..."
              className="w-full rounded-xl border border-surface-700 bg-surface-800 text-gray-100 p-3 text-sm outline-none focus:border-emerald-500 resize-none"
            />
            <button
              type="button"
              onClick={ask}
              disabled={!canAsk}
              className={`mt-2 w-full rounded-xl py-2 text-sm font-bold transition-colors ${
                canAsk ? 'bg-emerald-500 text-surface-900 hover:bg-emerald-400' : 'bg-surface-700 text-gray-500'
              }`}
            >
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            {answer && (
              <div className="mt-2 rounded-xl border border-surface-700 bg-surface-800 p-3 text-sm text-gray-200 whitespace-pre-wrap">
                {answer}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed right-4 z-[9999] w-14 h-14 rounded-full shadow-xl text-white bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
        style={{ bottom: 24 }}
      >
        <Bot className="w-6 h-6" />
      </button>
    </>
  );
}
