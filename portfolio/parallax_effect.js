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
    const isSmallScreen = () => window.innerWidth <= 768;

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

    // Adjust parallax intensity based on screen size
    let parallaxMultipliers = {
        text: 1.5,
        clouds: 0.35,
        foreground: 1,
        background: 2.5,
    };

    /** Initialize after images load **/
    async function initParallax() {
        const imgs = parallaxRoot.querySelectorAll('img');
        await waitForImages(imgs);

        // Disable or reduce parallax on mobile/small screens or if user prefers reduced motion
        if (prefersReducedMotion) {
            disableParallax();
            return;
        }

        // if (isMobile || isSmallScreen()) {
        //     adjustForSmallScreen();
        // }

        createClones();
        measureWidths();
        updateParallax(true);

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);
    }

    /** Disable parallax completely **/
    function disableParallax() {
        parallaxEnabled = false;
        textEl.style.transform = 'translate(50%, -105%)';
        cloudsEl.style.transform = 'none';
        fgEl.style.transform = 'none';
        bgEl.style.transform = 'none';
    }

    /** Adjust parallax intensity for small screens **/
    function adjustForSmallScreen() {
        // Reduce parallax intensity by 50% on small screens
        parallaxMultipliers = {
            text: 0.75, // Reduced from 1.5
            clouds: 0.2, // Reduced from 0.35
            foreground: 0.5, // Reduced from 1
            background: 1.25, // Reduced from 2.5
        };

        // On very small screens, disable cloning for better performance
        if (window.innerWidth <= 475) {
            parallaxMultipliers.foreground = 0;
            parallaxMultipliers.background = 0;
        }
    }

    /** Clone parallax layers for seamless wrap **/
    function createClones() {
        // // Skip cloning on very small screens for performance
        // if (window.innerWidth <= 475) {
        //     return;
        // }

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
        if (!parallaxEnabled) return;

        // Throttle more aggressively on mobile
        const shouldThrottle = isMobile || isSmallScreen();

        if (!ticking || !shouldThrottle) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    // /** Parallax update logic **/
    // function updateParallax(firstPaint = false) {
    //     if (!parallaxEnabled) return;
    //
    //     const scrollY = window.scrollY || 0;
    //
    //     if ((fgWidth === 0 || bgWidth === 0) && !firstPaint) measureWidths();
    //
    //     textEl.style.transform = `translate3d(0, ${scrollY * parallaxMultipliers.text}px, 0)`;
    //     // textEl.style.transform = `translate(-50%, ${scrollY * parallaxMultipliers.text}px)`;
    //     cloudsEl.style.transform = `translate3d(${scrollY * parallaxMultipliers.clouds}px, 0, 0)`;
    //
    //     // Always animate trees if clones exist
    //     if (fgClone && bgClone) {
    //         const fgOffset = scrollY * parallaxMultipliers.foreground;
    //         const fgMod = modWrap(fgOffset, fgWidth);
    //         fgEl.style.transform = `translate3d(${fgMod}px, 0, 0)`;
    //         fgClone.style.transform = `translate3d(${fgMod - fgWidth}px, 0, 0)`;
    //
    //         const bgOffset = scrollY * parallaxMultipliers.background;
    //         const bgMod = modWrap(bgOffset, bgWidth);
    //         bgEl.style.transform = `translate3d(${bgMod}px, 0, 0)`;
    //         bgClone.style.transform = `translate3d(${bgMod - bgWidth}px, 0, 0)`;
    //     }
    //
    //     // Only animate trees if not on very small screens
    //     if (window.innerWidth > 475 && fgClone && bgClone) {
    //         const fgOffset = scrollY * parallaxMultipliers.foreground;
    //         const fgMod = modWrap(fgOffset, fgWidth);
    //         fgEl.style.transform = `translate3d(${fgMod}px, 0, 0)`;
    //         fgClone.style.transform = `translate3d(${fgMod - fgWidth}px, 0, 0)`;
    //
    //         const bgOffset = scrollY * parallaxMultipliers.background;
    //         const bgMod = modWrap(bgOffset, bgWidth);
    //         bgEl.style.transform = `translate3d(${bgMod}px, 0, 0)`;
    //         bgClone.style.transform = `translate3d(${bgMod - bgWidth}px, 0, 0)`;
    //     } else {
    //         // Keep trees static on very small screens
    //         fgEl.style.transform = 'translate3d(0, 0, 0)';
    //         bgEl.style.transform = 'translate3d(0, 0, 0)';
    //     }
    // }

    /** Parallax update logic **/
    function updateParallax(firstPaint = false) {
        if (!parallaxEnabled) return;

        const scrollY = window.scrollY || 0;

        if ((fgWidth === 0 || bgWidth === 0) && !firstPaint) measureWidths();

        // USE THIS ONE (keeps text centered horizontally)
        textEl.style.transform = `translate3d(0, ${scrollY * parallaxMultipliers.text}px, 0)`;
        // textEl.style.transform = `translate(-50%, ${scrollY * parallaxMultipliers.text}px)`;
        cloudsEl.style.transform = `translate3d(${scrollY * parallaxMultipliers.clouds}px, 0, 0)`;

        // Always animate trees if clones exist
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
            // Re-check if we need to adjust for small screen
            if (isSmallScreen()) {
                adjustForSmallScreen();
            } else {
                // Reset to full parallax
                parallaxMultipliers = {
                    text: 1.5,
                    clouds: 0.35,
                    foreground: 1,
                    background: 2.5,
                };
            }

            measureWidths();
            updateParallax(true);
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