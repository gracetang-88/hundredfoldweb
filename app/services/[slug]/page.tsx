'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/lib/LanguageContext';

interface ServiceDetailData {
  title: string;
  icon: string;
  description: string;
  features: string[];
  benefits: string[];
  content: string;
}

export default function ServiceDetailPage() {
  const { language } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [content, setContent] = useState<ServiceDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${slug}?lang=${language}`);
        if (!response.ok) {
          throw new Error('Failed to load service details');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [language, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {language === 'en' ? 'Service Not Found' : '服务未找到'}
            </h1>
            <a href="/services" className="text-green-600 hover:text-green-700">
              {language === 'en' ? 'Back to Services' : '返回服务页面'}
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">{content.icon}</div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Content Section */}
          {content.content && (
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          )}

          {/* Features Section */}
          {content.features && content.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {language === 'en' ? 'Our Services Include' : '我们的服务包括'}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">✓</span>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits Section */}
          {content.benefits && content.benefits.length > 0 && (
            <div className="mb-12 bg-green-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {language === 'en' ? 'Why Choose Us' : '为什么选择我们'}
              </h2>
              <ul className="space-y-4">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-3 text-xl">★</span>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {language === 'en' ? 'Ready to Get Started?' : '准备开始了吗？'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en'
                ? 'Contact us today to learn more about our services'
                : '立即联系我们，了解更多关于我们服务的信息'}
            </p>
            <a
              href="/contact"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {language === 'en' ? 'Contact Us' : '联系我们'}
            </a>
          </div>

          {/* Back to Services Link */}
          <div className="text-center mt-8">
            <a href="/services" className="text-green-600 hover:text-green-700">
              ← {language === 'en' ? 'Back to All Services' : '返回所有服务'}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
