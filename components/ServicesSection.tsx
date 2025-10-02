interface ServicesSectionProps {
  content: string;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div
          className="prose prose-lg max-w-6xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
