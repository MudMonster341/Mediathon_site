(function HeroCarousel(){
  const root = document.getElementById('heroCarousel');
  if(!root) return;

  const track = root.querySelector('#heroTrack');
  const prev = root.querySelector('#heroPrev');
  const next = root.querySelector('#heroNext');
  const viewport = root.querySelector('.hero-carousel__viewport');

  let slides = [];
  let i = 0;
  let last = 0;

  // timings
  const REVEAL_MS = 1200;      // matches CSS slide-fade-in duration
  const HOLD_MS   = 3800;      // time to linger after reveal (total 5 seconds)
  const AUTO_MS   = REVEAL_MS + HOLD_MS;

  let autoTimer = null;
  let dragging = false, startX = 0, curX = 0;

  // Initialize carousel with data from carousel images
  function init() {
    if (!window.CAROUSEL_DATA || !window.CAROUSEL_DATA.images) {
      console.error('Carousel images data not found');
      return;
    }

    // Use carousel images directly
    const allImages = window.CAROUSEL_DATA.images;

    // Populate carousel track
    track.innerHTML = '';
    allImages.forEach((image, index) => {
      const slide = document.createElement('li');
      slide.className = 'hero-carousel__slide';
      slide.innerHTML = `
        <div class="reveal">
          <img src="${image.src}" alt="${image.alt}" loading="lazy" decoding="async">
        </div>
      `;
      
      // Add click handler to open modal
      slide.addEventListener('click', () => openModal(image));
      
      track.appendChild(slide);
    });

    slides = [...track.children];
    last = slides.length - 1;
    
    if (slides.length > 0) {
      update();
    }
  }

  function openModal(imageData) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalQuote = document.getElementById('modalQuote');
    const museumFrame = document.getElementById('museumFrame');

    if (modal && modalImage && modalQuote) {
      modalImage.src = imageData.src;
      modalImage.alt = imageData.alt;
      modalQuote.textContent = imageData.quote;
      
      // Detect orientation and set class
      const img = new Image();
      img.onload = function() {
        museumFrame.className = 'museum-frame ' + (this.width > this.height ? 'is-landscape' : 'is-portrait');
      };
      img.src = imageData.src;

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      
      // Close modal handlers
      const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
      };
      
      modal.querySelector('.modal-close').addEventListener('click', closeModal);
      modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
      
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      });
    }
  }

  function setActive(idx){
    slides.forEach((s, k)=>{
      s.classList.toggle('is-active', k === idx);
      // reset reveal state when leaving a slide
      if(k !== idx){
        const r = s.querySelector('.reveal');
        if(r){ r.style.animation = 'none'; r.offsetHeight; r.style.animation=''; }
      }
    });
  }

  function update(){
    track.style.transform = `translate3d(${-(i*100)}%,0,0)`;
    prev.disabled = (i === 0);
    next.disabled = (i === last);
    setActive(i);
    // Preload neighbors
    [i-1, i+1].forEach(n=>{
      const s=slides[n]; if(!s) return;
      const img=s.querySelector('img'); if(img && img.dataset && img.dataset.src){
        const a=new Image(); a.src=img.dataset.src;
      }
    });
    restartAuto();
  }

  function go(n){ i = Math.max(0, Math.min(last, n)); update(); }
  function nextSlide(){ go(i+1); }
  function prevSlide(){ go(i-1); }

  // autoplay: go next after reveal+hold
  function restartAuto(){
    clearTimeout(autoTimer);
    autoTimer = setTimeout(()=>{
      go(i < last ? i+1 : 0);
    }, AUTO_MS);
  }

  prev.addEventListener('click', ()=>{ clearTimeout(autoTimer); prevSlide(); });
  next.addEventListener('click', ()=>{ clearTimeout(autoTimer); nextSlide(); });

  // keyboard
  viewport.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') { clearTimeout(autoTimer); nextSlide(); }
    if(e.key==='ArrowLeft')  { clearTimeout(autoTimer); prevSlide(); }
  });
  viewport.tabIndex = 0;

  // swipe (pointer)
  viewport.addEventListener('pointerdown', e=>{
    dragging = true; startX = curX = e.clientX;
    root.classList.add('hero-carousel--dragging');
    viewport.setPointerCapture(e.pointerId);
    clearTimeout(autoTimer);
  });
  viewport.addEventListener('pointermove', e=>{
    if(!dragging) return;
    curX = e.clientX;
    const dx = curX - startX;
    const pct = dx / viewport.clientWidth * 100;
    track.style.transform = `translate3d(${-(i*100)+pct}%,0,0)`;
  });
  viewport.addEventListener('pointerup', e=>{
    if(!dragging) return;
    dragging = false; root.classList.remove('hero-carousel--dragging');
    const dx = curX - startX;
    const th = viewport.clientWidth * 0.15;
    if(dx >  th) prevSlide();
    else if(dx < -th) nextSlide();
    else update(); // snap back
  });

  // Wait for data to load, then initialize
  if (window.CAROUSEL_DATA && window.CAROUSEL_DATA.images) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(init, 100); // Small delay to ensure data is loaded
    });
  }
})();
