# BITS Dubai — Museum of Student Life

A modern, museum-style static website showcasing student life at BITS Pilani Dubai Campus. Built with pure HTML, CSS, and JavaScript (no frameworks or build tools).

## 🎨 Features

- **Entry Hall**: Password-protected entrance with elegant modal
- **Gallery**: Museum-style carousel organized into themed rooms
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation, screen reader support, high contrast focus outlines
- **Interactive Elements**: Clap functionality with confetti effects and applause
- **Lazy Loading**: LQIP (Low Quality Image Placeholder) for smooth loading
- **Audio Controls**: Mute/unmute toggle with persistent settings

## 🏗️ Structure

```
/museum-site
├── assets/
│   ├── images/           # High-resolution photos (≈1600–2000px width)
│   ├── lqip/             # 20–40px blurred placeholders (same filenames)
│   ├── audio/
│   │   ├── clap.mp3      # Clap sound effect
│   │   └── door-click.mp3 # Entry success sound
│   └── icons/            # SVG icons for UI elements
├── styles/
│   ├── base.css          # Reset, variables, typography, utilities
│   ├── entry.css         # Entry hall and modal styles
│   └── gallery.css       # Gallery, frames, and interactions
├── scripts/
│   ├── data.rooms.js     # ✏️ Single editable content file
│   ├── util.js           # Helper functions and utilities
│   ├── entry.js          # Entry hall functionality
│   ├── gallery.js        # Gallery navigation and display
│   └── confetti.js       # Confetti animation system
├── index.html            # Entry Hall
├── gallery.html          # Gallery with rooms
└── README.md
```

## 🎯 Quick Setup

### 1. Add Your Content

Edit `/scripts/data.rooms.js` to add your photos and rooms:

```javascript
window.MUSEUM = {
    defaultRoomId: 'campus',
    rooms: [
        {
            id: 'campus',
            name: 'Campus',
            photos: [
                {
                    src: 'assets/images/campus-001.jpg',
                    lqip: 'assets/lqip/campus-001.jpg',
                    title: 'Morning Walkways',
                    quote: 'Quiet corridors before the rush begins.',
                    alt: 'Students walking along campus arcade',
                    credit: '© Photographer Name, 2025'
                }
                // Add more photos...
            ]
        }
        // Add more rooms...
    ]
};
```

### 2. Add Your Images

**High-resolution images** (recommended ≈2000px width):
- Place in `/assets/images/`
- Formats: JPG, PNG, WebP
- Keep file sizes reasonable for web

**LQIP placeholders** (20–40px wide, heavily blurred):
- Place in `/assets/lqip/` 
- Use identical filenames as main images
- Generate using tools like `lqip-cli` or Photoshop

### 3. Add Audio Files

- `assets/audio/clap.mp3` - Clap sound effect
- `assets/audio/door-click.mp3` - Entry success sound

### 4. Configure Settings

#### Change Password
In `/scripts/entry.js`, line ~85:
```javascript
if (password.toLowerCase() === 'your-new-password') {
```

#### Customize Colors
In `/styles/base.css`, modify CSS variables:
```css
:root {
    --wall: #e9e7e1;      /* Background wall color */
    --floor: #b7b3ad;     /* Floor accent color */
    --charcoal: #0f1115;  /* Dark text color */
    --gold: #c9a227;      /* Accent gold color */
    --muted: #6b7280;     /* Muted text color */
}
```

#### Adjust Frame Styling
In `/styles/base.css`:
```css
:root {
    --frame-border: 3px;           /* Frame border thickness */
    --frame-mat-landscape: 2rem;   /* Landscape photo matting */
    --frame-mat-portrait: 1.5rem;  /* Portrait photo matting */
}
```

## 🎨 Design System

### Typography
- **Headers**: Cormorant Garamond (elegant serif)
- **Body**: Montserrat (clean sans-serif)
- **Google Fonts**: Automatically loaded

