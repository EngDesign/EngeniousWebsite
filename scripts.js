document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const accordionImages = document.querySelectorAll('.accordion-image-wrapper img');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const currentItem = this.closest('.accordion-item');
      const wasOpen = currentItem.classList.contains('is-open');
      const itemIndex = Array.from(document.querySelectorAll('.accordion-item')).indexOf(currentItem);
      
      // First, close all accordion items and images
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('is-open');
      });
      accordionImages.forEach(img => {
        img.classList.remove('is-open');
      });

      // If the clicked item wasn't already open, open it and corresponding image
      if (!wasOpen) {
        currentItem.classList.add('is-open');
        if (accordionImages[itemIndex]) {
          accordionImages[itemIndex].classList.add('is-open');
        }
      }
    });
  });
});
