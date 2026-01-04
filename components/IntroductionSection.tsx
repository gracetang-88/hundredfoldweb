interface IntroductionSectionProps {
  content: string;
}

export default function IntroductionSection({ content }: IntroductionSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50/40 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className="prose prose-lg max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
