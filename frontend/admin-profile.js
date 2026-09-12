/* =========================================================
   CAMPUSFIX - ADMIN PROFILE
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    loadAdminProfile();
    initializeLogout();

    console.log("👤 CampusFix Admin Profile loaded!");

});


/* ================= MOBILE MENU ================= */

function initializeMobileMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".admin-sidebar");


    if (!mobileMenu || !sidebar) {
        return;
    }


    mobileMenu.addEventListener("click", function () {

        sidebar.classList.toggle("mobile-open");

    });

}


/* ================= LOAD ADMIN PROFILE ================= */

async function loadAdminProfile() {

    const savedUser =
        localStorage.getItem("campusFixUser");


    if (!savedUser) {

        window.location.href = "login.html";

        return;

    }


    let user;


    try {

        user = JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Invalid stored user:",
            error
        );

        localStorage.removeItem(
            "campusFixUser"
        );

        window.location.href =
            "login.html";

        return;

    }


    if (!user || user.role !== "admin") {

        localStorage.removeItem(
            "campusFixUser"
        );

        window.location.href =
            "login.html";

        return;

    }


    displayAdminProfile(user);


    /*
       Fetch the latest admin information
       from the backend.
    */

    if (user.id) {

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/users/${user.id}`
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch admin profile."
                );

            }


            const latestUser =
                await response.json();


            if (latestUser) {

                displayAdminProfile(
                    latestUser
                );


                localStorage.setItem(
                    "campusFixUser",
                    JSON.stringify(latestUser)
                );

            }

        } catch (error) {

            console.warn(
                "Using stored admin profile:",
                error.message
            );

        }

    }

}


/* ================= DISPLAY PROFILE ================= */

function displayAdminProfile(user) {

    const adminName =
        document.getElementById(
            "adminName"
        );

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );

    const profileRole =
        document.getElementById(
            "profileRole"
        );

    const profileId =
        document.getElementById(
            "profileId"
        );


    const name =
        user.name ||
        "CampusFix Administrator";


    const email =
        user.email ||
        "admin@campusfix.com";


    const role =
        user.role ||
        "admin";


    const roleText =
        formatRole(role);


    if (adminName) {
        adminName.textContent = name;
    }


    if (profileName) {
        profileName.textContent = name;
    }


    if (profileEmail) {
        profileEmail.textContent = email;
    }


    if (profileRole) {
        profileRole.textContent = roleText;
    }


    if (profileId) {
        profileId.textContent =
            user.id ? `#${user.id}` : "—";
    }

}


/* ================= FORMAT ROLE ================= */

function formatRole(role) {

    const normalizedRole =
        String(role || "")
            .trim()
            .toLowerCase();


    if (normalizedRole === "admin") {
        return "Administrator";
    }


    if (normalizedRole === "student") {
        return "Student";
    }


    return normalizedRole
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });

}


/* ================= LOGOUT ================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "campusFixUser"
            );


            window.location.href =
                "login.html";

        }
    );

}