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
    quote?: boolean;
  }>;
  comingSoon?: {
    title: string;
    items: Array<{
      title: string;
      icon: string;
      description: string;
    }>;
  };
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
      <main className="flex-1 py-16 bg-gradient-to-br from-gray-50 via-blue-50/40 to-green-50/60 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-green-200/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
            {content.title}
          </h1>
          <p className="text-center text-gray-600 max-w-4xl mx-auto mb-16 text-lg leading-relaxed">
            {content.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                slug={service.slug}
                items={service.items}
                iconBg={service.iconBg}
                icon={service.icon}
                quote={service.quote}
              />
            ))}
          </div>

          {/* Coming Soon Section */}
          {content.comingSoon && (
            <div className="max-w-6xl mx-auto mt-20">
              <h2 className="text-2xl font-semibold text-center text-gray-500 mb-8">
                {content.comingSoon.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {content.comingSoon.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-white/60 border border-dashed border-gray-300 rounded-2xl p-6"
                  >
                    <span className="text-4xl opacity-60">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-500">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
