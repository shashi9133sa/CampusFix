
/* =========================================================
   CAMPUSFIX - PROFILE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeLogout();
    initializeSidebarLinks();

    console.log("👤 CampusFix Profile loaded successfully!");

});


/* ===================== MOBILE SIDEBAR ===================== */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        const icon =
            menuButton.querySelector("i");


        if (!icon) {
            return;
        }


        if (sidebar.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* ===================== SIDEBAR LINKS ===================== */

function initializeSidebarLinks() {

    const links =
        document.querySelectorAll(".nav-link");


    links.forEach(function (link) {

        link.addEventListener("click", function () {

            const sidebar =
                document.getElementById("sidebar");


            if (sidebar) {

                sidebar.classList.remove("open");

            }

        });

    });

}


/* ===================== LOGOUT ===================== */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener("click", function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        /*
         * TEMPORARY LOGOUT
         *
         * Backend authentication will replace
         * this later.
         */

        window.location.href = "login.html";

    });

}

