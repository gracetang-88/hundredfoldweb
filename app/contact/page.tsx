'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import GeneralEnquiries from '@/components/GeneralEnquiries';
import { useLanguage } from '@/lib/LanguageContext';

interface ContactData {
  formTitle: string;
  generalEnquiries: {
    title: string;
    phone: string;
    email: string;
    address: string;
    officeHours: Array<{
      day: string;
      hours: string;
    }>;
  };
  formFields: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    contactMethod: string;
    contactMethodOptions: string[];
    interest: string;
    interestOptions: string[];
    details: string;
    hearAbout: string;
    hearAboutOptions: string[];
    submit: string;
  };
}

export default function ContactPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContactData | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/contact?lang=${language}`);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left region - Contact Form */}
            <div>
              <ContactForm content={content} />
            </div>

            {/* Right region - General Enquiries */}
            <div>
              <GeneralEnquiries content={content} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
