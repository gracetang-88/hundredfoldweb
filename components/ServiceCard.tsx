'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface ServiceCardProps {
  title: string;
  items: string[];
  iconBg: string;
  icon: string;
  slug: string;
  quote?: boolean;
}

export default function ServiceCard({ title, items, iconBg, icon, slug, quote }: ServiceCardProps) {
  const { language } = useLanguage();

  return (
    <Link href={`/services/${slug}`} className="block h-full">
      <div className="h-full flex flex-col items-center text-center bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-8 transition-all duration-200 hover:-translate-y-1">
        <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center mb-5`}>
          <span className="text-4xl">{icon}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <ul className="space-y-1.5 text-gray-600 text-sm mb-5 flex-1">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {quote && (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
            {language === 'en' ? '⚡ Online Quote Available' : '⚡ 支持在线报价'}
          </span>
        )}
        <span className="text-emerald-600 font-medium text-sm">
          {language === 'en' ? 'Learn More →' : '了解更多 →'}
        </span>
      </div>
    </Link>
  );
}
