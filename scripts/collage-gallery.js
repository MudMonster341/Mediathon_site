// Intelligent Collage Gallery System
class CollageGallery {
    constructor() {
        this.images = [];
        this.container = null;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.margin = 8; // Small margin between images (roughly half cm)
    }

    async init() {
        this.container = document.querySelector('.masonry-grid');
        if (!this.container) return;

        // Calculate available space (viewport minus header/padding)
        this.containerWidth = window.innerWidth - 40; // 20px padding each side
        this.containerHeight = window.innerHeight - 200; // Account for header/footer
        
        this.container.style.width = `${this.containerWidth}px`;
        this.container.style.height = `${this.containerHeight}px`;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';

        await this.loadAndAnalyzeImages();
        this.arrangeCollage();
        this.setupClickHandlers();
    }

    async loadAndAnalyzeImages() {
        // Use the existing carousel data
        const imagePromises = window.carouselData.map(async (item, index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        element: null,
                        src: item.image, // PNG thumbnail
                        jpgSrc: item.image.replace('.png', '.jpg'), // JPG for modal
                        quote: item.quote,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        aspectRatio: img.naturalWidth / img.naturalHeight,
                        area: img.naturalWidth * img.naturalHeight,
                        index
                    });
                };
                img.src = item.image;
            });
        });

        this.images = await Promise.all(imagePromises);
        
        // Sort by area (largest first) for better packing algorithm
        this.images.sort((a, b) => b.area - a.area);
    }

    arrangeCollage() {
        // Calculate scale factor to fit all images in viewport
        const totalArea = this.images.reduce((sum, img) => sum + img.area, 0);
        const availableArea = (this.containerWidth - this.margin * 6) * (this.containerHeight - this.margin * 6);
        const baseScale = Math.sqrt(availableArea / totalArea) * 0.85; // 85% to ensure everything fits

        console.log(`Container: ${this.containerWidth}x${this.containerHeight}, Total area: ${totalArea}, Scale: ${baseScale.toFixed(3)}`);

        // Create positioned rectangles using intelligent packing
        const rects = [];
        let rows = [];
        let currentRow = [];
        let currentRowWidth = 0;
        let currentRowHeight = 0;
        let totalHeight = 0;

        for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];
            const scaledWidth = img.width * baseScale;
            const scaledHeight = img.height * baseScale;

            // Check if image fits in current row
            if (currentRowWidth + scaledWidth + this.margin <= this.containerWidth - this.margin * 2) {
                // Add to current row
                currentRow.push({
                    ...img,
                    displayWidth: scaledWidth,
                    displayHeight: scaledHeight
                });
                currentRowWidth += scaledWidth + this.margin;
                currentRowHeight = Math.max(currentRowHeight, scaledHeight);
            } else {
                // Finish current row and start new one
                if (currentRow.length > 0) {
                    rows.push({
                        items: currentRow,
                        height: currentRowHeight,
                        width: currentRowWidth - this.margin
                    });
                    totalHeight += currentRowHeight + this.margin;
                }
                
                currentRow = [{
                    ...img,
                    displayWidth: scaledWidth,
                    displayHeight: scaledHeight
                }];
                currentRowWidth = scaledWidth + this.margin;
                currentRowHeight = scaledHeight;
            }
        }

        // Add the last row
        if (currentRow.length > 0) {
            rows.push({
                items: currentRow,
                height: currentRowHeight,
                width: currentRowWidth - this.margin
            });
            totalHeight += currentRowHeight;
        }

        // If total height exceeds container, scale down all rows
        if (totalHeight > this.containerHeight - this.margin * 2) {
            const heightScale = (this.containerHeight - this.margin * 2) / totalHeight * 0.95;
            rows.forEach(row => {
                row.height *= heightScale;
                row.items.forEach(item => {
                    item.displayWidth *= heightScale;
                    item.displayHeight *= heightScale;
                });
            });
        }

        // Position all images
        let currentY = this.margin;
        rows.forEach(row => {
            let currentX = this.margin;
            
            // Center the row if it doesn't fill the width
            const rowWidth = row.items.reduce((sum, item) => sum + item.displayWidth, 0) + (row.items.length - 1) * this.margin;
            if (rowWidth < this.containerWidth - this.margin * 2) {
                currentX = (this.containerWidth - rowWidth) / 2;
            }

            row.items.forEach(item => {
                rects.push({
                    ...item,
                    x: currentX,
                    y: currentY
                });
                currentX += item.displayWidth + this.margin;
            });
            
            currentY += row.height + this.margin;
        });

        this.renderImages(rects);
    }

    renderImages(rects) {
        this.container.innerHTML = ''; // Clear existing content

        rects.forEach((rect, index) => {
            const item = document.createElement('div');
            item.className = 'collage-item';
            item.style.position = 'absolute';
            item.style.left = `${rect.x}px`;
            item.style.top = `${rect.y}px`;
            item.style.width = `${rect.displayWidth}px`;
            item.style.height = `${rect.displayHeight}px`;
            item.style.cursor = 'pointer';
            item.style.transition = 'all 0.3s ease';
            item.style.borderRadius = '8px';
            item.style.overflow = 'hidden';
            item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            const img = document.createElement('img');
            img.src = rect.src;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';

            item.appendChild(img);
            item.setAttribute('data-quote', rect.quote);
            item.setAttribute('data-jpg-src', rect.jpgSrc);
            item.setAttribute('data-index', index);

            // Add hover effect
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.02) translateY(0)';
                item.style.zIndex = '10';
                item.style.boxShadow = '0 8px 25px rgba(255, 179, 35, 0.3)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1) translateY(0)';
                item.style.zIndex = '1';
                item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            });

            this.container.appendChild(item);

            // Animate in with stagger
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    setupClickHandlers() {
        this.container.addEventListener('click', (e) => {
            const item = e.target.closest('.collage-item');
            if (item) {
                this.openModal(item);
            }
        });
    }

    openModal(item) {
        const modal = document.querySelector('.image-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalQuote = modal.querySelector('.modal-quote');
        const modalContent = modal.querySelector('.modal-content');
        
        const jpgSrc = item.getAttribute('data-jpg-src');
        const quote = item.getAttribute('data-quote');
        
        modalImage.src = jpgSrc;
        modalQuote.textContent = quote;
        
        // Determine layout based on image aspect ratio
        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio > 1.2) {
                modalContent.className = 'modal-content landscape-layout';
            } else {
                modalContent.className = 'modal-content portrait-layout';
            }
        };
        img.src = jpgSrc;
        
        modal.removeAttribute('hidden');
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
        });
    }
}

// Initialize the collage gallery
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new CollageGallery();
    gallery.init();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setTimeout(() => gallery.init(), 100);
    });
    
    // Setup modal close handlers
    const modal = document.querySelector('.image-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');
    
    function closeModal() {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => {
            modal.setAttribute('hidden', '');
        }, 300);
    }
    
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });
});
