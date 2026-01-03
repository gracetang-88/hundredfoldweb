import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  items: string[];
  iconBg: string;
  icon: string;
  slug: string;
}

export default function ServiceCard({ title, items, iconBg, icon, slug }: ServiceCardProps) {
  return (
    <Link href={`/services/${slug}`}>
      <div className="flex flex-col items-center text-center cursor-pointer hover:transform hover:scale-105 transition-transform duration-200">
        <div className={`w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mb-6`}>
          <span className="text-4xl">{icon}</span>
        </div>
        <h3 className="text-2xl font-semibold text-green-700 mb-4 hover:text-green-800">{title}</h3>
        <ul className="space-y-2 text-gray-600 mb-4">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <span className="text-green-600 hover:text-green-700 font-medium">
          Learn More →
        </span>
      </div>
    </Link>
  );
}
