'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header() {
  const { language } = useLanguage();
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const taxServicesSubpages = [
    {
      title: language === 'en' ? 'Individual Tax Services' : '个人税务服务',
      href: '/services/tax-services#individual',
    },
    {
      title: language === 'en' ? 'Business Tax Services' : '企业税务服务',
      href: '/services/tax-services#business',
    },
    {
      title: language === 'en' ? 'Retirement Planning' : '退休规划',
      href: '/services/tax-services#retirement',
    },
    {
      title: language === 'en' ? 'Tax Planning & Strategy' : '税务规划与策略',
      href: '/tax-planning',
    },
  ];

  const taxToolsItems = [
    {
      title: language === 'en' ? 'Tax Service Pricing' : '税务服务报价',
      href: '/tax-tools#pricing',
    },
    {
      title: language === 'en' ? 'MTM Workpaper' : 'MTM 工作底稿',
      href: '/tax-tools#mtm-workpaper',
    },
    {
      title: language === 'en' ? 'Day Trader Tax Prep Checklist' : '日间交易者税务准备清单',
      href: '/tax-tools#tax-prep-checklist',
    },
  ];

  const menuItems = [
    { label: language === 'en' ? 'Media' : '媒体', href: '/media' },
    { label: language === 'en' ? 'Contact Us' : '联系我们', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={language === 'en' ? '/logo-h.png' : '/logo-h-zh.png'}
            alt={language === 'en' ? 'Hundredfold' : '百福'}
            width={300}
            height={90}
            className="h-20 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link
              href="/services"
              className="text-black hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              {language === 'en' ? 'Services' : '服务'}
              <svg
                className={`w-4 h-4 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {showServicesDropdown && (
              <div className="absolute top-full left-0 pt-2 w-64">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <Link
                    href="/services/tax-services"
                    className="block px-4 py-3 text-black hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                  >
                    <span className="font-semibold">
                      {language === 'en' ? 'Tax Services Overview' : '税务服务概述'}
                    </span>
                  </Link>
                  {taxServicesSubpages.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-3 text-black hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tax Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowToolsDropdown(true)}
            onMouseLeave={() => setShowToolsDropdown(false)}
          >
            <Link
              href="/tax-tools"
              className="text-black hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              {language === 'en' ? 'Tax Tools' : '税务工具'}
              <svg
                className={`w-4 h-4 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {showToolsDropdown && (
              <div className="absolute top-full left-0 pt-2 w-64">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <Link
                    href="/tax-tools"
                    className="block px-4 py-3 text-black hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                  >
                    <span className="font-semibold">
                      {language === 'en' ? 'All Tax Tools' : '所有税务工具'}
                    </span>
                  </Link>
                  {taxToolsItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-3 text-black hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-black hover:text-blue-600 transition-colors"
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
