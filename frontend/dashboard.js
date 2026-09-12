
document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeSidebarLinks();
    initializeNotificationButton();
    initializeProfileButton();
    initializeLogout();

    loadDashboardData();

});


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {

    const menuButton = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        const icon = menuButton.querySelector("i");

        if (!icon) return;

        if (sidebar.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* =========================
   SIDEBAR
========================= */

function initializeSidebarLinks() {

    const links =
        document.querySelectorAll(".sidebar-link");

    const sidebar =
        document.getElementById("sidebar");

    links.forEach(function (link) {

        link.addEventListener("click", function () {

            if (sidebar) {
                sidebar.classList.remove("open");
            }

        });

    });

}


/* =========================
   NOTIFICATIONS
========================= */

function initializeNotificationButton() {

    const notificationButton =
        document.querySelector(".topbar-icon");

    if (!notificationButton) return;

    notificationButton.setAttribute(
        "href",
        "notifications.html"
    );

}


/* =========================
   PROFILE
========================= */

function initializeProfileButton() {

    const profileButton =
        document.querySelector(".profile-button");

    if (!profileButton) return;

    profileButton.addEventListener("click", function () {

        window.location.href =
            "profile.html";

    });

}


/* =========================
   LOGOUT
========================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", function () {

        const confirmed =
            confirm("Are you sure you want to logout?");

        if (!confirmed) return;

        window.location.href =
            "login.html";

    });

}


/* =========================
   DASHBOARD DATA
========================= */

async function loadDashboardData() {

    try {

        const response = await fetch(
            "https://campusfix-obdm.onrender.com/api/complaints/all"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        const complaints = await response.json();

        console.log(
            "Dashboard data from backend:",
            complaints
        );

        updateStatistics(complaints);

        updateRecentComplaints(complaints);

    } catch (error) {

        console.error(
            "Could not load dashboard data:",
            error
        );

    }

}

/* =========================
   STATISTICS
========================= */

function updateStatistics(complaints) {

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


    const numbers =
        document.querySelectorAll(
            ".dashboard-number"
        );


    if (numbers.length >= 4) {

        animateNumber(numbers[0], total);
        animateNumber(numbers[1], pending);
        animateNumber(numbers[2], progress);
        animateNumber(numbers[3], resolved);

    }


    /* Update impact number */

    const impactNumber =
        document.querySelector(
            ".impact-number strong"
        );

    if (impactNumber) {
        animateNumber(
            impactNumber,
            resolved
        );
    }

}


/* =========================
   RECENT COMPLAINTS
========================= */

function updateRecentComplaints(complaints) {

    const list =
        document.querySelector(
            ".complaints-list"
        );

    if (!list) return;


    const savedUser =
        localStorage.getItem("campusFixUser");

    if (!savedUser) {
        list.innerHTML = "";
        return;
    }


    let loggedInUser;

    try {
        loggedInUser =
            JSON.parse(savedUser);
    } catch (error) {
        list.innerHTML = "";
        return;
    }


    /* Show only the logged-in student's complaints */

    const userComplaints =
        complaints.filter(function (complaint) {

            return Number(complaint.user_id) ===
                Number(loggedInUser.id);

        });


    /* Clear dummy complaints */

    list.innerHTML = "";


    /* No complaints */

    if (userComplaints.length === 0) {

        list.innerHTML = `
            <div class="complaint-row">
                <div class="complaint-category light-icon">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>

                <div class="complaint-details">
                    <strong>
                        No complaints yet
                    </strong>

                    <span>
                        Your reported issues will appear here.
                    </span>

                    <small>
                        Ready to report an issue
                    </small>
                </div>
            </div>
        `;

        return;
    }


    /* Show latest 4 */

    const recent =
        userComplaints.slice(0, 4);


    recent.forEach(function (complaint) {

        const row =
            document.createElement("div");

        row.className =
            "complaint-row";


        const iconClass =
            getCategoryIcon(
                complaint.category
            );


        const statusClass =
            getStatusClass(
                complaint.status
            );


        const timeText =
            getTimeText(
                complaint.created_at
            );


        row.innerHTML = `

            <div class="complaint-category ${iconClass.className}">

                <i class="${iconClass.icon}"></i>

            </div>


            <div class="complaint-details">

                <strong>
                    ${escapeHTML(complaint.title)}
                </strong>


                <span>
                    ${escapeHTML(complaint.location)}
                </span>


                <small>
                    ${timeText}
                </small>

            </div>


            <span class="complaint-status ${statusClass}">
                ${escapeHTML(complaint.status)}
            </span>

        `;


        row.addEventListener(
            "click",
            function () {

                window.location.href =
                    "complaints.html";

            }
        );


        row.style.cursor =
            "pointer";


        list.appendChild(row);

    });

}


/* =========================
   CATEGORY ICON
========================= */

function getCategoryIcon(category) {

    const value =
        (category || "").toLowerCase();


    if (value.includes("plumbing")) {

        return {
            className: "water-icon",
            icon: "fa-solid fa-faucet-drip"
        };

    }


    if (value.includes("internet")) {

        return {
            className: "wifi-icon",
            icon: "fa-solid fa-wifi"
        };

    }


    if (value.includes("furniture")) {

        return {
            className: "chair-icon",
            icon: "fa-solid fa-chair"
        };

    }


    if (value.includes("clean")) {

        return {
            className: "clean-icon",
            icon: "fa-solid fa-broom"
        };

    }


    return {
        className: "light-icon",
        icon: "fa-solid fa-lightbulb"
    };

}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    const value =
        (status || "").toLowerCase();


    if (value.includes("resolved")) {
        return "resolved";
    }


    if (value.includes("progress")) {
        return "progress";
    }


    return "pending";

}


/* =========================
   TIME TEXT
========================= */

function getTimeText(createdAt) {

    if (!createdAt) {
        return "Recently reported";
    }


    const created =
        new Date(createdAt);

    const now =
        new Date();


    const difference =
        Math.floor(
            (now - created) / 1000
        );


    if (difference < 60) {
        return "Reported just now";
    }


    const minutes =
        Math.floor(
            difference / 60
        );


    if (minutes < 60) {
        return `Reported ${minutes} min ago`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {
        return `Reported ${hours} hour${hours === 1 ? "" : "s"} ago`;
    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {
        return "Reported yesterday";
    }


    return `Reported ${days} days ago`;

}


/* =========================
   NUMBER ANIMATION
========================= */

function animateNumber(element, target) {

    if (!element) return;


    let current = 0;

    const duration =
        700;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        current =
            Math.floor(
                progress * target
            );


        element.textContent =
            current;


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target;

        }

    }


    requestAnimationFrame(update);

}


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}
/* =========================
   AUTO REFRESH
========================= */

setInterval(function () {

    loadDashboardData();

}, 10000);
