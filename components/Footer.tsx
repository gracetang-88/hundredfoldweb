'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()}{' '}
          {language === 'en' ? 'HundredFold. All rights reserved.' : '百倍。版权所有。'}
        </p>
      </div>
    </footer>
  );
}
