document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeLogout();
    initializeSidebarLinks();
    loadUserProfile();

});


/* =========================
   LOAD USER PROFILE
========================= */

async function loadUserProfile() {

    const savedUser =
        localStorage.getItem("campusFixUser");

    if (!savedUser) {
        window.location.href = "login.html";
        return;
    }

    let loggedInUser;

    try {
        loggedInUser = JSON.parse(savedUser);
    } catch (error) {
        console.error("Invalid user session");
        localStorage.removeItem("campusFixUser");
        window.location.href = "login.html";
        return;
    }

    console.log("CURRENT LOGGED-IN USER:", loggedInUser);


    /* =========================
       BASIC USER INFORMATION
    ========================= */

    const name =
        loggedInUser.name || "Student";

    const email =
        loggedInUser.email || "Not available";


    /* =========================
       NAME
    ========================= */

    const profileName =
        document.getElementById("profileName");

    if (profileName) {
        profileName.textContent = name;
    }


    const profileFullName =
        document.getElementById("profileFullName");

    if (profileFullName) {
        profileFullName.textContent = name;
    }


    const topProfileName =
        document.getElementById("topProfileName");

    if (topProfileName) {
        topProfileName.textContent = name;
    }


    /* =========================
       EMAIL
    ========================= */

    const profileEmail =
        document.getElementById("profileEmail");

    if (profileEmail) {
        profileEmail.textContent = email;
    }


    /* =========================
       ROLE
    ========================= */

    const topProfileRole =
        document.getElementById("topProfileRole");

    if (topProfileRole) {
        topProfileRole.textContent =
            loggedInUser.role === "admin"
                ? "Administrator"
                : "Student Account";
    }


    /* =========================
       AVATAR
    ========================= */

    const initials =
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word =>
                word.charAt(0).toUpperCase()
            )
            .join("");

    document
        .querySelectorAll(
            ".profile-avatar, .profile-large-avatar"
        )
        .forEach(function (avatar) {

            avatar.textContent =
                initials || "ST";

        });


    /* =========================
       GET FULL USER DATA
    ========================= */

    try {

        const response =
            await fetch(
                `https://campusfix-obdm.onrender.com/api/users/${loggedInUser.id}`
            );

        if (!response.ok) {
            throw new Error("Failed to load user details");
        }

        const user =
            await response.json();


        /* Student ID */

        const heroStudentId =
            document.querySelector(
                ".profile-id strong"
            );

        if (heroStudentId) {
            heroStudentId.textContent =
                user.student_id || "Not available";
        }


        /* Details */

        document
            .querySelectorAll(".detail-item")
            .forEach(function (item) {

                const label =
                    item.querySelector("span");

                const value =
                    item.querySelector("strong");

                if (!label || !value) return;

                const labelText =
                    label.textContent
                        .trim()
                        .toLowerCase();


                if (labelText === "student id") {

                    value.textContent =
                        user.student_id ||
                        "Not available";

                }


                if (labelText === "department") {

                    value.textContent =
                        user.department ||
                        "Not available";

                }


                if (labelText === "year") {

                    value.textContent =
                        user.year ||
                        "Not available";

                }

            });


    } catch (error) {

        console.error(
            "Could not load additional user details:",
            error
        );

    }


    /* =========================
       COMPLAINT STATISTICS
    ========================= */

    try {

        const response =
            await fetch(
                "https://campusfix-obdm.onrender.com/api/complaints/all"
            );

        if (!response.ok) {
            throw new Error("Failed to load complaints");
        }

        const complaints =
            await response.json();


        const myComplaints =
            complaints.filter(function (complaint) {

                return Number(complaint.user_id) ===
                    Number(loggedInUser.id);

            });


        const total =
            myComplaints.length;

        const pending =
            myComplaints.filter(
                complaint =>
                    complaint.status === "Pending"
            ).length;

        const progress =
            myComplaints.filter(
                complaint =>
                    complaint.status === "In Progress"
            ).length;

        const resolved =
            myComplaints.filter(
                complaint =>
                    complaint.status === "Resolved"
            ).length;


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
            "Could not load complaint statistics:",
            error
        );

    }

}


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

    });

}


/* =========================
   SIDEBAR LINKS
========================= */

function initializeSidebarLinks() {

    document
        .querySelectorAll(".nav-link")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    const sidebar =
                        document.getElementById("sidebar");

                    if (sidebar) {
                        sidebar.classList.remove("open");
                    }

                }
            );

        });

}


/* =========================
   LOGOUT
========================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (!confirmed) return;

            localStorage.removeItem(
                "campusFixUser"
            );

            window.location.href =
                "login.html";

        }
    );

}