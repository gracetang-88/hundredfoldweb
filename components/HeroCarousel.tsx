'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroSlide {
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoScrollDuration?: number; // in milliseconds, default 5000 (5 seconds)
}

export default function HeroCarousel({
  slides,
  autoScrollDuration = 5000
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoScrollDuration);

    return () => clearInterval(interval);
  }, [slides.length, autoScrollDuration]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: 'brightness(0.7)',
            }}
          />

          {/* Overlay Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
                {slide.description}
              </p>
              {slide.buttonText && slide.buttonLink && (
                <Link
                  href={slide.buttonLink}
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                >
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows (optional - only show if more than 1 slide) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((currentSlide + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
