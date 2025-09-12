# Image Assets

This directory contains the high-resolution photos for the museum gallery.

## Requirements

### File Organization
- **Naming**: Use descriptive, consistent naming (e.g., `campus-001.jpg`, `campus-002.jpg`)
- **Extensions**: `.jpg`, `.jpeg`, `.png`, or `.webp`
- **Case**: Use lowercase filenames for consistency

### Image Specifications
- **Resolution**: Approximately 2000px on the longest side
- **Quality**: High quality but web-optimized
- **File Size**: Aim for 200KB - 1MB per image
- **Aspect Ratios**: Mixed landscape and portrait orientations work well

### Rooms & Categories

Based on the current data structure, organize photos by:

1. **Campus** (`campus-XXX.jpg`)
   - Buildings and architecture
   - Outdoor spaces and walkways
   - Campus atmosphere shots

2. **Class** (`class-XXX.jpg`)
   - Classrooms and lecture halls
   - Students learning
   - Interactive sessions

3. **Labs** (`labs-XXX.jpg`)
   - Laboratory facilities
   - Students conducting experiments
   - Research equipment

4. **Sports** (`sports-XXX.jpg`)
   - Sports facilities
   - Students playing sports
   - Fitness and recreation

5. **Projects** (`projects-XXX.jpg`)
   - Student project showcases
   - Innovation and creativity
   - Maker spaces and workshops

## Sample Images Needed

For each category, you'll need 2-5 photos. The current data structure expects:

- `campus-001.jpg`, `campus-002.jpg`, `campus-003.jpg`
- `class-001.jpg`, `class-002.jpg`  
- `labs-001.jpg`, `labs-002.jpg`
- `sports-001.jpg`, `sports-002.jpg`
- `projects-001.jpg`, `projects-002.jpg`

## Image Optimization Tips

### Before Upload
1. **Resize**: Scale to ~2000px max width/height
2. **Compress**: Use tools like TinyPNG or ImageOptim
3. **Format**: JPEG for photos, PNG for graphics with transparency
4. **Color Profile**: sRGB for web compatibility

### Recommended Tools
- **Photoshop**: Professional editing and export
- **GIMP**: Free alternative to Photoshop
- **Squoosh.app**: Web-based compression tool
- **ImageOptim**: Mac optimization tool
- **TinyPNG**: Online JPEG/PNG compressor

## Photography Guidelines

### Technical
- **Focus**: Sharp, well-focused subjects
- **Lighting**: Well-lit, avoid harsh shadows
- **Composition**: Rule of thirds, interesting angles
- **Resolution**: High enough for web display

### Content
- **Students**: Show diverse, engaged students
- **Facilities**: Showcase modern, well-maintained spaces
- **Activities**: Capture authentic moments and interactions
- **Atmosphere**: Convey the energy and spirit of campus life

### Legal Considerations
- **Permissions**: Ensure you have rights to use all images
- **Student Privacy**: Get consent for recognizable individuals
- **Attribution**: Credit photographers in the data file
- **Institution Rights**: Follow BITS Dubai media guidelines

## Missing Images?

If you don't have photos yet, you can:

1. **Use Placeholders**: Replace with stock photos temporarily
2. **Commission Photography**: Hire a photographer for campus shots
3. **Student Competition**: Run a photo contest for authentic content
4. **Update Data**: Modify `scripts/data.rooms.js` to match available images

Remember to update the corresponding LQIP (low quality) versions in the `/assets/lqip/` directory!
