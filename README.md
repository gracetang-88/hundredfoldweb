# HundredFold Website

A minimalist personal website built with Next.js, TypeScript, and Tailwind CSS, featuring bilingual support (English/Chinese) and markdown-based content management.

## Features

- **Minimalist Design**: Clean, modern interface with focus on content
- **Bilingual Support**: Easy switching between English and Chinese
- **Markdown Content**: Manage all content in markdown files
- **Media Integration**:
  - Images from public URLs
  - Embedded YouTube videos with `[youtube:VIDEO_ID]` syntax
- **Responsive**: Mobile-friendly design
- **Extensible**: Easy to add new pages and sections

## Project Structure

```
hundredfoldweb/
├── app/
│   ├── api/content/route.ts    # API endpoint for content fetching
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout with LanguageProvider
│   └── page.tsx                # Landing page
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Site footer
│   ├── LanguageSwitcher.tsx    # Language toggle button
│   ├── HeroSection.tsx         # Hero section component
│   ├── IntroductionSection.tsx # Introduction section
│   ├── ServicesSection.tsx     # Services highlights
│   └── EmailSignupSection.tsx  # Email signup form
├── content/
│   └── landing/
│       ├── en.md               # English landing page content
│       └── zh.md               # Chinese landing page content
├── lib/
│   ├── i18n.ts                 # i18n configuration
│   ├── LanguageContext.tsx     # Language context provider
│   └── markdown.ts             # Markdown parser with YouTube support
└── types/
    └── index.ts                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hundredfoldweb
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Content Management

### Editing Landing Page Content

Content is stored in markdown files at `content/landing/`:

- **English**: `content/landing/en.md`
- **Chinese**: `content/landing/zh.md`

### Markdown Format

Each markdown file uses frontmatter with section content:

```markdown
---
hero: |
  # Your Hero Title

  Subtitle text

  ![Hero Image](https://example.com/image.jpg)

introduction: |
  ## About Section

  Your introduction text here.

services: |
  ## Services

  ### Service 1
  Description

  ### Service 2
  Description

  [youtube:VIDEO_ID]
---
```

### Adding Images

Use standard markdown image syntax:
```markdown
![Alt text](https://example.com/image.jpg)
```

### Embedding YouTube Videos

Use the special syntax:
```markdown
[youtube:VIDEO_ID]
```

For example:
```markdown
[youtube:dQw4w9WgXcQ]
```

This will create a responsive embedded YouTube player.

## Landing Page Sections

1. **Hero Section**: Main banner with headline and call-to-action
2. **Introduction Section**: About/introduction content
3. **Services Section**: Highlight key services or features
4. **Email Signup Section**: Newsletter subscription form

## Language Switching

The language switcher in the top-right corner allows users to toggle between English and Chinese. The content automatically updates based on the selected language.

## Extending the Website

### Adding New Pages

1. Create placeholder pages in the `app` directory (e.g., `app/services/page.tsx`)
2. Update the navigation links in `components/Header.tsx` if needed
3. Create corresponding content files in the `content` directory

### Adding New Sections

1. Create a new component in `components/`
2. Add the section content to your markdown files
3. Import and use the component in `app/page.tsx`

## Customization

### Colors and Styling

- Modify `tailwind.config.ts` for theme colors
- Edit `app/globals.css` for global styles
- Component styles use Tailwind CSS utility classes

### Navigation Menu

Edit the menu items in `components/Header.tsx`:

```typescript
const menuItems = [
  { label: language === 'en' ? 'Services' : '服务', href: '/services' },
  { label: language === 'en' ? 'Events' : '活动', href: '/events' },
  // Add more items...
];
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **gray-matter**: Frontmatter parser
- **marked**: Markdown to HTML converter

## License

See LICENSE file for details.
