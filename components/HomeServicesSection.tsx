'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { useLanguage } from '@/lib/LanguageContext';

interface Service {
  title: string;
  slug: string;
  items: string[];
  iconBg: string;
  icon: string;
}

interface ServiceData {
  title: string;
  subtitle: string;
  services: Service[];
}

export default function HomeServicesSection() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ServiceData | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/services?lang=${language}`);
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    }

    loadContent();
  }, [language]);

  if (!content) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50/50 via-gray-100 to-green-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

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
    </section>
  );
}
