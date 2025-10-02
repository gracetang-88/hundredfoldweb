'use client';

import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {
  const { language } = useLanguage();

  const menuItems = [
    { label: language === 'en' ? 'Services' : '服务', href: '/services' },
    { label: language === 'en' ? 'Events' : '活动', href: '/events' },
    { label: language === 'en' ? 'Media' : '媒体', href: '/media' },
    { label: language === 'en' ? 'Contact Us' : '联系我们', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          {language === 'en' ? 'HundredFold' : '百倍'}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <LanguageSwitcher />
      </nav>
    </header>
  );
}
