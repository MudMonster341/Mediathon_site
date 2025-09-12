# LQIP (Low Quality Image Placeholder) Directory

This directory contains small, blurred placeholder images that load instantly while the full-resolution images are loading in the background.

## What is LQIP?

LQIP stands for "Low Quality Image Placeholder" - a technique used to improve perceived performance by showing a blurred, tiny version of an image immediately, then replacing it with the full-quality version once loaded.

## Requirements

### File Specifications
- **Size**: 20-40px on the longest side
- **Quality**: Very low quality, heavily compressed
- **Blur**: Apply Gaussian blur (radius 10-15px)
- **File Size**: Should be <5KB each, ideally 1-3KB
- **Naming**: Identical filenames to main images

### File Structure
```
/assets/lqip/
├── campus-001.jpg      (matches /assets/images/campus-001.jpg)
├── campus-002.jpg      (matches /assets/images/campus-002.jpg)
├── campus-003.jpg      (matches /assets/images/campus-003.jpg)
├── class-001.jpg       (matches /assets/images/class-001.jpg)
├── class-002.jpg       (matches /assets/images/class-002.jpg)
├── labs-001.jpg        (matches /assets/images/labs-001.jpg)
├── labs-002.jpg        (matches /assets/images/labs-002.jpg)
├── sports-001.jpg      (matches /assets/images/sports-001.jpg)
├── sports-002.jpg      (matches /assets/images/sports-002.jpg)
├── projects-001.jpg    (matches /assets/images/projects-001.jpg)
└── projects-002.jpg    (matches /assets/images/projects-002.jpg)
```

## How to Create LQIP Images

### Method 1: Photoshop
1. Open original image
2. Resize to 30px on longest side
3. Apply Gaussian Blur (10-15px radius)
4. Export as JPEG at 10-20% quality
5. Save with same filename as original

### Method 2: Online Tools
- **Squoosh.app**: Upload, resize to tiny, compress heavily
- **TinyPNG**: Compress after manual resizing
- **ImageOptim**: Batch processing with extreme compression

### Method 3: Command Line (ImageMagick)
```bash
# Resize and blur in one command
magick input.jpg -resize 30x30 -blur 0x10 -quality 20 output.jpg

# Batch process all images
for file in *.jpg; do
  magick "$file" -resize 30x30 -blur 0x10 -quality 20 "lqip/$file"
done
```

### Method 4: Node.js Script
```javascript
// Using sharp library
const sharp = require('sharp');

sharp('input.jpg')
  .resize(30, 30)
  .blur(10)
  .jpeg({ quality: 20 })
  .toFile('lqip/input.jpg');
```

## Visual Effect

The LQIP technique creates this smooth loading experience:

1. **Instant**: Tiny blurred image appears immediately
2. **Progressive**: Full image loads in background
3. **Swap**: Sharp image replaces blurred version
4. **Smooth**: CSS transition creates seamless effect

## File Size Guidelines

Target file sizes for good performance:

- **LQIP files**: 1-3KB each (extremely small)
- **Total LQIP**: All placeholders should be <50KB combined
- **Loading speed**: Should load in <100ms on slow connections

## Quality Settings

Recommended export settings:

- **JPEG Quality**: 10-20% (very low)
- **PNG**: Not recommended (larger file sizes)
- **WebP**: Excellent option if supported by your images

## Testing LQIP

To test the effect:

1. **Slow Network**: Use browser dev tools to throttle connection
2. **Cache Clearing**: Disable cache to see fresh loading
3. **Mobile Testing**: Test on actual mobile devices
4. **File Sizes**: Check that LQIPs are actually tiny

## Automation Options

### Gulp/Webpack
- Set up build process to auto-generate LQIPs
- Useful for large image collections

### CMS Integration
- Many CMSs can auto-generate LQIPs
- Consider for future dynamic content

### Manual Process
- For this static site, manual creation is fine
- Use batch processing tools for efficiency

## Missing LQIP Files?

If you don't have LQIP versions:

1. **Graceful Degradation**: Site works without them
2. **Loading States**: Images will just show loading spinner
3. **Performance Impact**: Slightly slower perceived loading
4. **Priority**: Create LQIPs for most important images first

## Best Practices

### Visual Quality
- **Preserve Colors**: LQIP should match original color palette
- **Blur Appropriately**: Too little = pixelated, too much = formless
- **Aspect Ratio**: Maintain original proportions

### Technical
- **Base64 Embedding**: For very small files, consider data URLs
- **Progressive JPEGs**: Can help with loading perception
- **WebP Fallbacks**: Provide JPEG backup for older browsers

Remember: The goal is user perception of speed, not actual loading speed!
