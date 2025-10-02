import { NextRequest, NextResponse } from 'next/server';
import { getContentByLanguage } from '@/lib/markdown';
import { Language } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'en') as Language;

  try {
    const content = await getContentByLanguage('content/landing', lang);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}
