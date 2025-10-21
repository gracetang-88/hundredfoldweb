import { useState } from 'react';

interface MediaItem {
  id: string;
  title: string;
  brief: string;
  image: string;
  videoUrl: string | null;
  content: string;
  order: number;
}

interface MediaGridProps {
  items: MediaItem[];
  onItemSelect: (item: MediaItem) => void;
}

export default function MediaGrid({ items, onItemSelect }: MediaGridProps) {
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <MediaGridItem
            key={item.id}
            item={item}
            onClick={() => onItemSelect(item)}
          />
        ))}
      </div>
    </div>
  );
}

interface MediaGridItemProps {
  item: MediaItem;
  onClick: () => void;
}

function MediaGridItem({ item, onClick }: MediaGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
      style={{ height: '300px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${item.image})`,
          filter: isHovered ? 'brightness(0.4)' : 'brightness(0.7)',
          transition: 'filter 0.3s ease',
        }}
      />

      {/* Overlay with text */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
        <p className="text-white text-sm">{item.brief}</p>
      </div>

      {/* Always show title when not hovered */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold text-center px-4">
            {item.title}
          </h3>
        </div>
      )}
    </div>
  );
}
