import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface MediaViewerProps {
  item: {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
  } | null;
}

export default function MediaViewer({ item }: MediaViewerProps) {
  const { language } = useLanguage();

  if (!item) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg shadow-md">
        <div className="text-center text-gray-500 py-20">
          {language === 'en'
            ? 'Select an item below to view details'
            : '选择下方项目以查看详情'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`grid grid-cols-1 ${item.videoUrl ? 'lg:grid-cols-2' : ''} gap-0`}>
        {/* Text Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>

        {/* Video - Only show if videoUrl exists */}
        {item.videoUrl && (
          <div className="bg-gray-900 flex items-center justify-center" style={{ height: '500px' }}>
            <iframe
              className="w-full h-full"
              src={item.videoUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Contact Us Button */}
      <div className="p-6 bg-gray-50 border-t flex justify-end">
        <Link
          href="/contact"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          {language === 'en' ? 'Contact Us' : '联系我们'}
        </Link>
      </div>
    </div>
  );
}
