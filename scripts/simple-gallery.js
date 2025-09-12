/**
 * Simple Art Gallery Layout
 * - Loads PNG images at their real size
 * - Adds 5px margins
 * - Arranges in rows to minimize empty space
 * - Click to open JPG in modal with quote
 */

class SimpleArtGallery {
    constructor() {
        this.container = null;
        this.images = [];
        this.margin = 5; // 5px margin as requested
    }

    async init() {
        console.log('Initializing Simple Art Gallery...');
        
        // Check if data is loaded
        if (!window.galleryData) {
            console.error('Gallery data not found! Make sure gallery-data.js is loaded.');
            return;
        }
        
        this.container = document.querySelector('.masonry-grid');
        if (!this.container) {
            console.error('Gallery container (.masonry-grid) not found');
            return;
        }

        console.log(`Found ${window.galleryData.length} images to load`);

        // Clear the container
        this.container.innerHTML = '';
        
        // Set up container styles
        this.container.style.display = 'flex';
        this.container.style.flexWrap = 'wrap';
        this.container.style.alignItems = 'flex-start';
        this.container.style.justifyContent = 'flex-start';
        this.container.style.padding = `${this.margin}px`;
        this.container.style.gap = `${this.margin}px`;
        this.container.style.background = '#f5f5f5';
        this.container.style.minHeight = '100vh';

        // Load images and get their real dimensions
        await this.loadImages();
        
        // Create the gallery layout
        this.createGallery();
        
        // Setup modal functionality
        this.setupModal();
        
        console.log(`Gallery created successfully with ${this.images.length} images`);
    }

    async loadImages() {
        console.log('Loading image dimensions...');
        
        // Add loading indicator
        this.container.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px; font-size: 18px; color: #666;">Loading gallery images...</div>';
        
        const loadPromises = window.galleryData.map(async (item, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`✓ Image ${index + 1}: ${item.png} (${img.naturalWidth}x${img.naturalHeight}px)`);
                    resolve({
                        png: item.png,
                        jpg: item.jpg,
                        quote: item.quote,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        aspectRatio: img.naturalWidth / img.naturalHeight,
                        index: index
                    });
                };
                img.onerror = () => {
                    console.error(`✗ Failed to load image: ${item.png}`);
                    resolve(null);
                };
                img.src = item.png;
            });
        });

        const results = await Promise.all(loadPromises);
        this.images = results.filter(img => img !== null);
        console.log(`Successfully loaded ${this.images.length} out of ${window.galleryData.length} images`);
        
        // Clear loading indicator
        this.container.innerHTML = '';
    }

    createGallery() {
        console.log('Creating gallery layout...');
        
        this.images.forEach((imageData, index) => {
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-item';
            imageContainer.style.margin = `${this.margin}px`;
            imageContainer.style.cursor = 'pointer';
            imageContainer.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            imageContainer.style.borderRadius = '8px';
            imageContainer.style.overflow = 'hidden';
            imageContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            // Create the image element
            const img = document.createElement('img');
            img.src = imageData.png;
            img.alt = `Gallery image ${index + 1}`;
            img.style.display = 'block';
            img.style.width = `${imageData.width}px`;  // Real PNG size
            img.style.height = `${imageData.height}px`; // Real PNG size
            img.style.objectFit = 'cover';
            
            // Add hover effects
            imageContainer.addEventListener('mouseenter', () => {
                imageContainer.style.transform = 'scale(1.02)';
                imageContainer.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                imageContainer.style.zIndex = '10';
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                imageContainer.style.transform = 'scale(1)';
                imageContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                imageContainer.style.zIndex = '1';
            });
            
            // Add click handler
            imageContainer.addEventListener('click', () => {
                this.openModal(imageData.jpg, imageData.quote);
            });
            
            // Add to container
            imageContainer.appendChild(img);
            this.container.appendChild(imageContainer);
            
            // Store data for modal
            imageContainer.setAttribute('data-jpg', imageData.jpg);
            imageContainer.setAttribute('data-quote', imageData.quote);
        });
    }

    setupModal() {
        const modal = document.querySelector('.image-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalQuote = modal.querySelector('.modal-quote');
        const modalClose = modal.querySelector('.modal-close');
        
        // Close modal handlers
        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(jpgSrc, quote) {
        const modal = document.querySelector('.image-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalQuote = modal.querySelector('.modal-quote');
        
        modalImage.src = jpgSrc;
        modalQuote.textContent = quote;
        
        modal.removeAttribute('hidden');
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        console.log(`Opened modal with: ${jpgSrc}`);
    }

    closeModal() {
        const modal = document.querySelector('.image-modal');
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => {
            modal.setAttribute('hidden', '');
        }, 300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new SimpleArtGallery();
    gallery.init();
});
