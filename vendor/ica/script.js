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

// Initialize all carousels
document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(carousel);
});



