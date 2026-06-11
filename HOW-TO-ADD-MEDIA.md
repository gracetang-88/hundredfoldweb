# How to Add Media Content (Articles/Videos)

This guide explains how to easily add new articles and videos to your media section.

## Quick Start - Using the Script

The easiest way to add new media content is using the provided script:

```bash
./scripts/add-media.sh <unique-id> <order-number>
```

### Example:
```bash
./scripts/add-media.sh retirement-planning 4
```

This will:
1. Create `content/media/retirement-planning-en.md`
2. Create `content/media/retirement-planning-zh.md`
3. Pre-fill them with templates you can edit

## Step-by-Step Guide

### 1. Run the Script

```bash
./scripts/add-media.sh my-article-name 4
```

- **unique-id**: A unique identifier (use lowercase with dashes, e.g., `life-insurance-guide`)
- **order-number**: Display order (1 = first, higher numbers appear later)

### 2. Edit the English File

Open `content/media/your-id-en.md` and update:

```markdown
---
title: "Your Article Title"
brief: "Short description shown in grid"
image: "/images/media/your-image.jpg"
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
order: 4
---

# Your Article Title

Write your content here...
```

**Key fields:**
- `title`: The full title of your article
- `brief`: Short summary (1-2 sentences) shown in the grid
- `image`: Path to thumbnail image (see step 4)
- `videoUrl`: Optional YouTube embed URL (see below)
- `order`: Display order (lower = shown first)

### 3. Edit the Chinese File

Open `content/media/your-id-zh.md` and add the Chinese translation.

### 4. Add Images

Place your images in `public/images/media/` folder:

```bash
# Example
cp ~/Downloads/my-image.jpg public/images/media/
```

Then reference it in your markdown:
```markdown
image: "/images/media/my-image.jpg"
```

### 5. Add Videos (Optional)

To embed a YouTube video:

1. Get your YouTube video URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. Extract the video ID: `dQw4w9WgXcQ` (part after `watch?v=`)
3. Create embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`
4. Add to frontmatter:
   ```markdown
   videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
   ```

If you don't have a video, you can:
- Leave it as the template default
- Remove the line entirely
- Set it to empty: `videoUrl: ""`

### 6. View Your Changes

If your dev server is running (`npm run dev`), just refresh your browser at:
```
http://localhost:3000/media
```

Your new media item will appear!

## Manual Method (Without Script)

If you prefer to do it manually:

1. Copy the template files:
   ```bash
   cp scripts/templates/media-template-en.md content/media/your-id-en.md
   cp scripts/templates/media-template-zh.md content/media/your-id-zh.md
   ```

2. Edit both files with your content

3. Add images to `public/images/media/`

4. Refresh browser

## Markdown Tips

Your content supports full markdown:

```markdown
# H1 Heading
## H2 Heading
### H3 Heading

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item
2. Another item

[Link text](https://example.com)

![Image alt text](/images/media/image.jpg)
```

## Troubleshooting

**Media item not showing?**
- Check that both `-en.md` and `-zh.md` files exist
- Verify the `order` field is set
- Make sure files are in `content/media/` directory
- Refresh your browser (hard refresh: Cmd+Shift+R)

**Image not displaying?**
- Ensure image is in `public/images/media/` folder
- Check the path starts with `/images/media/`
- Verify file extension matches (`.jpg`, `.png`, etc.)

**Video not playing?**
- Use the embed URL format: `https://www.youtube.com/embed/VIDEO_ID`
- Don't use the regular watch URL
- Check that the video is public/unlisted (not private)

## Need Help?

Check existing examples in `content/media/`:
- `sample1-en.md` / `sample1-zh.md`
- `sample2-en.md` / `sample2-zh.md`
- `sample3-en.md` / `sample3-zh.md`
