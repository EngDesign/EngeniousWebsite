class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = carouselElement.querySelectorAll('.carousel-item');
        this.totalSlides = this.slides.length;
        this.activeSlide = 0;
        this.interval = 5000;
        this.time = null;
        
        this.init();
    }
    
    init() {
        this.wrapFirstWords();
        this.slides[0].classList.add('active');
        this.bindEvents();
        this.loop(true);
    }
    
    wrapFirstWords() {
        this.slides.forEach(slide => {
            const firstTextElement = slide.querySelector('h1, h2, h3, p');
            if (firstTextElement) {
                const text = firstTextElement.textContent.trim();
                const firstWord = text.split(' ')[0];
                const restText = text.substring(firstWord.length);
                firstTextElement.innerHTML = `<span class="first-word">${firstWord}</span>${restText}`;
            }
        });
    }
    
    bindEvents() {
        this.carousel.addEventListener('mouseover', () => {
            this.loop(false);
        });

        this.carousel.addEventListener('mouseout', () => {
            this.loop(true);
        });
    }
    
    slideToNext() {
        this.slides[this.activeSlide].classList.remove('active');
        this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
        this.slides[this.activeSlide].classList.add('active');
    }

    slideToPrev() {
        this.slides[this.activeSlide].classList.remove('active');
        this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
        this.slides[this.activeSlide].classList.add('active');
    }

    loop(status) {
        if(status === true){
            this.time = setInterval(() => {
                this.slideToNext();
            }, this.interval);
        }else{
            clearInterval(this.time);
        }
    }
}

// Initialize home carousel types
document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(carousel);
});

class testimonialCarousel{
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.slides = carouselElement.querySelectorAll('.carousel-item');
        this.totalSlides = this.slides.length;
        this.activeSlide = 0;
        this.interval = 5000;
        this.time = null;
        
        this.init();
    }
    
    init() {
        this.updateSlidePositions();
        this.updateHeight();
        this.bindEvents();
    }
    
    bindEvents() {
        const leftControl = this.carousel.querySelector('.carousel-control-left');
        const rightControl = this.carousel.querySelector('.carousel-control-right');
        
        leftControl?.addEventListener('click', () => this.slideToPrev());
        rightControl?.addEventListener('click', () => this.slideToNext());
    }
    
    updateHeight() {
        const activeSlide = this.slides[this.activeSlide];
        const carouselInner = this.carousel.querySelector('.carousel-inner');
        carouselInner.style.height = activeSlide.offsetHeight + 'px';
    }

    updateSlidePositions() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === this.activeSlide) {
                slide.classList.add('active');
            } else if (index < this.activeSlide) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
        this.updateArrowStates();
    }

    updateArrowStates() {
        const leftControl = this.carousel.querySelector('.carousel-control-left');
        const rightControl = this.carousel.querySelector('.carousel-control-right');
        
        leftControl?.classList.toggle('disabled', this.activeSlide === 0);
        rightControl?.classList.toggle('disabled', this.activeSlide === this.totalSlides - 1);
    }

    slideToNext() {
        if (this.activeSlide < this.totalSlides - 1) {
            this.activeSlide++;
            this.updateSlidePositions();
            this.updateHeight();
        }
    }

    slideToPrev() {
        if (this.activeSlide > 0) {
            this.activeSlide--;
            this.updateSlidePositions();
            this.updateHeight();
        }
    }
}

// Initialize testimonial carousel types
document.querySelectorAll('.carousel-testimonial').forEach(carousel => {
    new testimonialCarousel(carousel);
});

class LogoSlider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.logos = Array.from(sliderElement.querySelectorAll('.slider-logo'));
        this.speed = parseFloat(sliderElement.dataset.speed) || 30; // pixels per second
        this.offset = 0;
        this.setWidth = 0;
        this.paused = false;
        this.lastTime = null;

        this.init();
    }

    init() {
        if (!this.logos.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Move the logos into a track that can be translated as one strip
        this.track = document.createElement('div');
        this.track.className = 'logo-slider-track';
        this.logos.forEach(logo => {
            logo.loading = 'eager'; // lazy images outside the visible strip would pop in late
            this.track.appendChild(logo);
        });
        this.slider.appendChild(this.track);

        this.fill();
        this.bindEvents();
        requestAnimationFrame(time => this.step(time));
    }

    // Append copies of the logo set until the track covers the slider plus one full set,
    // so wrapping the offset back by one set width is invisible.
    fill() {
        this.track.querySelectorAll('.is-clone').forEach(clone => clone.remove());

        const firstClone = this.addSet();
        this.setWidth = firstClone.offsetLeft - this.logos[0].offsetLeft;
        if (this.setWidth <= 0) return; // slider is hidden, nothing to measure

        while (this.track.scrollWidth < this.slider.offsetWidth + this.setWidth) {
            this.addSet();
        }
        this.offset %= this.setWidth;
    }

    addSet() {
        const clones = this.logos.map(logo => {
            const clone = logo.cloneNode(true);
            clone.classList.add('is-clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.alt = '';
            this.track.appendChild(clone);
            return clone;
        });
        return clones[0];
    }

    bindEvents() {
        this.slider.addEventListener('mouseenter', () => {
            this.paused = true;
        });

        this.slider.addEventListener('mouseleave', () => {
            this.paused = false;
        });

        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.fill(), 200);
        });
        window.addEventListener('load', () => this.fill());
    }

    step(time) {
        if (this.lastTime !== null && !this.paused && this.setWidth > 0) {
            // Cap the frame delta so returning to a background tab doesn't jump
            const delta = Math.min(time - this.lastTime, 100) / 1000;
            this.offset = (this.offset + this.speed * delta) % this.setWidth;
            this.track.style.transform = `translate3d(${-this.offset}px, 0, 0)`;
        }
        this.lastTime = time;
        requestAnimationFrame(t => this.step(t));
    }
}

// Initialize logo sliders
document.querySelectorAll('.component-logo-slider').forEach(slider => {
    new LogoSlider(slider);
});
