/* =========================================================
   CAMPUSFIX - PROFILE JAVASCRIPT
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeLogout();
    initializeSidebarLinks();
    loadUserProfile();

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


/* ===================== LOAD USER PROFILE ===================== */

async function loadUserProfile() {

    try {

        const response = await fetch(
            "https://campusfix-obdm.onrender.com/api/users/1"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load user profile"
            );

        }


        const user =
            await response.json();


        console.log(
            "User profile:",
            user
        );


        // Main profile name

        const profileName =
            document.getElementById("profileName");

        if (profileName) {

            profileName.textContent =
                user.name;

        }


        // Full name

        const profileFullName =
            document.getElementById(
                "profileFullName"
            );

        if (profileFullName) {

            profileFullName.textContent =
                user.name;

        }


        // Email

        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        if (profileEmail) {

            profileEmail.textContent =
                user.email;

        }


        // Topbar name

        const topProfileName =
            document.getElementById(
                "topProfileName"
            );

        if (topProfileName) {

            topProfileName.textContent =
                user.name;

        }


        // Topbar role

        const topProfileRole =
            document.getElementById(
                "topProfileRole"
            );

        if (topProfileRole) {

            topProfileRole.textContent =
                user.role;

        }


        // Profile avatars

        document
            .querySelectorAll(
                ".profile-avatar, .profile-large-avatar"
            )
            .forEach(function (avatar) {

                avatar.textContent =
                    user.name
                        .charAt(0)
                        .toUpperCase();

            });
            /* =====================
   LOAD COMPLAINT STATS
===================== */

const complaintsResponse =
    await fetch(
        "https://campusfix-obdm.onrender.com/api/complaints/all"
    );

if (!complaintsResponse.ok) {
    throw new Error(
        "Failed to load complaint statistics"
    );
}

const complaints =
    await complaintsResponse.json();


const total =
    complaints.length;

const pending =
    complaints.filter(function (complaint) {
        return complaint.status === "Pending";
    }).length;

const progress =
    complaints.filter(function (complaint) {
        return complaint.status === "In Progress";
    }).length;

const resolved =
    complaints.filter(function (complaint) {
        return complaint.status === "Resolved";
    }).length;


/* =====================
   UPDATE STATISTICS
===================== */

const statistics =
    document.querySelectorAll(
        ".profile-stat strong"
    );

if (statistics.length >= 4) {

    statistics[0].textContent = total;
    statistics[1].textContent = pending;
    statistics[2].textContent = progress;
    statistics[3].textContent = resolved;

}


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


/* ===================== LOGOUT ===================== */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            window.location.href =
                "login.html";

        }
    );

}
