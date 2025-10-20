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
  const radios = document.querySelectorAll('.team-checkbox-field input[type="radio"]');
  const teamItems = document.querySelectorAll('.team-collection-item');
  
  // Set All as default
  const allRadio = document.getElementById('All-2');
  if (allRadio) allRadio.checked = true;
  
  function updateVisuals() {
    radios.forEach(radio => {
      const label = radio.closest('.team-checkbox-field');
      
      if (radio.checked) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
    
    const checkedRadio = document.querySelector('.team-checkbox-field input[type="radio"]:checked');
    
    if (!checkedRadio || checkedRadio.id === 'All-2') {
      teamItems.forEach(item => item.style.display = 'block');
    } else {
      const selectedRole = checkedRadio.value;
      teamItems.forEach(item => {
        const role = item.getAttribute('data-role');
        item.style.display = role === selectedRole ? 'block' : 'none';
      });
    }
  }
  
  radios.forEach(radio => {
    radio.addEventListener('change', updateVisuals);
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
      
      setTimeout(() => {
        modal.querySelector('.team-modal-dialog').classList.add('slide-in');
      }, 10);
      
      modal.querySelector('.team-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.team-modal-backdrop').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
      });
    });
  });
  
  function closeModal() {
    if (modal) {
      modal.querySelector('.team-modal-dialog').classList.remove('slide-in');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        modal = null;
      }, 300);
    }
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal) closeModal();
  });
});
