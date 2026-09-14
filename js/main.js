document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BODY LOAD
    ====================================================== */

    window.setTimeout(() => {
        document.body.classList.add("loaded");
    }, 100);


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const navbar = document.querySelector(".navbar");
    const progressBar = document.querySelector(".scroll-progress span");
    const backTop = document.querySelector(".back-top");

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    const mobileMenu = document.querySelector(".mobile-menu");
    const nav = document.querySelector(".nav-links");


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    if (mobileMenu && nav) {

        mobileMenu.addEventListener("click", () => {

            mobileMenu.classList.toggle("open");
            nav.classList.toggle("open");

        });


        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("open");
                nav.classList.remove("open");

            });

        });

    }


    /* =====================================================
       SCROLL PROGRESS
    ====================================================== */

    function updateScrollProgress() {

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

    }


    /* =====================================================
       NAVBAR
    ====================================================== */

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }


    /* =====================================================
       BACK TO TOP
    ====================================================== */

    function updateBackTop() {

        if (!backTop) return;

        if (window.scrollY > window.innerHeight * 0.7) {
            backTop.classList.add("visible");
        } else {
            backTop.classList.remove("visible");
        }

    }


    if (backTop) {

        backTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const id = entry.target.getAttribute("id");

                navLinks.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") === `#${id}`
                    ) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            threshold: 0.35
        }
    );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });


    /* =====================================================
       SAFE SCROLL REVEAL
       
       IMPORTANT:
       We only hide elements AFTER JS is ready.
       If JS breaks, website content remains visible.
    ====================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-card, .reveal-image"
    );


    function isInViewport(element) {

        const rect = element.getBoundingClientRect();

        return (
            rect.top <
            window.innerHeight * 0.92
        );

    }


    revealElements.forEach(element => {

        if (!isInViewport(element)) {

            element.classList.add("will-animate");

        }

    });


    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const element = entry.target;

                const delay =
                    element.dataset.delay;

                if (delay) {

                    element.style.transitionDelay =
                        `${delay}ms`;

                }

                element.classList.add("active");

                element.classList.remove("will-animate");

                revealObserver.unobserve(element);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -70px 0px"
        }
    );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =====================================================
       PHOTO ERROR / PLACEHOLDER SYSTEM
    ====================================================== */

    const photoSlots =
        document.querySelectorAll(".photo-slot");


    photoSlots.forEach(slot => {

        const image =
            slot.querySelector("img");

        const placeholder =
            slot.querySelector(".photo-placeholder");


        if (!image) {

            slot.classList.add("missing-image");

            return;

        }


        function imageLoaded() {

            if (image.naturalWidth > 0) {

                slot.classList.add("has-image");

                if (placeholder) {
                    placeholder.style.opacity = "0";
                }

            }

        }


        image.addEventListener(
            "load",
            imageLoaded
        );


        image.addEventListener(
            "error",
            () => {

                slot.classList.remove("has-image");

                image.style.display = "none";

                if (placeholder) {

                    placeholder.style.opacity = "1";

                }

            }
        );


        if (image.complete) {

            if (image.naturalWidth > 0) {

                imageLoaded();

            } else {

                image.dispatchEvent(
                    new Event("error")
                );

            }

        }

    });


    /* =====================================================
       PARALLAX
    ====================================================== */

    const parallaxElements =
        document.querySelectorAll("[data-parallax]");


    let ticking = false;


    function updateParallax() {

        const scrollY = window.scrollY;

        parallaxElements.forEach(element => {

            const speed =
                parseFloat(
                    element.dataset.parallax
                ) || 0.04;

            const rect =
                element.getBoundingClientRect();

            const center =
                rect.top +
                rect.height / 2;

            const viewportCenter =
                window.innerHeight / 2;

            const distance =
                center - viewportCenter;

            const movement =
                distance * speed;

            element.style.transform =
                `translate3d(0, ${movement}px, 0) scale(1.06)`;

        });

        ticking = false;

    }


    function requestParallax() {

        if (!ticking) {

            window.requestAnimationFrame(
                updateParallax
            );

            ticking = true;

        }

    }


    /* =====================================================
       SCROLL EVENT
    ====================================================== */

    window.addEventListener(
        "scroll",
        () => {

            updateScrollProgress();
            updateNavbar();
            updateBackTop();
            requestParallax();

        },
        {
            passive: true
        }
    );


    updateScrollProgress();
    updateNavbar();
    updateBackTop();


    /* =====================================================
       CURSOR
    ====================================================== */

    const cursorRing =
        document.querySelector(".cursor-ring");

    const cursorDot =
        document.querySelector(".cursor-dot");


    if (
        cursorRing &&
        cursorDot &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let ringX = mouseX;
        let ringY = mouseY;


        document.addEventListener(
            "mousemove",
            event => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                cursorDot.style.left =
                    `${mouseX}px`;

                cursorDot.style.top =
                    `${mouseY}px`;

            }
        );


        function animateCursor() {

            ringX +=
                (mouseX - ringX) * 0.16;

            ringY +=
                (mouseY - ringY) * 0.16;

            cursorRing.style.left =
                `${ringX}px`;

            cursorRing.style.top =
                `${ringY}px`;

            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();


        const interactive =
            document.querySelectorAll(
                "a, button, .skill-card, .experience-item, .project-card, .photo-slot"
            );


        interactive.forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorRing.classList.add(
                        "hover"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursorRing.classList.remove(
                        "hover"
                    );

                }
            );

        });

    }


    /* =====================================================
       MAGNETIC BUTTON
    ====================================================== */

    const magneticElements =
        document.querySelectorAll(
            ".magnetic"
        );


    magneticElements.forEach(element => {

        element.addEventListener(
            "mousemove",
            event => {

                if (
                    !window.matchMedia(
                        "(pointer: fine)"
                    ).matches
                ) return;


                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                element.style.transform =
                    `translate(${x * 0.15}px, ${y * 0.15}px)`;

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                element.style.transform = "";

            }
        );

    });


    /* =====================================================
       3D PROJECT TILT
    ====================================================== */

    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    projectCards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    !window.matchMedia(
                        "(pointer: fine)"
                    ).matches
                ) return;


                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const rotateX =
                    ((y / rect.height) - 0.5) * -2.5;

                const rotateY =
                    ((x / rect.width) - 0.5) * 2.5;


                card.style.transform =
                    `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });


    /* =====================================================
       EXPERIENCE POINTER EFFECT
       
       Tidak ada click.
       CSS :hover sudah mengurus warna ungu.
       JS ini hanya memberi efek tambahan.
    ====================================================== */

    const experienceItems =
        document.querySelectorAll(
            ".experience-item"
        );


    experienceItems.forEach(item => {

        item.addEventListener(
            "mousemove",
            event => {

                const rect =
                    item.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) *
                    100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) *
                    100;


                item.style.setProperty(
                    "--mouse-x",
                    `${x}%`
                );

                item.style.setProperty(
                    "--mouse-y",
                    `${y}%`
                );

            }
        );

    });


    /* =====================================================
       HERO MOUSE PARALLAX
    ====================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");


    if (heroVisual) {

        heroVisual.addEventListener(
            "mousemove",
            event => {

                if (
                    !window.matchMedia(
                        "(pointer: fine)"
                    ).matches
                ) return;


                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                const visual =
                    heroVisual.querySelector(
                        ".hero-photo-wrap"
                    );


                if (visual) {

                    visual.style.transform =
                        `translate(${x * 0.018}px, ${y * 0.018}px) rotate(${x * 0.008}deg)`;

                }

            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                const visual =
                    heroVisual.querySelector(
                        ".hero-photo-wrap"
                    );

                if (visual) {

                    visual.style.transform =
                        "";

                }

            }
        );

    }


    /* =====================================================
       NAVIGATION CLICK — SMOOTH CINEMATIC FEEL
    ====================================================== */

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    !targetId.startsWith("#")
                ) return;


                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) return;


                event.preventDefault();


                const offset =
                    navbar
                        ? navbar.offsetHeight + 35
                        : 100;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =====================================================
       SECTION ENTER "WOAH" EFFECT
       
       Memberikan sedikit depth pada section
       ketika section mulai masuk viewport.
    ====================================================== */

    const cinematicSections =
        document.querySelectorAll(
            ".section"
        );


    const cinematicObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    entry.target.classList.add(
                        "section-visible"
                    );

                });

            },
            {
                threshold: 0.18
            }
        );


    cinematicSections.forEach(section => {

        cinematicObserver.observe(section);

    });


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                if (mobileMenu) {
                    mobileMenu.classList.remove(
                        "open"
                    );
                }

                if (nav) {
                    nav.classList.remove(
                        "open"
                    );
                }

            }

        }
    );

});