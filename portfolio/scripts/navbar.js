// Navbar scroll behavior and active state tracking
const header = document.querySelector('header');
const navbarHeight = header.offsetHeight;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

let didScroll = false;
let lastScrollTop = 0;
const delta = 5;

// Set home as active on page load
window.addEventListener('load', () => {
  navLinks[0].classList.add('active');
});

// Combined scroll handler
window.addEventListener(
  'scroll',
  () => {
    didScroll = true;
  },
  { passive: true },
);

// Process scroll changes at intervals
setInterval(() => {
  if (didScroll) {
    handleNavbarVisibility();
    updateActiveSection();
    didScroll = false;
  }
}, 250);

// Hide/show navbar based on scroll direction
function handleNavbarVisibility() {
  const st = window.pageYOffset;

  if (Math.abs(lastScrollTop - st) <= delta) return;

  if (st > lastScrollTop && st > navbarHeight) {
    // Scrolling down
    header.classList.remove('nav-down');
    header.classList.add('nav-up');
  } else {
    // Scrolling up
    if (st + window.innerHeight < document.documentElement.scrollHeight) {
      header.classList.remove('nav-up');
      header.classList.add('nav-down');
    }
  }

  lastScrollTop = st;
}

// Update active navigation link based on current section
function updateActiveSection() {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    // Check if section is in viewport (with offset for header)
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Update active state on navigation click
navLinks.forEach((link) => {
  link.addEventListener('click', function () {
    navLinks.forEach((l) => l.classList.remove('active'));
    this.classList.add('active');
  });
});
