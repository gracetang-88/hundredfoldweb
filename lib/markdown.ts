import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Language } from '@/types';

// Custom renderer to handle YouTube embeds
function parseYouTubeEmbeds(content: string): string {
  // Replace [youtube:VIDEO_ID] with iframe embed
  const youtubeRegex = /\[youtube:([a-zA-Z0-9_-]+)\]/g;
  return content.replace(youtubeRegex, (_, videoId) => {
    return `<div class="youtube-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  });
}

export async function getContentByLanguage(
  contentPath: string,
  language: Language
) {
  const filePath = path.join(process.cwd(), contentPath, `${language}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  // Process each section from frontmatter
  const processedData: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Parse YouTube embeds first
      const contentWithEmbeds = parseYouTubeEmbeds(value);
      // Then parse markdown to HTML
      processedData[key] = await marked(contentWithEmbeds);
    } else {
      processedData[key] = value;
    }
  }

  return processedData;
}
