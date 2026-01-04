interface ServicesSectionProps {
  content: string;
}

export default function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50/50 via-gray-100 to-green-50/50 relative overflow-hidden">
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                          linear-gradient(to bottom, #000 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className="prose prose-lg max-w-6xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
