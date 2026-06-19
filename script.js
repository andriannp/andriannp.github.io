document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // THEME TOGGLE (LIGHT / DARK MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve theme from localStorage or fallback to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  htmlElement.setAttribute('data-theme', defaultTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  window.closeMobileNav = () => {
    menuToggle.classList.remove('open');
    mobileNav.classList.remove('open');
  };

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Close mobile nav on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeMobileNav();
    }
  });

  // ==========================================================================
  // EDUCATION & CERTIFICATIONS TAB SWITCHER
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Update active tab buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update active tab contents
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
      
      // Re-trigger scroll reveal if needed
      handleScrollReveal();
    });
  });

  // ==========================================================================
  // CERTIFICATIONS FILTER & SEARCH
  // ==========================================================================
  const certSearchInput = document.getElementById('cert-search');
  const certFilterSelect = document.getElementById('cert-filter');
  const certCards = document.querySelectorAll('.cert-card');

  function filterCertifications() {
    const searchQuery = certSearchInput.value.toLowerCase().trim();
    const filterCategory = certFilterSelect.value;

    certCards.forEach(card => {
      const title = card.querySelector('.cert-title').textContent.toLowerCase();
      const issuer = card.querySelector('.cert-issuer').textContent.toLowerCase();
      const keywords = card.getAttribute('data-keywords').toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = title.includes(searchQuery) || issuer.includes(searchQuery) || keywords.includes(searchQuery);
      const matchesFilter = filterCategory === 'all' || category === filterCategory;

      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  certSearchInput.addEventListener('input', filterCertifications);
  certFilterSelect.addEventListener('change', filterCertifications);

  // ==========================================================================
  // DYNAMIC ACCORDION FUNCTIONALITY (TASK FORCE & TRAININGS)
  // ==========================================================================
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all accordion items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
      });

      // If clicked item was not open, open it
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Scroll the accordion header into view smoothly
        setTimeout(() => {
          trigger.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });

  // ACCORDION SEARCH FILTERS
  const setupAccordionSearch = (searchInputId, listId) => {
    const searchInput = document.getElementById(searchInputId);
    const list = document.getElementById(listId);
    const listItems = list.querySelectorAll('.acc-list-item');
    const accordionContent = list.closest('.accordion-content');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();

      listItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Recalculate max-height of parent accordion container to prevent cutoffs
      const activeAccordion = list.closest('.accordion-item');
      if (activeAccordion.classList.contains('active')) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
      }
    });
  };

  setupAccordionSearch('search-taskforce', 'list-taskforce');
  setupAccordionSearch('search-training', 'list-training');
  setupAccordionSearch('search-org', 'list-org');

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const handleScrollReveal = () => {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;

      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });
  };

  // Run on page load and scroll
  window.addEventListener('scroll', handleScrollReveal);
  handleScrollReveal(); // Trigger once on initialization

  // ==========================================================================
  // ACTIVE NAVIGATION LINK HIGHLIGHTING & SMOOTH SCROLL
  // ==========================================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const highlightNav = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Special fallback for top of the page
    if (window.scrollY < 50) {
      currentSectionId = 'home';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      // match href anchor
      const href = link.getAttribute('href');
      if (href === '#' && currentSectionId === 'home') {
        link.classList.add('active');
      } else if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Run on init
});
