import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Language } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'en') as Language;
  const { slug } = params;

  try {
    const filePath = path.join(
      process.cwd(),
      'content/services/details',
      slug,
      `${lang}.md`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown content to HTML
    const htmlContent = await marked(content);

    return NextResponse.json({
      ...data,
      content: htmlContent,
    });
  } catch (error) {
    console.error('Error loading service details:', error);
    return NextResponse.json(
      { error: 'Failed to load service details' },
      { status: 500 }
    );
  }
}
