/**
 * Confetti Animation System
 * Creates celebratory particle effects for the clap functionality
 */

class ConfettiSystem {
    constructor() {
        this.container = null;
        this.activeAnimations = [];
        this.colors = [
            '#c9a227', // Gold
            '#ff6b6b', // Red
            '#4ecdc4', // Teal  
            '#45b7d1', // Blue
            '#f7b731', // Yellow
            '#5f27cd', // Purple
            '#00d2d3', // Cyan
            '#ff9ff3', // Pink
            '#54a0ff', // Light blue
            '#5f27cd'  // Purple
        ];
        
        this.init();
    }
    
    init() {
        // Create or find container
        this.container = qs('#confetti-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'confetti-container';
            this.container.className = 'confetti-container';
            document.body.appendChild(this.container);
        }
        
        console.log('Confetti system initialized');
    }
    
    /**
     * Create a burst of confetti
     * @param {Object} options - Configuration options
     */
    burst(options = {}) {
        const config = {
            count: options.count || 120,
            duration: options.duration || 3000,
            startVelocity: options.startVelocity || 45,
            spread: options.spread || 50,
            origin: options.origin || { x: 0.5, y: 0.5 },
            colors: options.colors || this.colors,
            shapes: options.shapes || ['square', 'circle', 'triangle'],
            ...options
        };
        
        // Clear any existing animations
        this.clear();
        
        // Create confetti pieces
        for (let i = 0; i < config.count; i++) {
            this.createPiece(config, i);
        }
        
        // Auto cleanup after duration
        setTimeout(() => {
            this.clear();
        }, config.duration + 1000);
        
        console.log(`Confetti burst: ${config.count} pieces for ${config.duration}ms`);
    }
    
    createPiece(config, index) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        
        // Random properties
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
        const size = random(4, 12);
        const rotation = random(0, 360);
        const velocity = random(config.startVelocity * 0.7, config.startVelocity * 1.3);
        
        // Starting position
        const startX = (config.origin.x + random(-0.1, 0.1)) * window.innerWidth;
        const startY = (config.origin.y + random(-0.05, 0.05)) * window.innerHeight;
        
        // Physics calculations
        const angle = random(-config.spread / 2, config.spread / 2) - 90; // -90 for upward direction
        const radians = (angle * Math.PI) / 180;
        const velocityX = Math.cos(radians) * velocity;
        const velocityY = Math.sin(radians) * velocity;
        
        // Duration with some randomness
        const duration = config.duration + random(-500, 500);
        const fallDistance = window.innerHeight + startY;
        
        // Style the piece
        this.stylePiece(piece, {
            color,
            shape,
            size,
            rotation,
            startX,
            startY,
            velocityX,
            velocityY,
            duration,
            fallDistance
        });
        
        // Add to container
        this.container.appendChild(piece);
        
        // Track for cleanup
        this.activeAnimations.push(piece);
        
