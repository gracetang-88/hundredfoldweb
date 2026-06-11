'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* Renders message text, converting site paths like /quote into clickable links. */
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(\/(?:services\/[a-z-]+|services|quote|contact|media)\b)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('/') ? (
          <a key={i} href={part} className="underline font-medium text-emerald-700 hover:text-emerald-800">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ChatWidget() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const greeting = en
    ? "Hi! 👋 I'm HundredFold's assistant. Ask me about life insurance, annuities, business insurance, travel insurance, or tax services — I'll point you the right way."
    : '您好！👋 我是百福的智能助手。人寿保险、年金、商业保险、旅游保险、税务服务 — 有任何问题都可以问我，我来为您指路。';

  const quickQuestions = en
    ? ['Get a travel insurance quote', 'Insurance for my business', 'What documents for tax filing?', 'Life insurance options']
    : ['旅游保险报价', '我的企业需要保险', '报税需要什么文件？', '人寿保险有哪些选择'];

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply ?? '...' }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: en
            ? 'Sorry, something went wrong. Please try again or reach us at /contact.'
            : '抱歉，出了点问题。请重试，或通过 /contact 联系我们。',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center text-2xl"
        aria-label={en ? 'Chat with us' : '在线咨询'}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-5 py-4">
            <h3 className="font-semibold">
              {en ? 'HundredFold Assistant' : '百福智能助手'}
            </h3>
            <p className="text-emerald-100 text-xs">
              {en ? 'Insurance & tax questions, answered' : '保险与税务问题，随时解答'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 max-w-[90%]">
              {greeting}
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs bg-white border border-emerald-200 text-emerald-700 rounded-full px-3 py-1.5 hover:bg-emerald-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 max-w-[90%] whitespace-pre-wrap">
                  <MessageText text={msg.content} />
                </div>
              )
            )}

            {loading && (
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-400 w-16">
                <span className="animate-pulse">●●●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-gray-200 p-3 flex gap-2 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={en ? 'Type your question…' : '请输入您的问题…'}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              {en ? 'Send' : '发送'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
