document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const currentItem = this.closest('.accordion-item');
      const wasOpen = currentItem.classList.contains('is-open');
      
      // First, close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('is-open');
      });

      // If the clicked item wasn't already open, open it.
      if (!wasOpen) {
        currentItem.classList.add('is-open');
      }
    });
  });
});
