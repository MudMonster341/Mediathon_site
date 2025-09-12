/**
 * Museum Data Configuration
 * Single editable file containing all room and photo data
 * 
 * Structure:
 * - rooms: Array of room objects with photos
 * - defaultRoomId: Starting room when gallery loads
 */

window.MUSEUM = {
    // Default room to display when gallery loads
    defaultRoomId: 'campus',
    
    // Room configuration with photos
    rooms: [
        {
            id: 'campus',
            name: 'Campus',
            photos: [
                {
                    src: 'assets/images/campus-001.jpg',
                    lqip: 'assets/lqip/campus-001.jpg',
                    title: 'Morning Walkways',
                    quote: 'Quiet corridors before the rush of students begins their day.',
                    alt: 'Students walking along shaded campus arcade with modern architecture',
                    credit: '© The Media Company, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-002.jpg',
                    lqip: 'assets/lqip/campus-002.jpg',
                    title: 'Academic Block',
                    quote: 'Where knowledge meets innovation in the heart of BITS Dubai.',
                    alt: 'Modern academic building with glass facade and students gathering outside',
                    credit: '© BITS Dubai Photography Club, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-003.jpg',
                    lqip: 'assets/lqip/campus-003.jpg',
                    title: 'Desert Sunset',
                    quote: 'Golden hour paints the campus in warm hues of possibility.',
                    alt: 'Campus buildings silhouetted against a vibrant desert sunset',
                    credit: '© Sarah Ahmed, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-004.jpg',
                    lqip: 'assets/lqip/campus-004.jpg',
                    title: 'Campus Views',
                    quote: 'Every corner tells a story of student dreams and aspirations.',
                    alt: 'Panoramic view of campus buildings and walkways',
                    credit: '© Campus Photography Team, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-005.jpg',
                    lqip: 'assets/lqip/campus-005.jpg',
                    title: 'Student Spaces',
                    quote: 'Common areas where friendships bloom and ideas flourish.',
                    alt: 'Students gathering in campus common areas and study spaces',
                    credit: '© Student Life Documentation, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-006.jpg',
                    lqip: 'assets/lqip/campus-006.jpg',
                    title: 'Architecture',
                    quote: 'Modern design meets traditional values in perfect harmony.',
                    alt: 'Architectural details of campus buildings and design elements',
                    credit: '© Architectural Photography, 2025',
                    aspectRatio: 'landscape'
                },
                {
                    src: 'assets/images/campus-007.jpg',
                    lqip: 'assets/lqip/campus-007.jpg',
                    title: 'Campus Life',
                    quote: 'The vibrant energy of student life captured in everyday moments.',
                    alt: 'Dynamic scenes of daily campus life and student activities',
                    credit: '© Daily Life Chronicles, 2025',
                    aspectRatio: 'landscape'
                }
            ]
        },
        {
            id: 'class',
            name: 'Class',
            photos: [
                {
                    src: 'assets/images/class-001.jpg',
                    lqip: 'assets/lqip/class-001.jpg',
                    title: 'Interactive Learning',
                    quote: 'Modern classrooms where ideas come alive through collaboration.',
                    alt: 'Students engaged in group discussion in a modern classroom with smart boards',
                    credit: '© Academic Affairs, 2025'
                },
                {
                    src: 'assets/images/class-002.jpg',
                    lqip: 'assets/lqip/class-002.jpg',
                    title: 'Lecture Hall',
                    quote: 'Amphitheater of knowledge where professors inspire the next generation.',
                    alt: 'Large lecture hall filled with attentive students during a presentation',
                    credit: '© BITS Dubai Media Team, 2025'
                },
                {
                    src: 'assets/images/class-003.jpg',
                    lqip: 'assets/lqip/class-003.jpg',
                    title: 'Study Sessions',
                    quote: 'Collaborative learning spaces where knowledge is shared and built.',
                    alt: 'Students in focused study session with textbooks and laptops',
                    credit: '© Academic Documentation, 2025'
                }
            ]
        },
        {
            id: 'labs',
            name: 'Labs',
            photos: [
                {
                    src: 'assets/images/labs-001.jpg',
                    lqip: 'assets/lqip/labs-001.jpg',
                    title: 'Research in Action',
                    quote: 'State-of-the-art facilities where theory meets practice.',
                    alt: 'Students working with advanced laboratory equipment and computers',
                    credit: '© Engineering Department, 2025'
                },
                {
                    src: 'assets/images/labs-002.jpg',
                    lqip: 'assets/lqip/labs-002.jpg',
                    title: 'Innovation Hub',
                    quote: 'Where tomorrow\'s breakthroughs begin with today\'s experiments.',
                    alt: 'Modern research lab with sophisticated instruments and focused researchers',
                    credit: '© Research Division, 2025'
                }
            ]
        },
        {
            id: 'sports',
            name: 'Sports',
            photos: [
                {
                    src: 'assets/images/sports-001.jpg',
                    lqip: 'assets/lqip/sports-001.jpg',
                    title: 'Basketball Courts',
                    quote: 'Where teamwork and determination create champions.',
                    alt: 'Indoor basketball court with students playing an intense match',
                    credit: '© Sports Committee, 2025'
                },
                {
                    src: 'assets/images/sports-002.jpg',
                    lqip: 'assets/lqip/sports-002.jpg',
                    title: 'Fitness Center',
                    quote: 'Building strong minds through strong bodies.',
                    alt: 'Well-equipped gym with students exercising and training',
                    credit: '© Athletic Department, 2025'
                }
            ]
        },
        {
            id: 'projects',
            name: 'Projects',
            photos: [
                {
                    src: 'assets/images/projects-001.jpg',
                    lqip: 'assets/lqip/projects-001.jpg',
                    title: 'Student Showcase',
                    quote: 'Creativity and engineering excellence on full display.',
                    alt: 'Students presenting their innovative projects at the annual exhibition',
                    credit: '© Student Affairs, 2025'
                },
                {
                    src: 'assets/images/projects-002.jpg',
                    lqip: 'assets/lqip/projects-002.jpg',
                    title: 'Maker Space',
                    quote: 'Where ideas transform into reality through hands-on creation.',
                    alt: 'Students working with 3D printers and fabrication tools in the maker space',
                    credit: '© Innovation Lab, 2025'
                }
            ]
        }
    ]
};

