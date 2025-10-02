interface IntroductionSectionProps {
  content: string;
}

export default function IntroductionSection({ content }: IntroductionSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div
          className="prose prose-lg max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
