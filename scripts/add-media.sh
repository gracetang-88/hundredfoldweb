#!/bin/bash

# Script to easily add new media content (articles/videos)
# Usage: ./scripts/add-media.sh <id> <order>
# Example: ./scripts/add-media.sh my-new-article 4

set -e

# Check if ID argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a unique ID for your media item"
  echo "Usage: ./scripts/add-media.sh <id> <order>"
  echo "Example: ./scripts/add-media.sh financial-planning-tips 4"
  exit 1
fi

# Check if order argument is provided
if [ -z "$2" ]; then
  echo "Error: Please provide an order number"
  echo "Usage: ./scripts/add-media.sh <id> <order>"
  echo "Example: ./scripts/add-media.sh financial-planning-tips 4"
  exit 1
fi

MEDIA_ID=$1
ORDER=$2
CONTENT_DIR="content/media"
TEMPLATE_DIR="scripts/templates"

# Check if files already exist
if [ -f "$CONTENT_DIR/${MEDIA_ID}-en.md" ] || [ -f "$CONTENT_DIR/${MEDIA_ID}-zh.md" ]; then
  echo "Error: Media files with ID '$MEDIA_ID' already exist!"
  exit 1
fi

# Copy templates with the new ID
echo "Creating new media files..."
cp "$TEMPLATE_DIR/media-template-en.md" "$CONTENT_DIR/${MEDIA_ID}-en.md"
cp "$TEMPLATE_DIR/media-template-zh.md" "$CONTENT_DIR/${MEDIA_ID}-zh.md"

# Update the order in both files
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/order: 1/order: $ORDER/" "$CONTENT_DIR/${MEDIA_ID}-en.md"
  sed -i '' "s/order: 1/order: $ORDER/" "$CONTENT_DIR/${MEDIA_ID}-zh.md"
else
  # Linux
  sed -i "s/order: 1/order: $ORDER/" "$CONTENT_DIR/${MEDIA_ID}-en.md"
  sed -i "s/order: 1/order: $ORDER/" "$CONTENT_DIR/${MEDIA_ID}-zh.md"
fi

echo "✓ Created: $CONTENT_DIR/${MEDIA_ID}-en.md"
echo "✓ Created: $CONTENT_DIR/${MEDIA_ID}-zh.md"
echo ""
echo "Next steps:"
echo "1. Edit $CONTENT_DIR/${MEDIA_ID}-en.md with your English content"
echo "2. Edit $CONTENT_DIR/${MEDIA_ID}-zh.md with your Chinese content"
echo "3. Add your image to public/images/media/ folder"
echo "4. If you have a video, update the videoUrl field"
echo "5. Refresh your browser to see the new media item"
echo ""
echo "Happy writing! 📝"
