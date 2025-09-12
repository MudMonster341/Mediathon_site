/**
 * Utility Functions
 * Small helper functions used throughout the museum application
 */

// DOM query shortcuts
window.qs = (selector, element = document) => element.querySelector(selector);
window.qsa = (selector, element = document) => Array.from(element.querySelectorAll(selector));

// Event listener shortcut
window.on = (element, event, handler, options = {}) => {
    if (typeof element === 'string') {
        element = qs(element);
    }
    if (element) {
        element.addEventListener(event, handler, options);
    }
};

/**
 * Preload an image and return a promise
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
 */
window.preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
};

/**
 * Play sound at specified volume
 * @param {string} src - Audio file path
 * @param {number} volume - Volume level (0-1)
 * @param {boolean} loop - Whether to loop the sound
 * @returns {HTMLAudioElement|null}
 */
window.playSound = (src, volume = 1, loop = false) => {
    try {
        const audio = new Audio(src);
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.loop = loop;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Audio play failed:', error);
            });
        }
        
        return audio;
    } catch (error) {
        console.warn('Audio creation failed:', error);
        return null;
    }
};

/**
 * Clamp text to specified number of lines with ellipsis
 * @param {HTMLElement} element - Element to clamp
 * @param {number} lines - Number of lines to clamp to
 */
window.clampLines = (element, lines = 3) => {
    if (!element) return;
    
    element.style.display = '-webkit-box';
    element.style.webkitBoxOrient = 'vertical';
    element.style.webkitLineClamp = lines.toString();
    element.style.lineClamp = lines.toString();
    element.style.overflow = 'hidden';
};

/**
 * Get URL parameter value
 * @param {string} name - Parameter name
 * @returns {string|null}
 */
window.getUrlParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

/**
 * Set URL parameter without page refresh
 * @param {string} name - Parameter name
 * @param {string} value - Parameter value
 */
window.setUrlParam = (name, value) => {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set(name, value);
    } else {
        url.searchParams.delete(name);
    }
    window.history.replaceState({}, '', url);
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @param {boolean} immediate - Execute immediately
 * @returns {Function}
 */
window.debounce = (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
};

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function}
 */
window.throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
window.random = (min, max) => Math.random() * (max - min) + min;

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
window.randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Threshold percentage (0-1)
 * @returns {boolean}
 */
window.inViewport = (element, threshold = 0) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const elementHeight = rect.height;
    const elementWidth = rect.width;
    
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
    
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = elementHeight * elementWidth;
    
    return (visibleArea / totalArea) >= threshold;
};

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Element or selector
 * @param {number} offset - Offset from top in pixels
 * @param {string} behavior - Scroll behavior ('smooth' or 'auto')
 */
window.scrollToElement = (target, offset = 0, behavior = 'smooth') => {
    const element = typeof target === 'string' ? qs(target) : target;
    if (!element) return;
    
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: behavior
    });
};

/**
 * Format time duration
 * @param {number} seconds - Duration in seconds
 * @returns {string}
 */
window.formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any}
 */
window.deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
};

/**
 * Local storage helpers with error handling
 */
window.storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing from localStorage (${key}):`, error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
            return false;
        }
    }
};

/**
 * Session storage helpers with error handling
 */
window.sessionStore = {
    get: (key, defaultValue = null) => {
        try {
            const item = sessionStorage.getItem(key);
            return item !== null ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from sessionStorage (${key}):`, error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Error writing to sessionStorage (${key}):`, error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Error removing from sessionStorage (${key}):`, error);
            return false;
        }
    }
};

/**
 * Device and browser detection
 */
window.device = {
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    isMobile: () => {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet: () => {
        return /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(navigator.userAgent);
    },
    
    isDesktop: () => {
        return !window.device.isMobile() && !window.device.isTablet();
    },
    
    supportsWebP: () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
};

/**
 * Animation frame utilities
 */
window.animation = {
    frame: (callback) => {
        return requestAnimationFrame(callback);
    },
    
    cancel: (id) => {
        cancelAnimationFrame(id);
    },
    
    nextFrame: () => {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }
};

// Initialize utility functions
console.log('Museum utilities loaded successfully');
