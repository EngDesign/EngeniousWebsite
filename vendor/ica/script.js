class Carousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.carouselInner = carouselElement.querySelector('.carousel-inner');
        this.slides = carouselElement.querySelectorAll('.carousel-inner .carousel-item');
        this.totalSlides = this.slides.length;
        this.step = 100 / this.totalSlides;
        this.activeSlide = 0;
        this.activeIndicator = 0;
        this.direction = -1;
        this.jump = 1;
        this.interval = 5000;
        this.time = null;
        
        this.init();
    }
    
    init() {
        this.carouselInner.style.minWidth = (this.totalSlides * 100) + '%';
        this.bindEvents();
        this.loop(true);
    }
    
    bindEvents() {
        this.carouselInner.addEventListener('transitionend', () => {
            if(this.direction === -1){
                if(this.jump > 1){
                    for(let i = 0; i < this.jump; i++){
                        this.activeSlide++;
                        this.carouselInner.append(this.carouselInner.firstElementChild);
                    }
                }else{
                    this.activeSlide++;
                    this.carouselInner.append(this.carouselInner.firstElementChild);
                }
            }else if(this.direction === 1){
                if(this.jump > 1){
                    for(let i = 0; i < this.jump; i++){
                        this.activeSlide--;
                        this.carouselInner.prepend(this.carouselInner.lastElementChild);
                    }
                }else{
                    this.activeSlide--;
                    this.carouselInner.prepend(this.carouselInner.lastElementChild);
                }
            }

            this.carouselInner.style.transition = 'none';
            this.carouselInner.style.transform = 'translateX(0%)';
            setTimeout(() => {
                this.jump = 1;
                this.carouselInner.style.transition = 'all ease .5s';
            });
        });

        this.carousel.querySelectorAll('.carousel-indicators span').forEach(item => {
            item.addEventListener('click', (e) => {
                let slideTo = parseInt(e.target.dataset.slideTo);
                
                let indicators = this.carousel.querySelectorAll('.carousel-indicators span');

                indicators.forEach((item, index) => {
                    if(item.classList.contains('active')){
                        this.activeIndicator = index;
                    }
                });

                if(slideTo - this.activeIndicator > 1){
                    this.jump = slideTo - this.activeIndicator;
                    this.step = this.jump * this.step;
                    this.slideToNext();
                }else if(slideTo - this.activeIndicator === 1){
                    this.slideToNext();
                }else if(slideTo - this.activeIndicator < 0){
                    if(Math.abs(slideTo - this.activeIndicator) > 1){
                        this.jump = Math.abs(slideTo - this.activeIndicator);
                        this.step = this.jump * this.step;
                        this.slideToPrev();
                    }
                    this.slideToPrev();
                }
                this.step = 100 / this.totalSlides;
            });
        });

        this.carousel.addEventListener('mouseover', () => {
            this.loop(false);
        });

        this.carousel.addEventListener('mouseout', () => {
            this.loop(true);
        });
    }
    
    slideToNext() {
        if(this.direction === 1){
            this.direction = -1;
            this.carouselInner.prepend(this.carouselInner.lastElementChild);
        }
        
        this.carousel.style.justifyContent = 'flex-start';
        this.carouselInner.style.transform = `translateX(-${this.step}%)`;
    }

    slideToPrev() {
        if(this.direction === -1){
            this.direction = 1;
            this.carouselInner.append(this.carouselInner.firstElementChild);
        }
        this.carousel.style.justifyContent = 'flex-end';
        this.carouselInner.style.transform = `translateX(${this.step}%)`;
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



