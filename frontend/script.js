
/* =========================================================
   CAMPUSFIX - JAVASCRIPT
   ========================================================= */


/* ===================== PAGE LOAD ===================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("🚀 CampusFix loaded successfully!");

    initializeNavigation();
    initializeScrollAnimations();
    initializeDashboardAnimation();
    initializeButtonEffects();
    initializeCounters();
    initializeActiveNavigation();

});


/* ===================== NAVIGATION ===================== */

function initializeNavigation() {

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}


/* ===================== NAVBAR SCROLL EFFECT ===================== */

function initializeNavbar() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        return;
    }

    window.addEventListener("scroll", function () {

        if (window.scrollY > 50) {

            navbar.classList.add("navbar-scrolled");

        } else {

            navbar.classList.remove("navbar-scrolled");

        }

    });

}


/* ===================== SCROLL ANIMATIONS ===================== */

function initializeScrollAnimations() {

    const animatedElements = document.querySelectorAll(
        ".step-card, .feature-card, .about-content, .about-card, .cta-container"
    );

    if (animatedElements.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show-element");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    animatedElements.forEach(function (element) {

        element.classList.add("animate-element");

        observer.observe(element);

    });

}


/* ===================== DASHBOARD ANIMATION ===================== */

function initializeDashboardAnimation() {

    const dashboard = document.querySelector(".dashboard-window");

    if (!dashboard) {
        return;
    }


    dashboard.addEventListener("mousemove", function (event) {

        const rect = dashboard.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 2;
        const rotateX = ((centerY - y) / centerY) * 2;

        dashboard.style.transform =
            "perspective(1200px) " +
            "rotateY(" + rotateY + "deg) " +
            "rotateX(" + rotateX + "deg)";

    });


    dashboard.addEventListener("mouseleave", function () {

        dashboard.style.transform =
            "perspective(1200px) rotateY(-3deg) rotateX(2deg)";

    });

}


/* ===================== BUTTON EFFECTS ===================== */

function initializeButtonEffects() {

    const buttons = document.querySelectorAll(
        ".primary-btn, .secondary-btn, .signup-btn"
    );

    buttons.forEach(function (button) {

        button.addEventListener("mousedown", function () {

            button.style.transform = "scale(0.97)";

        });


        button.addEventListener("mouseup", function () {

            button.style.transform = "";

        });


        button.addEventListener("mouseleave", function () {

            button.style.transform = "";

        });

    });

}


/* ===================== NUMBER COUNTER ===================== */

function animateCounter(element, target, duration) {

    let start = 0;

    const startTime = performance.now();


    function updateCounter(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(
            progress * target
        );

        element.textContent = currentValue;


        if (progress < 1) {

            requestAnimationFrame(updateCounter);

        } else {

            element.textContent = target;

        }

    }


    requestAnimationFrame(updateCounter);

}


/* ===================== DASHBOARD COUNTERS ===================== */

function initializeCounters() {

    const counters = document.querySelectorAll(
        ".stat-card strong, .about-stat strong"
    );

    if (counters.length === 0) {
        return;
    }


    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) {
                    return;
                }

                const element = entry.target;

                const originalText = element.textContent;

                const number = parseInt(
                    originalText.replace(/\D/g, ""),
                    10
                );


                if (!isNaN(number)) {

                    element.textContent = "0";

                    animateCounter(
                        element,
                        number,
                        1200
                    );

                }


                observer.unobserve(element);

            });

        },
        {
            threshold: 0.5
        }
    );


    counters.forEach(function (counter) {

        observer.observe(counter);

    });

}


/* ===================== ACTIVE NAVIGATION ===================== */

function initializeActiveNavigation() {

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const links = document.querySelectorAll(
        ".nav-links a"
    );


    if (sections.length === 0 || links.length === 0) {
        return;
    }


    function updateActiveLink() {

        let currentSection = "";


        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 180;

            const sectionBottom =
                sectionTop + section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        links.forEach(function (link) {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveLink
    );

    updateActiveLink();

}


/* ===================== START NAVBAR ===================== */

initializeNavbar();

// =========================================
// PAGE LOADER
// =========================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("pageLoader");

    if (loader) {

        setTimeout(() => {
            loader.classList.add("hide");
        }, 500);

    }

});
