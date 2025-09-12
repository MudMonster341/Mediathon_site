/**
 * Art Gallery with CSV-Based Quotes and Masonry Layout
 * Pure vanilla JavaScript implementation
 */

class ArtGallery {
    constructor() {
        this.quotes = new Map();
        this.images = [];
        this.modal = null;
        this.isModalOpen = false;
        this.lastFocusedElement = null;
        
        this.init();
    }
    
    async init() {
        console.log('🎨 Initializing Art Gallery...');
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            await this.setup();
        }
    }
    
    async setup() {
        try {
            // Step 1: Load quotes from CSV
            await this.loadQuotes();
            
            // Step 2: Generate image list from available PNG files
            this.generateImageList();
            
            // Step 3: Setup DOM elements
            this.setupModal();
            
            // Step 4: Create masonry gallery
            await this.createMasonryGallery();
            
            // Step 5: Setup event listeners
            this.setupEventListeners();
            
            console.log(`✅ Gallery initialized with ${this.images.length} images`);
        } catch (error) {
            console.error('❌ Failed to initialize gallery:', error);
        }
    }
    
    async loadQuotes() {
        try {
            const response = await fetch('assets/Carousel_images/MEDIATHON_QUOTES.csv');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const csvText = await response.text();
            const lines = csvText.split('\n').filter(line => line.trim());
            
            // Skip header line, parse data
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Parse CSV (handle quoted values)
                const [filename, quote] = this.parseCSVLine(line);
                if (filename && quote) {
                    // Map both .jpg and .png versions to same quote
                    const baseName = filename.replace('.jpg', '');
                    this.quotes.set(`${baseName}.jpg`, quote);
                    this.quotes.set(`${baseName}.png`, quote);
                }
            }
            
            console.log(`📝 Loaded ${this.quotes.size} quotes`);
        } catch (error) {
            console.error('Failed to load quotes:', error);
            // Continue with empty quotes map
        }
    }
    
    parseCSVLine(line) {
        // Handle CSV with potential formatting issues
        const commaIndex = line.indexOf(',');
        if (commaIndex === -1) return [null, null];
        
        const filename = line.substring(0, commaIndex).trim();
        let quote = line.substring(commaIndex + 1).trim();
        
        // Clean up quote formatting
        quote = quote.replace(/^"*|"*$/g, ''); // Remove leading/trailing quotes
        quote = quote.replace(/""/g, '"'); // Replace double quotes with single
        quote = quote.trim();
        
        return [filename, quote];
    }
    
    generateImageList() {
        // Generate list of PNG images based on known pattern
        const imageNumbers = Array.from({length: 15}, (_, i) => i + 1);
        
        this.images = imageNumbers.map(num => {
            const filename = `IMG_${num}.png`;
            const baseName = `IMG_${num}`;
            const imagePath = `assets/Carousel_images/${filename}`;
            
            console.log(`🖼️ Generating image entry: ${imagePath}`);
            
            return {
                src: imagePath,
                filename: filename,
                alt: `Student life image ${num}`,
                quote: this.quotes.get(`${baseName}.jpg`) || this.quotes.get(`${baseName}.png`) || 'A moment captured in time.',
                id: `img-${num}`
            };
        });
        
        console.log(`🖼️ Generated ${this.images.length} image entries`);
    }
    
    setupModal() {
        this.modal = document.getElementById('imageModal');
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        this.modalImageContainer = this.modal.querySelector('.modal-image-container');
        this.modalQuote = this.modal.querySelector('.modal-quote');
        this.modalClose = this.modal.querySelector('.modal-close');
        this.modalOverlay = this.modal.querySelector('.modal-overlay');
    }
    
    async createMasonryGallery() {
        const grid = document.getElementById('masonryGrid');
        if (!grid) {
            console.error('Gallery grid not found');
            return;
        }
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Create gallery items
        for (const [index, imageData] of this.images.entries()) {
            const item = await this.createGalleryItem(imageData, index);
            grid.appendChild(item);
        }
        
        // Apply masonry layout after all images load
        setTimeout(() => this.applyMasonryLayout(), 100);
    }
    
    async createGalleryItem(imageData, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image: ${imageData.alt}`);
        
        // Create image directly without museum frame
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.loading = 'lazy';
        img.className = 'gallery-image';
        
        // Create quote section below image
        const quoteSection = document.createElement('div');
        quoteSection.className = 'quote-section';
        
        const quoteText = document.createElement('p');
        quoteText.className = 'quote-text';
        quoteText.textContent = imageData.quote;
        
        quoteSection.appendChild(quoteText);
        
        item.appendChild(img);
        item.appendChild(quoteSection);
        
        // Wait for image to load and calculate grid spans
        return new Promise((resolve) => {
            img.onload = () => {
                this.calculateGridSpans(item, img);
                resolve(item);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${imageData.src}`);
                item.style.display = 'none';
                resolve(item);
            };
            
            // Fallback timeout
            setTimeout(() => resolve(item), 5000);
        });
    }
    
    calculateGridSpans(item, img) {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        
        // Calculate row span based on aspect ratio
        // Base row height is 10px, typical image height ~200-400px
        const baseSpan = 20; // Minimum rows for image
        const quoteSpan = 8; // Additional rows for quote section
        const rowSpan = Math.ceil(baseSpan * aspectRatio) + quoteSpan;
        
        // Apply grid positioning
        item.style.gridRowEnd = `span ${Math.max(rowSpan, baseSpan + quoteSpan)}`;
        
        // Add orientation class for additional styling
        if (aspectRatio > 1.2) {
            item.classList.add('portrait');
        } else if (aspectRatio < 0.8) {
            item.classList.add('landscape');
        }
    }
    
    applyMasonryLayout() {
        const grid = document.getElementById('masonryGrid');
        if (!grid) return;
        
        // Force browser to recalculate grid layout
        grid.style.display = 'none';
        grid.offsetHeight; // Trigger reflow
        grid.style.display = 'grid';
        
        console.log('🧱 Applied masonry layout');
    }
    
    setupEventListeners() {
        // Gallery item click/keyboard events
        document.addEventListener('click', this.handleGalleryClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Modal close events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', this.closeModal.bind(this));
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', this.closeModal.bind(this));
        }
        
        // Window resize
        window.addEventListener('resize', this.debounce(this.applyMasonryLayout.bind(this), 300));
    }
    
    handleGalleryClick(event) {
        const item = event.target.closest('.gallery-item');
        if (!item) return;
        
        const index = parseInt(item.dataset.index);
        this.openModal(index);
    }
    
    handleKeyDown(event) {
        if (this.isModalOpen && event.key === 'Escape') {
            event.preventDefault();
            this.closeModal();
            return;
        }
        
        // Gallery navigation
        const item = event.target.closest('.gallery-item');
        if (item && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            const index = parseInt(item.dataset.index);
            this.openModal(index);
        }
    }
    
    async openModal(index) {
        const imageData = this.images[index];
        if (!imageData || !this.modal) return;
        
        this.lastFocusedElement = document.activeElement;
        
        // Update modal content
        this.updateModalContent(imageData);
        
        // Show modal
        this.modal.removeAttribute('hidden');
        this.isModalOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            if (this.modalClose) {
                this.modalClose.focus();
            }
        }, 100);
        
        console.log(`🖼️ Opened modal for: ${imageData.filename}`);
    }
    
    updateModalContent(imageData) {
        // Create image directly without museum frame
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.className = 'modal-image';
        
        // Update modal content
        if (this.modalImageContainer) {
            this.modalImageContainer.innerHTML = '';
            this.modalImageContainer.appendChild(img);
        }
        
        if (this.modalQuote) {
            this.modalQuote.textContent = imageData.quote;
        }
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.setAttribute('hidden', '');
        this.isModalOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
        
        console.log('❌ Modal closed');
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.artGallery = new ArtGallery();
});

// Global reference for debugging
window.ArtGallery = ArtGallery;
