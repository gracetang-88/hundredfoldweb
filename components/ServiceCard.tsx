interface ServiceCardProps {
  title: string;
  items: string[];
  iconBg: string;
  icon: string;
}

export default function ServiceCard({ title, items, iconBg, icon }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mb-6`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-semibold text-green-700 mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-600">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
