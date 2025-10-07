// Replace jQuery scroll handler with vanilla JS
let didScroll = false;
let lastScrollTop = 0;
const delta = 5;
const header = document.querySelector('header');
const navbarHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
  didScroll = true;
});

setInterval(() => {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  const st = window.pageYOffset;

  if(Math.abs(lastScrollTop - st) <= delta) return;

  if (st > lastScrollTop && st > navbarHeight){
    header.classList.remove('nav-down');
    header.classList.add('nav-up');
  } else {
    if(st + window.innerHeight < document.documentElement.scrollHeight) {
      header.classList.remove('nav-up');
      header.classList.add('nav-down');
    }
  }

  lastScrollTop = st;
}


// Parallax Effect
let text = document.getElementById('text');
let clouds = document.getElementById('clouds');
let foreground_trees = document.getElementById('foreground_trees');
let background_trees = document.getElementById('background_trees');

// Clone the layers for infinite scrolling
let foreground_clone = foreground_trees.cloneNode(true);
let background_clone = background_trees.cloneNode(true);

foreground_clone.id = 'foreground_trees_clone';
background_clone.id = 'background_trees_clone';

// Insert clones right after their originals to maintain z-index order
foreground_trees.parentNode.insertBefore(foreground_clone, foreground_trees.nextSibling);
background_trees.parentNode.insertBefore(background_clone, background_trees.nextSibling);

// Variables to hold actual element widths
let foregroundWidth = 0;
let backgroundWidth = 0;

// Wait for images to load so we can get accurate widths
window.addEventListener('load', () => {
  foregroundWidth = foreground_trees.offsetWidth;
  backgroundWidth = background_trees.offsetWidth;
});

// Optimized scroll handler with requestAnimationFrame
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

function updateParallax() {
  let value = window.scrollY;

  text.style.marginTop = value * 2 + 'px';
  clouds.style.left = value * 0.35 + 'px';

  // Foreground trees with wrapping using actual width
  let foregroundOffset = value * 1;
  let foregroundMod = foregroundOffset % foregroundWidth;
  foreground_trees.style.left = foregroundMod + 'px';
  foreground_clone.style.left = (foregroundMod - foregroundWidth) + 'px';

  // Background trees with wrapping using actual width
  let backgroundOffset = value * 2.5;
  let backgroundMod = backgroundOffset % backgroundWidth;
  background_trees.style.left = backgroundMod + 'px';
  background_clone.style.left = (backgroundMod - backgroundWidth) + 'px';
}


// Active navigation state tracking
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

// Set home as active on page load
window.addEventListener('load', () => {
  navLinks[0].classList.add('active');
});

// Update active state on scroll
window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    // Check if section is in viewport (with offset for header)
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Also update on click
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});