'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  const en = language === 'en';

  const serviceLinks = [
    { label: en ? 'Life Insurance' : '人寿保险', href: '/services/life-insurance' },
    { label: en ? 'Annuity' : '年金', href: '/services/annuity' },
    { label: en ? 'Commercial Insurance' : '商业保险', href: '/services/commercial-insurance' },
    { label: en ? 'Travel Insurance' : '旅游保险', href: '/services/travel-insurance' },
    { label: en ? 'Tax Services' : '税务服务', href: '/services/tax-services' },
  ];

  const quickLinks = [
    { label: en ? 'Get a Quote' : '在线报价', href: '/quote' },
    { label: en ? 'Contact Us' : '联系我们', href: '/contact' },
    { label: en ? 'Media' : '媒体', href: '/media' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-bold text-emerald-400 mb-3">
              {en ? 'HundredFold' : '百福'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {en
                ? 'An independent insurance agency and tax practice serving families and business owners — in English and Chinese.'
                : '独立保险经纪及税务服务机构，以中英文双语服务家庭与企业主。'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">
              {en ? 'Services' : '服务项目'}
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">
              {en ? 'Quick Links' : '快速链接'}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()}{' '}
            {en
              ? 'HundredFold Insurance Agency. All rights reserved.'
              : '百福保险。版权所有。'}
          </p>
        </div>
      </div>
    </footer>
  );
}
