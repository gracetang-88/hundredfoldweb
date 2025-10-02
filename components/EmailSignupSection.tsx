'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function EmailSignupSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual email signup logic
    console.log('Email submitted:', email);
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const texts = {
    en: {
      title: 'Stay Updated',
      subtitle: 'Subscribe to our newsletter for the latest updates',
      placeholder: 'Enter your email',
      button: 'Subscribe',
      success: 'Thank you for subscribing!',
    },
    zh: {
      title: '保持联系',
      subtitle: '订阅我们的通讯以获取最新动态',
      placeholder: '输入您的邮箱',
      button: '订阅',
      success: '感谢您的订阅！',
    },
  };

  const t = texts[language];

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
        <p className="text-blue-100 mb-8">{t.subtitle}</p>

        {status === 'success' ? (
          <div className="bg-green-500 text-white py-4 px-6 rounded-lg">
            {t.success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              {t.button}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
