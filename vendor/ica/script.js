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
    }

    slideToNext() {
        this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
        this.updateSlidePositions();
        this.updateHeight();
    }

    slideToPrev() {
        this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePositions();
        this.updateHeight();
    }
}

// Initialize home carousel types
document.querySelectorAll('.carousel-testimonial').forEach(carousel => {
    new testimonialCarousel(carousel);
});
