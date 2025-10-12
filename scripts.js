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
  let checkedState = { All: true };
  
  function updateVisuals() {
    checkboxes.forEach(cb => {
      cb.checked = checkedState[cb.id] || false;
      const wrapper = cb.previousElementSibling;
      if (wrapper && wrapper.classList.contains('w-checkbox-input')) {
        if (checkedState[cb.id]) {
          wrapper.classList.add('w--redirected-checked');
        } else {
          wrapper.classList.remove('w--redirected-checked');
        }
      }
    });
    
    if (checkedState.All) {
      teamItems.forEach(item => item.style.display = 'block');
    } else {
      const activeRoles = Object.keys(checkedState).filter(key => key !== 'All' && checkedState[key]).map(key => key.replace('-', ' '));
      teamItems.forEach(item => {
        const role = item.getAttribute('data-role');
        item.style.display = activeRoles.includes(role) ? 'block' : 'none';
      });
    }
  }
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (this.id === 'All') {
        if (!checkedState.All) {
          checkedState = { All: true };
        }
      } else {
        if (checkedState[this.id]) {
          delete checkedState[this.id];
        } else {
          delete checkedState.All;
          checkedState[this.id] = true;
        }
        
        if (Object.keys(checkedState).length === 0) {
          checkedState = { All: true };
        }
      }
      
      updateVisuals();
    });
  });
  
  updateVisuals();

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