/**
 * Helper functions for working with museum data
 */

// Get room by ID
window.MUSEUM.getRoomById = function(roomId) {
    return this.rooms.find(room => room.id === roomId);
};

// Get all room names for dropdown
window.MUSEUM.getRoomNames = function() {
    return this.rooms.map(room => ({
        id: room.id,
        name: room.name
    }));
};

// Get total photo count across all rooms
window.MUSEUM.getTotalPhotos = function() {
    return this.rooms.reduce((total, room) => total + room.photos.length, 0);
};

// Get photo count for specific room
window.MUSEUM.getPhotoCount = function(roomId) {
    const room = this.getRoomById(roomId);
    return room ? room.photos.length : 0;
};

// Validate that all required fields are present
window.MUSEUM.validate = function() {
    const errors = [];
    
    if (!this.rooms || !Array.isArray(this.rooms)) {
        errors.push('Rooms array is required');
        return errors;
    }
    
    if (!this.defaultRoomId) {
        errors.push('Default room ID is required');
    }
    
    this.rooms.forEach((room, roomIndex) => {
        if (!room.id) errors.push(`Room ${roomIndex}: ID is required`);
        if (!room.name) errors.push(`Room ${roomIndex}: Name is required`);
        if (!room.photos || !Array.isArray(room.photos)) {
            errors.push(`Room ${roomIndex}: Photos array is required`);
            return;
        }
        
        room.photos.forEach((photo, photoIndex) => {
            const photoRef = `Room "${room.name}" Photo ${photoIndex + 1}`;
            if (!photo.src) errors.push(`${photoRef}: src is required`);
            if (!photo.lqip) errors.push(`${photoRef}: lqip is required`);
            if (!photo.title) errors.push(`${photoRef}: title is required`);
            if (!photo.quote) errors.push(`${photoRef}: quote is required`);
            if (!photo.alt) errors.push(`${photoRef}: alt text is required`);
            if (!photo.credit) errors.push(`${photoRef}: credit is required`);
        });
    });
    
    const defaultRoom = this.getRoomById(this.defaultRoomId);
    if (!defaultRoom) {
        errors.push(`Default room "${this.defaultRoomId}" not found in rooms array`);
    }
    
    return errors;
};

// Auto-validate on load
document.addEventListener('DOMContentLoaded', function() {
    const errors = window.MUSEUM.validate();
    if (errors.length > 0) {
        console.error('MUSEUM data validation errors:', errors);
    } else {
        console.log('MUSEUM data validated successfully');
        console.log(`Loaded ${window.MUSEUM.rooms.length} rooms with ${window.MUSEUM.getTotalPhotos()} total photos`);
    }
});
