document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const accordionImages = document.querySelectorAll('.accordion-image-wrapper img');

  // Accordion content animates max-height to its measured height instead of
  // a fixed CSS value, so opening and closing items move in sync.
  function expandContent(item, content) {
    // Measure the final open height with transitions off, then revert before
    // animating. Nothing paints in between, so the transition runs from the
    // closed state to an exact target with no snap at the end.
    content.style.transition = 'none';
    content.style.maxHeight = 'none';
    item.classList.add('is-open');
    const style = getComputedStyle(content);
    let target = content.scrollHeight;
    if (style.boxSizing !== 'border-box') {
      target -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    }
    item.classList.remove('is-open');
    content.style.maxHeight = '0px';
    void content.offsetHeight;
    content.style.transition = '';

    item.classList.add('is-open');
    content.style.maxHeight = target + 'px';
    content.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'max-height') return;
      content.removeEventListener('transitionend', onEnd);
      // Let the content reflow freely once open (e.g. on window resize)
      if (item.classList.contains('is-open')) {
        content.style.maxHeight = 'none';
      }
    });
  }

  function collapseContent(content) {
    // Pin the current height, force a reflow, then transition down to 0
    content.style.maxHeight = content.scrollHeight + 'px';
    void content.offsetHeight;
    content.style.maxHeight = '0px';
  }

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const currentItem = this.closest('.accordion-item');
      const wasOpen = currentItem.classList.contains('is-open');
      const itemIndex = Array.from(document.querySelectorAll('.accordion-item')).indexOf(currentItem);
      
      // First, close all accordion items and images
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item.classList.contains('is-open')) {
          collapseContent(item.querySelector('.accordion-content'));
        }
        item.classList.remove('is-open');
      });
      accordionImages.forEach(img => {
        img.classList.remove('is-open');
      });

      // If the clicked item wasn't already open, open it and corresponding image
      if (!wasOpen) {
        expandContent(currentItem, currentItem.querySelector('.accordion-content'));
        if (accordionImages[itemIndex]) {
          accordionImages[itemIndex].classList.add('is-open');
        }
      } else {
        // If all accordions are closed and there are images, show first image
        const hasOpenAccordion = document.querySelector('.accordion-item.is-open');
        if (!hasOpenAccordion && accordionImages.length > 0) {
          accordionImages[0].classList.add('is-open');
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
        const rolesData = item.getAttribute('data-role');
        const roles = rolesData ? rolesData.split(';').map(r => r.trim()) : [];
        item.style.display = roles.includes(selectedRole) ? 'block' : 'none';
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

  /**
   * Custom About Nav Toggle functionality
   */
  const aboutLink = document.getElementById('about-link');

  if (aboutLink) {
    aboutLink.addEventListener('click', function(e) {
      // 991px is the standard Webflow tablet/desktop boundary. 
      // Adjust this number if your mobile nav breaks at a different point.
      if (window.innerWidth > 991) {
        e.stopPropagation();  // Stops Webflow from seeing the click (prevents dropdown toggle)
        window.location.href = '/about';
      }
    });
  }
});
