'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import IntroductionSection from '@/components/IntroductionSection';
import ServicesSection from '@/components/ServicesSection';
import EmailSignupSection from '@/components/EmailSignupSection';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/content?lang=${language}`);
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
      <main className="flex-1">
        {content.heroSlides && <HeroCarousel slides={content.heroSlides} autoScrollDuration={5000} />}
        {content.introduction && <IntroductionSection content={content.introduction} />}
        {content.services && <ServicesSection content={content.services} />}
        <EmailSignupSection />
      </main>
      <Footer />
    </div>
  );
}
