(function MasonryGallery() {
    const grid = document.getElementById('masonryGrid');
    if (!grid) return;

    let images = [];

    // Initialize masonry gallery with intelligent sizing
    function init() {
        console.log('Initializing masonry gallery...');
        
        if (!window.CAROUSEL_DATA || !window.CAROUSEL_DATA.images) {
            console.error('Gallery images data not found');
            return;
        }

        images = window.CAROUSEL_DATA.images;
        console.log(`Loading ${images.length} images into masonry gallery`);

        // Clear existing content
        grid.innerHTML = '';

        // Create image elements and determine sizes
        images.forEach((imageData, index) => {
            createMasonryItem(imageData, index);
        });
    }

    function createMasonryItem(imageData, index) {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.setAttribute('data-index', index);
        
        // Create image container - no quotes in gallery view
        const imageContainer = document.createElement('div');
        imageContainer.className = 'masonry-item-image';
        
        const img = document.createElement('img');
        // Use PNG for thumbnails on main page
        const thumbnailSrc = imageData.src.replace('.jpg', '.png');
        img.src = thumbnailSrc;
        img.alt = imageData.alt;
        img.loading = 'lazy';
        img.decoding = 'async';

        // Get natural dimensions and apply intelligent sizing
        img.onload = function() {
            const aspectRatio = this.naturalWidth / this.naturalHeight;
            console.log(`Image ${index}: ${this.naturalWidth}x${this.naturalHeight}, aspect: ${aspectRatio.toFixed(2)}`);
            
            // Apply size class based on dimensions for better gallery layout
            applyIntelligentSizing(item, this.naturalWidth, this.naturalHeight, aspectRatio);
        };

        // Add click handler to open modal with JPG version
        item.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Gallery item clicked:', index);
            // Create data object with JPG for modal and dimensions
            const modalData = {
                ...imageData,
                src: imageData.src, // This will be the JPG version
                thumbnailElement: img // Pass the loaded image for dimension info
            };
            openModal(modalData);
        });

        imageContainer.appendChild(img);
        item.appendChild(imageContainer);
        // No quote element added to gallery view
        grid.appendChild(item);

        // Set up intersection observer for scroll animations
        observeElement(item);
    }

    // Apply intelligent sizing based on natural dimensions
    function applyIntelligentSizing(item, naturalWidth, naturalHeight, aspectRatio) {
        // Calculate display dimensions while preserving aspect ratio
        let displayWidth, displayHeight;
        
        if (aspectRatio > 1.5) {
            // Very wide images (landscape) - keep original size
            displayWidth = Math.min(400, naturalWidth);
            displayHeight = displayWidth / aspectRatio;
            item.classList.add('wide-image');
        } else if (aspectRatio < 0.7) {
            // Very tall images (portrait) - keep original size
            displayHeight = Math.min(500, naturalHeight);
            displayWidth = displayHeight * aspectRatio;
            item.classList.add('tall-image');
        } else {
            // Standard images - keep original size
            const maxDimension = 350; // Restored original size limit
            if (naturalWidth > naturalHeight) {
                displayWidth = Math.min(maxDimension, naturalWidth);
                displayHeight = displayWidth / aspectRatio;
            } else {
                displayHeight = Math.min(maxDimension, naturalHeight);
                displayWidth = displayHeight * aspectRatio;
            }
            item.classList.add('standard-image');
        }

        // Apply the calculated dimensions
        item.style.width = `${displayWidth}px`;
        
        // Store dimensions for modal use
        item.setAttribute('data-aspect-ratio', aspectRatio);
        item.setAttribute('data-natural-width', naturalWidth);
        item.setAttribute('data-natural-height', naturalHeight);
    }

    // Intersection Observer for scroll animations
    function observeElement(element) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay based on element index for staggered animation
                    const index = parseInt(entry.target.getAttribute('data-index'));
                    const delay = (index % 3) * 150; // Stagger animation
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '50px'
        });

        observer.observe(element);
    }

    function determineSizeClass(aspectRatio, index) {
        // Create an intelligent mix of sizes for better collage effect
        const totalImages = images.length;
        const position = index / totalImages;

        // Strategic sizing for visual balance
        if (index === 0 || index === Math.floor(totalImages / 3) || index === Math.floor(totalImages * 2 / 3)) {
            // Make some key images larger for focal points
            return aspectRatio > 1.5 ? 'size-wide' : 'size-large';
        }
        
        if (aspectRatio > 1.8) {
            // Very wide images
            return 'size-wide';
        } else if (aspectRatio > 1.3) {
            // Wide images - mix of medium and small
            return (index % 3 === 0) ? 'size-medium' : 'size-small';
        } else if (aspectRatio < 0.8) {
            // Tall images
            return (index % 4 === 0) ? 'size-tall' : 'size-medium';
        } else {
            // Square-ish images - create variety
            const sizeOptions = ['size-small', 'size-medium', 'size-large'];
            const weights = [0.5, 0.35, 0.15]; // Prefer smaller sizes for better filling
            
            let random = (index * 17 + aspectRatio * 100) % 100; // Pseudo-random based on index
            if (random < weights[0] * 100) return sizeOptions[0];
            if (random < (weights[0] + weights[1]) * 100) return sizeOptions[1];
            return sizeOptions[2];
        }
    }

    function openModal(imageData) {
        console.log('Opening modal for:', imageData.alt);
        
        const modal = document.getElementById('imageModal');
        const modalContent = modal.querySelector('.modal-content');
        const modalImage = document.getElementById('modalImage');
        const modalQuote = document.getElementById('modalQuote');

        if (!modal) {
            console.error('Modal element not found');
            return;
        }

        if (modalImage && modalQuote) {
            modalImage.src = imageData.src;
            modalImage.alt = imageData.alt;
            modalQuote.textContent = imageData.quote;

            // Determine layout based on image dimensions
            const img = new Image();
            img.onload = function() {
                const aspectRatio = this.width / this.height;
                console.log(`Modal image aspect ratio: ${aspectRatio.toFixed(2)}`);
                
                // Clear previous layout classes
                modalContent.classList.remove('portrait-layout', 'landscape-layout');
                
                // Apply layout based on aspect ratio
                if (aspectRatio < 1.2) {
                    // Portrait or square - use side-by-side layout
                    modalContent.classList.add('portrait-layout');
                    console.log('Applied portrait layout');
                } else {
                    // Landscape - use top-bottom layout
                    modalContent.classList.add('landscape-layout');
                    console.log('Applied landscape layout');
                }
            };
            img.src = imageData.src;

            // Show modal
            modal.hidden = false;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Close modal function
            const closeModal = () => {
                modal.hidden = true;
                modal.style.display = 'none';
                document.body.style.overflow = '';
                // Clear layout classes when closing
                modalContent.classList.remove('portrait-layout', 'landscape-layout');
            };
            
            // Remove existing event listeners to prevent duplicates
            const closeBtn = modal.querySelector('.modal-close');
            const overlay = modal.querySelector('.modal-overlay');
            
            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                modal.querySelector('.modal-close').addEventListener('click', closeModal);
            }
            
            if (overlay) {
                overlay.replaceWith(overlay.cloneNode(true));
                modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
            }
            
            // ESC key handler
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        } else {
            console.error('Modal image or quote element not found');
        }
    }

    // Initialize when data is ready
    function delayedInit() {
        console.log('Attempting to initialize masonry gallery...');
        console.log('CAROUSEL_DATA available:', !!window.CAROUSEL_DATA);
        console.log('Images available:', window.CAROUSEL_DATA?.images?.length || 0);
        
        if (window.CAROUSEL_DATA && window.CAROUSEL_DATA.images) {
            init();
        } else {
            console.warn('Gallery data not found, retrying...');
            setTimeout(delayedInit, 200);
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', delayedInit);
    } else {
        delayedInit();
    }
})();