### Color Palette
- **Wall**: Warm neutral background (#e9e7e1)
- **Floor**: Polished stone accent (#b7b3ad)
- **Charcoal**: Primary text (#0f1115)
- **Gold**: Accent color for frames and highlights (#c9a227)
- **Muted**: Secondary text (#6b7280)

### Frame System
- **Adaptive Orientation**: Automatically detects landscape/portrait
- **Responsive Matting**: Different spacing for different orientations
- **Gold Frames**: Thin borders with subtle shadows and hover effects
- **No Cropping**: Frames fit the image, not vice versa

## ⌨️ Controls

### Entry Hall
- **Click "Get Ticket"**: Opens password modal
- **Password**: `mediathon` (case-insensitive)
- **Escape**: Close modal

### Gallery
- **Arrow Keys**: Navigate photos (←/→ or ↑/↓)
- **Space/Enter**: Clap for current photo
- **M Key**: Toggle mute
- **Touch**: Swipe left/right on mobile devices

### Navigation
- **Room Selector**: Dropdown in header
- **Arrow Buttons**: Large clickable areas
- **Counter**: Shows current photo position

## 🔧 Technical Features

### Performance
- **Lazy Loading**: Images load on demand
- **LQIP**: Blur-to-sharp loading transition
- **Preloading**: Next/previous images cached
- **Optimized Assets**: Recommended 2000px max width

### Accessibility
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Readers**: Proper ARIA labels and alt text
- **Focus Management**: High-contrast focus outlines
- **Color Contrast**: WCAG compliant color combinations

### Audio System
- **Clap Effects**: 40% volume, respectful of user preference
- **Applause Loop**: 3-second celebration sound
- **Mute Control**: Persistent user preference
- **Graceful Degradation**: Works without audio support

### Responsive Design
- **Mobile First**: Optimized for touch devices
- **Flexible Layout**: Adapts to any screen size
- **Touch Gestures**: Swipe navigation on mobile
- **Readable Text**: Scales appropriately

## 🎭 Interactions

### Clap System
- **Click/Tap**: Clap button with icon
- **Visual Feedback**: Button animation and counter
- **Audio**: Clap sound + applause loop (if not muted)
- **Confetti**: 3-second particle celebration
- **Count Reset**: Per-session only (no persistence)

### Slide Transitions
- **Smooth Animation**: 300ms CSS transitions
- **Direction-Aware**: Slides match navigation direction
- **Non-Blocking**: Responsive during transitions

## 🚀 Deployment

This is a static site that can be deployed anywhere:

- **GitHub Pages**: Commit to repository, enable Pages
- **Netlify**: Drag folder to Netlify dashboard
- **Vercel**: Connect repository or use CLI
- **Traditional Hosting**: Upload to any web server

No build process required!

## 🐛 Troubleshooting

### Images Not Loading
1. Check file paths in `data.rooms.js`
2. Ensure images exist in `/assets/images/` and `/assets/lqip/`
3. Verify file extensions match exactly

### Audio Not Playing
1. Check browser auto-play policies
2. Ensure audio files exist in `/assets/audio/`
3. User interaction may be required before audio plays

### Password Not Working
1. Default password is `mediathon` (case-insensitive)
2. Check console for JavaScript errors
3. Verify `sessionStorage` is available

### Confetti Not Showing
1. Check browser console for JavaScript errors
2. Ensure `confetti.js` is loaded
3. Try refreshing the page

## 📝 Content Guidelines

### Photo Requirements
- **High Quality**: Sharp, well-lit, engaging
- **Proper Sizing**: ≈2000px width recommended
- **Web Optimized**: Compressed but not degraded
- **Diverse Content**: Mix of orientations and subjects

### Caption Writing
- **Titles**: Short, evocative (1-4 words)
- **Quotes**: Descriptive, poetic (1-3 lines max)
- **Alt Text**: Descriptive for screen readers
- **Credits**: Always attribute photographers

### Room Organization
- **Logical Flow**: Group related content
- **Balanced Length**: 2-5 photos per room
- **Clear Names**: Descriptive room titles
- **Storytelling**: Consider narrative flow

## 🎯 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Grid & Flexbox**: Full support required  
- **ES6 Features**: Arrow functions, template literals, classes
- **Audio API**: For clap sound effects
- **Local Storage**: For persistent settings

## 📚 Dependencies

**None!** This project uses only:
- Pure HTML5, CSS3, JavaScript (ES6+)
- Google Fonts (external CDN)
- No frameworks, no build tools, no package managers

## 🎨 Customization Examples

### Change Transition Speed
In `/styles/gallery.css`:
```css
.photo-display.slide-left .photo-frame {
    animation: slide-out-right 500ms ease-in-out; /* Slower */
}
```

### Modify Confetti Colors
In `/scripts/confetti.js`:
```javascript
this.colors = [
    '#your-color-1',
    '#your-color-2', 
    // Add your brand colors...
];
```

### Adjust Frame Hover Effects
In `/styles/gallery.css`:
```css
.photo-frame:hover {
    transform: translateY(-4px); /* More lift */
    box-shadow: /* Custom shadow */;
}
```

## 📞 Support

This is a self-contained static website. For issues:

1. Check browser console for errors
2. Verify file paths and structure
3. Ensure all assets are uploaded
4. Test in different browsers

## 📄 License

This project is created for BITS Pilani Dubai Campus. Images and content remain property of their respective creators and the institution.

---

**Built with ❤️ for BITS Dubai Mediathon 2025**
