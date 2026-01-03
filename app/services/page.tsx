'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { useLanguage } from '@/lib/LanguageContext';

interface ServiceData {
  title: string;
  subtitle: string;
  services: Array<{
    title: string;
    slug: string;
    items: string[];
    iconBg: string;
    icon: string;
  }>;
}

export default function ServicesPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ServiceData | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/services?lang=${language}`);
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    }

    loadContent();
  }, [language]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
            {content.title}
          </h1>
          <p className="text-center text-gray-600 max-w-4xl mx-auto mb-16 text-lg leading-relaxed">
            {content.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
            {content.services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                slug={service.slug}
                items={service.items}
                iconBg={service.iconBg}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
