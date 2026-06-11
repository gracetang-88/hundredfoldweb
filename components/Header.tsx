'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {
  const { language } = useLanguage();

  const menuItems = [
    { label: language === 'en' ? 'Services' : '服务', href: '/services' },
    { label: language === 'en' ? 'Media' : '媒体', href: '/media' },
    { label: language === 'en' ? 'Contact Us' : '联系我们', href: '/contact' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-emerald-700">
          {language === 'en' ? 'HundredFold' : '百福'}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            {language === 'en' ? 'Get a Quote' : '在线报价'}
          </Link>
        </div>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}
