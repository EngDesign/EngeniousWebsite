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

  // Team filtering
  const checkboxes = document.querySelectorAll('.team-checkbox-field input[type="checkbox"]');
  const teamItems = document.querySelectorAll('.team-collection-item');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.id === 'All') {
        if (this.checked) {
          checkboxes.forEach(cb => cb !== this && (cb.checked = false));
          teamItems.forEach(item => item.style.display = 'block');
        }
      } else {
        document.getElementById('All').checked = false;
        const checkedRoles = Array.from(checkboxes)
          .filter(cb => cb.checked && cb.id !== 'All')
          .map(cb => cb.id.replace('-', ' '));
        
        teamItems.forEach(item => {
          const role = item.getAttribute('data-role');
          item.style.display = checkedRoles.length === 0 || checkedRoles.includes(role) ? 'block' : 'none';
        });
      }
    });
  });

  // Team modal
  let modal = null;
  
  teamItems.forEach(item => {
    item.addEventListener('click', function() {
      const modalContent = this.querySelector('.team-modal-content').cloneNode(true);
      
      modal = document.createElement('div');
      modal.className = 'team-modal';
      modal.innerHTML = `
        <div class="team-modal-backdrop">
          <div class="team-modal-dialog">
            <button class="team-modal-close">×</button>
            ${modalContent.outerHTML}
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      modal.querySelector('.team-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.team-modal-backdrop').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
      });
    });
  });
  
  function closeModal() {
    if (modal) {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
      modal = null;
    }
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal) closeModal();
  });
});
