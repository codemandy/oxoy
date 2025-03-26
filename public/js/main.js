document.addEventListener('DOMContentLoaded', function() {
  // Lightbox functionality
  const images = document.querySelectorAll('.work-image');
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  images.forEach(image => {
    image.addEventListener('click', () => {
      lightboxContent.src = image.src;
      lightboxContent.alt = image.alt;
      lightbox.classList.add('active');
    });
  });
  
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
  
  // Thumbnail functionality
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      const targetId = thumbnail.getAttribute('data-target');
      const mainImage = document.getElementById(targetId);
      
      mainImage.src = thumbnail.src;
      mainImage.alt = thumbnail.alt.replace(' thumbnail', '');
      
      const siblings = thumbnail.parentElement.querySelectorAll('.thumbnail');
      siblings.forEach(sib => sib.classList.remove('active'));
      thumbnail.classList.add('active');
    });
  });
  
  // Simple navigation - show only the clicked work
  const navLinks = document.querySelectorAll('.secondary-nav a');
  const works = document.querySelectorAll('.work');
  const dividers = document.querySelectorAll('.divider');
  const logoLink = document.querySelector('.logo a');
  const worksLink = document.querySelector('.nav-links a[href="/works"]');
  
  // Function to show all works with transition
  function showAllWorks() {
    // First make all works visible but with opacity 0
    works.forEach(work => {
      work.style.display = 'grid';
      work.classList.add('hidden');
    });
    
    dividers.forEach(divider => {
      divider.style.display = 'block';
      divider.classList.add('hidden');
    });
    
    // Force a reflow to ensure the transition works
    document.body.offsetHeight;
    
    // Then remove the hidden class to trigger the transition
    setTimeout(() => {
      works.forEach(work => {
        work.classList.remove('hidden');
      });
      
      dividers.forEach(divider => {
        divider.classList.remove('hidden');
      });
    }, 50);
  }
  
  // Function to hide works with transition
  function hideWorks() {
    works.forEach(work => {
      work.classList.add('hidden');
    });
    
    dividers.forEach(divider => {
      divider.classList.add('hidden');
    });
    
    // Wait for transition to complete before changing display property
    setTimeout(() => {
      works.forEach(work => {
        work.style.display = 'none';
      });
      
      dividers.forEach(divider => {
        divider.style.display = 'none';
      });
    }, 500); // Match this to the transition duration in CSS
  }
  
  // Initially show all works
  showAllWorks();
  
  // Make logo link show all works
  logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    hideWorks();
    setTimeout(() => {
      showAllWorks();
    }, 500); // Match this to the transition duration in CSS
    history.pushState(null, null, '/');
  });
  
  // Make "works" link show all works
  if (worksLink) {
    worksLink.addEventListener('click', function(e) {
      e.preventDefault();
      hideWorks();
      setTimeout(() => {
        showAllWorks();
      }, 500); // Match this to the transition duration in CSS
      history.pushState(null, null, '/works');
    });
  }
  
  // Add click handlers to secondary navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      console.log('Link clicked:', href);
      
      // If homepage link, show all works
      if (href === '#' || href === '/' || href === '') {
        hideWorks();
        setTimeout(() => {
          showAllWorks();
        }, 500); // Match this to the transition duration in CSS
        return;
      }
      
      // Hide all works first with transition
      hideWorks();
      
      setTimeout(() => {
        // After transition completes, determine which work to show
        const linkText = this.querySelector('span').textContent.toLowerCase();
        console.log('Looking for work matching:', linkText);
        
        let foundMatch = false;
        
        works.forEach(work => {
          const workTitle = work.querySelector('.work-title').textContent.toLowerCase();
          console.log('Checking work:', workTitle);
          
          // More flexible matching
          if (workTitle.includes(linkText.replace('.org', '').replace('.com', '').replace('.site', '').replace('.day', '')) || 
              linkText.includes(workTitle) ||
              href.toLowerCase().includes(workTitle.toLowerCase()) ||
              workTitle.toLowerCase().includes(href.replace('/', '').toLowerCase())) {
            work.style.display = 'grid';
            work.classList.add('hidden');
            foundMatch = true;
            console.log('Match found!');
            
            // Force a reflow
            document.body.offsetHeight;
            
            // Remove hidden class to trigger transition
            setTimeout(() => {
              work.classList.remove('hidden');
            }, 50);
          }
        });
        
        // If no match found, try a more lenient approach
        if (!foundMatch) {
          console.log('No match found, trying more lenient matching');
          works.forEach(work => {
            const workTitle = work.querySelector('.work-title').textContent.toLowerCase();
            const hrefParts = href.replace('/', '').toLowerCase().split('-');
            const titleParts = workTitle.toLowerCase().split(' ');
            
            // Check if any part of the href matches any part of the title
            const hasMatch = hrefParts.some(part => 
              titleParts.some(titlePart => 
                titlePart.includes(part) || part.includes(titlePart)
              )
            );
            
            if (hasMatch) {
              work.style.display = 'grid';
              work.classList.add('hidden');
              console.log('Lenient match found!');
              
              // Force a reflow
              document.body.offsetHeight;
              
              // Remove hidden class to trigger transition
              setTimeout(() => {
                work.classList.remove('hidden');
              }, 50);
            }
          });
        }
        
        // Update URL without page reload
        history.pushState(null, null, href);
      }, 500); // Match this to the transition duration in CSS
    });
  });
  
  // Check URL on page load
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '' && currentPath !== '/works') {
    const matchingLink = Array.from(navLinks).find(link => 
      link.getAttribute('href') === currentPath
    );
    
    if (matchingLink) {
      matchingLink.click();
    }
  }
}); 
