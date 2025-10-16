(() => {
    'use strict';

    /** Detect if device prefers reduced motion **/
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;

    /** Detect mobile/tablet **/
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
        );

    /** Check if screen should have parallax disabled **/
    const shouldDisableParallax = () => window.innerWidth <= 1024;

    /** Wait for images to load before initializing **/
    function waitForImages(images) {
        const imgs = Array.from(images || []);
        return Promise.all(
            imgs.map((img) => {
                if (!img) return Promise.resolve();
                if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
                return new Promise((resolve) => {
                    const done = () => {
                        img.removeEventListener('load', done);
                        img.removeEventListener('error', done);
                        resolve();
                    };
                    img.addEventListener('load', done);
                    img.addEventListener('error', done);
                });
            }),
        );
    }

    /** Shortcuts **/
    const $ = (sel) => document.querySelector(sel);

    /** Parallax Elements **/
    const textEl = $('#text');
    const cloudsEl = $('#clouds');
    const fgEl = $('#foreground_trees');
    const bgEl = $('#background_trees');
    const parallaxRoot = $('#home');

    if (!textEl || !cloudsEl || !fgEl || !bgEl || !parallaxRoot) {
        console.warn('Parallax initialization skipped: missing elements.');
        return;
    }

    let fgClone = null;
    let bgClone = null;
    let fgWidth = 0;
    let bgWidth = 0;
    let ticking = false;
    let parallaxEnabled = true;

    // Parallax intensity for large screens (> 1024px)
    const parallaxMultipliers = {
        text: 1.5,
        clouds: 0.35,
        foreground: 1,
        background: 2.5,
    };

    /** Initialize after images load **/
    async function initParallax() {
        const imgs = parallaxRoot.querySelectorAll('img');
        await waitForImages(imgs);

        // Disable parallax if user prefers reduced motion
        if (prefersReducedMotion) {
            disableParallax();
            return;
        }

        // Check if parallax should be enabled based on screen size
        if (shouldDisableParallax()) {
            disableParallax();
        } else {
            enableParallax();
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);
    }

    /** Disable parallax completely (for screens <= 1024px) **/
    function disableParallax() {
        parallaxEnabled = false;

        // Remove inline transforms to let CSS media queries control positioning
        textEl.style.transform = '';
        cloudsEl.style.transform = '';
        fgEl.style.transform = '';
        bgEl.style.transform = '';

        // Remove clones if they exist
        if (fgClone && fgClone.parentNode) {
            fgClone.remove();
            fgClone = null;
        }
        if (bgClone && bgClone.parentNode) {
            bgClone.remove();
            bgClone = null;
        }
    }

    /** Enable parallax (for screens > 1024px) **/
    function enableParallax() {
        parallaxEnabled = true;
        createClones();
        measureWidths();
        updateParallax(true);
    }

    /** Clone parallax layers for seamless wrap **/
    function createClones() {
        if (!$('#foreground_trees_clone')) {
            fgClone = fgEl.cloneNode(true);
            fgClone.id = 'foreground_trees_clone';
            fgEl.after(fgClone);
        } else {
            fgClone = $('#foreground_trees_clone');
        }

        if (!$('#background_trees_clone')) {
            bgClone = bgEl.cloneNode(true);
            bgClone.id = 'background_trees_clone';
            bgEl.after(bgClone);
        } else {
            bgClone = $('#background_trees_clone');
        }

        [textEl, cloudsEl, fgEl, fgClone, bgEl, bgClone].forEach((el) => {
            if (!el) return;
            el.style.willChange = 'transform';
            el.style.pointerEvents = 'none';
            el.style.transform = 'translate3d(0,0,0)';
        });
    }

    /** Measure widths (used for wrapping) **/
    function measureWidths() {
        fgWidth = Math.round(fgEl.getBoundingClientRect().width) || 0;
        bgWidth = Math.round(bgEl.getBoundingClientRect().width) || 0;

        // fallback if not measurable yet
        if (fgWidth === 0) fgWidth = window.innerWidth || 1024;
        if (bgWidth === 0) bgWidth = window.innerWidth || 1024;
    }

    /** Scroll handler using RAF **/
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    /** Parallax update logic **/
    function updateParallax(firstPaint = false) {
        const scrollY = window.scrollY || 0;

        // Always animate text on all screen sizes
        textEl.style.transform = `translate3d(0, ${scrollY * parallaxMultipliers.text}px, 0)`;

        // Only animate layers on large screens (> 1024px)
        if (parallaxEnabled) {
            if ((fgWidth === 0 || bgWidth === 0) && !firstPaint) measureWidths();

            cloudsEl.style.transform = `translate3d(${scrollY * parallaxMultipliers.clouds}px, 0, 0)`;

            // Animate trees with clones
            if (fgClone && bgClone) {
                const fgOffset = scrollY * parallaxMultipliers.foreground;
                const fgMod = modWrap(fgOffset, fgWidth);
                fgEl.style.transform = `translate3d(${fgMod}px, 0, 0)`;
                fgClone.style.transform = `translate3d(${fgMod - fgWidth}px, 0, 0)`;

                const bgOffset = scrollY * parallaxMultipliers.background;
                const bgMod = modWrap(bgOffset, bgWidth);
                bgEl.style.transform = `translate3d(${bgMod}px, 0, 0)`;
                bgClone.style.transform = `translate3d(${bgMod - bgWidth}px, 0, 0)`;
            }
        }
    }

    /** Safe modulo wrap **/
    function modWrap(offset, width) {
        if (width === 0) return 0;
        const r = offset % width;
        return r < 0 ? r + width : r;
    }

    /** Re-measure and repaint on resize **/
    let resizeTimeout = null;
    function onResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (shouldDisableParallax()) {
                if (parallaxEnabled) {
                    disableParallax();
                }
            } else {
                if (!parallaxEnabled) {
                    enableParallax();
                }
                measureWidths();
                updateParallax(true);
            }
        }, 100);
    }

    /** Handle tab visibility changes **/
    function onVisibilityChange() {
        if (!document.hidden && parallaxEnabled) {
            setTimeout(() => {
                measureWidths();
                updateParallax(true);
            }, 50);
        }
    }

    /** Kickoff **/
    window.addEventListener('load', initParallax);
})();