        // Remove piece after animation
        setTimeout(() => {
            this.removePiece(piece);
        }, duration + 100);
    }
    
    stylePiece(piece, props) {
        // Basic styling
        piece.style.position = 'absolute';
        piece.style.left = `${props.startX}px`;
        piece.style.top = `${props.startY}px`;
        piece.style.width = `${props.size}px`;
        piece.style.height = `${props.size}px`;
        piece.style.backgroundColor = props.color;
        piece.style.pointerEvents = 'none';
        piece.style.zIndex = '1001';
        
        // Shape-specific styling
        switch (props.shape) {
            case 'circle':
                piece.style.borderRadius = '50%';
                break;
            case 'triangle':
                piece.style.width = '0';
                piece.style.height = '0';
                piece.style.backgroundColor = 'transparent';
                piece.style.borderLeft = `${props.size / 2}px solid transparent`;
                piece.style.borderRight = `${props.size / 2}px solid transparent`;
                piece.style.borderBottom = `${props.size}px solid ${props.color}`;
                break;
            case 'square':
            default:
                piece.style.borderRadius = '1px';
                break;
        }
        
        // Create complex animation
        const keyframes = this.generateKeyframes(props);
        const animation = piece.animate(keyframes, {
            duration: props.duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        // Store animation reference
        piece._animation = animation;
    }
    
    generateKeyframes(props) {
        const gravity = 980; // pixels per second squared
        const airResistance = 0.98;
        const frames = [];
        const frameCount = 60; // 60fps equivalent
        const dt = props.duration / 1000 / frameCount; // time per frame in seconds
        
        let x = props.startX;
        let y = props.startY;
        let vx = props.velocityX;
        let vy = props.velocityY;
        let rotation = props.rotation;
        let rotationSpeed = random(-5, 5); // rotation per frame
        
        // Generate physics-based keyframes
        for (let i = 0; i <= frameCount; i++) {
            const progress = i / frameCount;
            
            // Apply gravity
            vy += gravity * dt;
            
            // Apply air resistance
            vx *= airResistance;
            
            // Update position
            x += vx * dt;
            y += vy * dt;
            
            // Update rotation
            rotation += rotationSpeed;
            
            // Calculate opacity (fade out near end)
            let opacity = 1;
            if (progress > 0.7) {
                opacity = 1 - ((progress - 0.7) / 0.3);
            }
            
            frames.push({
                transform: `translate(${x - props.startX}px, ${y - props.startY}px) rotate(${rotation}deg)`,
                opacity: Math.max(0, opacity),
                offset: progress
            });
        }
        
        return frames;
    }
    
    removePiece(piece) {
        if (piece && piece.parentNode) {
            // Cancel animation if still running
            if (piece._animation) {
                piece._animation.cancel();
            }
            
            // Remove from DOM
            piece.parentNode.removeChild(piece);
            
            // Remove from tracking array
            const index = this.activeAnimations.indexOf(piece);
            if (index > -1) {
                this.activeAnimations.splice(index, 1);
            }
        }
    }
    
    /**
     * Clear all active confetti
     */
    clear() {
        if (this.container) {
            // Remove all pieces
            while (this.container.firstChild) {
                const child = this.container.firstChild;
                if (child._animation) {
                    child._animation.cancel();
                }
                this.container.removeChild(child);
            }
        }
        
        // Clear tracking array
        this.activeAnimations = [];
    }
    
    /**
     * Create a shower effect
     * @param {Object} options - Configuration options
     */
    shower(options = {}) {
        const config = {
            duration: options.duration || 5000,
            particlesPerSecond: options.particlesPerSecond || 30,
            ...options
        };
        
        const interval = 1000 / config.particlesPerSecond;
        let elapsed = 0;
        
        const createShowerPiece = () => {
            if (elapsed >= config.duration) return;
            
            this.burst({
                count: 1,
                duration: 3000,
                origin: {
                    x: Math.random(),
                    y: -0.1
                },
                startVelocity: 20,
                spread: 30
            });
            
            elapsed += interval;
            setTimeout(createShowerPiece, interval);
        };
        
        createShowerPiece();
    }
    
    /**
     * Create firework-style burst
     * @param {Object} options - Configuration options  
     */
    firework(options = {}) {
        const config = {
            count: 80,
            duration: 2000,
            startVelocity: 60,
            spread: 360,
            ...options
        };
        
        this.burst(config);
    }
    
    /**
     * Get current animation count
     * @returns {number}
     */
    getActiveCount() {
        return this.activeAnimations.length;
    }
    
    /**
     * Check if system is currently animating
     * @returns {boolean}
     */
    isActive() {
        return this.activeAnimations.length > 0;
    }
}

// Create global instance
const confetti = new ConfettiSystem();

// Export for use in other modules
window.confetti = confetti;

// Also export the class for custom instances
window.ConfettiSystem = ConfettiSystem;
