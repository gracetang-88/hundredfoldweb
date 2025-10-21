'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaViewer from '@/components/MediaViewer';
import MediaGrid from '@/components/MediaGrid';
import { useLanguage } from '@/lib/LanguageContext';

interface MediaItem {
  id: string;
  title: string;
  brief: string;
  image: string;
  videoUrl: string | null;
  content: string;
  order: number;
}

export default function MediaPage() {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function loadMediaItems() {
      try {
        const response = await fetch(`/api/media?lang=${language}`);
        const data = await response.json();
        setMediaItems(data);

        // Auto-select first item
        if (data.length > 0 && !selectedItem) {
          setSelectedItem(data[0]);
        }
      } catch (error) {
        console.error('Failed to load media items:', error);
      }
    }

    loadMediaItems();
  }, [language]);

  // Update selected item when language changes
  useEffect(() => {
    if (selectedItem && mediaItems.length > 0) {
      // Find the corresponding item in the new language by id
      const correspondingItem = mediaItems.find(
        (item) => item.id === selectedItem.id
      );
      if (correspondingItem) {
        setSelectedItem(correspondingItem);
      }
    }
  }, [mediaItems]);

  const handleItemSelect = (item: MediaItem) => {
    setSelectedItem(item);
    // Scroll to top section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mediaItems.length === 0) {
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
          {/* Top Section - Media Viewer */}
          <MediaViewer item={selectedItem} />

          {/* Bottom Section - Media Grid */}
          <MediaGrid items={mediaItems} onItemSelect={handleItemSelect} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
