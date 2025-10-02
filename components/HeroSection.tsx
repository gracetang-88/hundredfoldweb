interface HeroSectionProps {
  content: string;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div
          className="prose prose-lg max-w-none text-center"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
