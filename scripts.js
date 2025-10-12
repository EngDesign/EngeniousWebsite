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
  
  console.log('Found checkboxes:', checkboxes.length);
  console.log('Found team items:', teamItems.length);
  
  checkboxes.forEach(checkbox => {
    console.log('Adding listener to:', checkbox.id);
    checkbox.addEventListener('change', function(e) {
      console.log('Checkbox changed:', this.id, 'checked:', this.checked);
      
      if (this.id === 'All') {
        if (!this.checked) {
          console.log('Preventing All from being unchecked');
          e.preventDefault();
          this.checked = true;
          return;
        }
        console.log('All checked - unchecking others');
        setTimeout(() => {
          checkboxes.forEach(cb => {
            if (cb !== this && cb.checked) {
              console.log('Clicking to uncheck:', cb.id);
              cb.click();
            }
          });
        }, 0);
        teamItems.forEach(item => item.style.display = 'block');
      } else {
        console.log('Other checkbox changed');
        const allCheckbox = document.getElementById('All');
        if (allCheckbox && allCheckbox.checked) {
          console.log('Clicking to uncheck All');
          setTimeout(() => allCheckbox.click(), 0);
        }
        
        setTimeout(() => {
          const checkedRoles = Array.from(checkboxes)
            .filter(cb => cb.checked && cb.id !== 'All')
            .map(cb => cb.id.replace('-', ' '));
          
          console.log('Checked roles:', checkedRoles);
          
          if (checkedRoles.length === 0) {
            console.log('No roles checked - checking All');
            allCheckbox.click();
            return;
          }
          
          teamItems.forEach(item => {
            const role = item.getAttribute('data-role');
            const shouldShow = checkedRoles.includes(role);
            item.style.display = shouldShow ? 'block' : 'none';
            console.log('Item role:', role, 'show:', shouldShow);
          });
        }, 0);
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
