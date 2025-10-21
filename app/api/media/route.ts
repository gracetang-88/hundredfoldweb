import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Language } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'en') as Language;

  try {
    const mediaDir = path.join(process.cwd(), 'content/media');

    if (!fs.existsSync(mediaDir)) {
      return NextResponse.json(
        { error: 'Media directory not found' },
        { status: 404 }
      );
    }

    // Get all markdown files for the current language
    const files = fs.readdirSync(mediaDir);
    const mediaFiles = files.filter(
      (file) => file.endsWith(`-${lang}.md`)
    );

    const mediaItems = await Promise.all(
      mediaFiles.map(async (filename) => {
        const filePath = path.join(mediaDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // Convert markdown content to HTML
        const htmlContent = await marked(content);

        return {
          id: filename.replace(`-${lang}.md`, ''),
          title: data.title,
          brief: data.brief,
          image: data.image,
          videoUrl: data.videoUrl || null,
          content: htmlContent,
          order: data.order || 999,
        };
      })
    );

    // Sort by order
    mediaItems.sort((a, b) => a.order - b.order);

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Error loading media content:', error);
    return NextResponse.json(
      { error: 'Failed to load media content' },
      { status: 500 }
    );
  }
}
