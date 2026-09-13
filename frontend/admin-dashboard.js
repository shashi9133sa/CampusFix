/* =========================================================
   CAMPUSFIX - ADMIN DASHBOARD JAVASCRIPT
   ========================================================= */


/* ===================== PAGE LOAD ===================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeSidebarLinks();
    initializeLogout();
    initializeProfile();

    loadAdminDashboard();

    // Refresh dashboard every 10 seconds
    setInterval(function () {
        loadAdminDashboard();
    }, 10000);

});


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".admin-sidebar");


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("mobile-open");


        const icon =
            menuButton.querySelector("i");


        if (!icon) {
            return;
        }


        if (
            sidebar.classList.contains("mobile-open")
        ) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });

}


/* =========================
   SIDEBAR LINKS
========================= */

function initializeSidebarLinks() {

    const links =
        document.querySelectorAll(
            ".admin-nav-item"
        );

    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    links.forEach(function (link) {

        link.addEventListener("click", function () {

            if (sidebar) {

                sidebar.classList.remove(
                    "mobile-open"
                );

            }

        });

    });

}


/* =========================
   LOGOUT
========================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            /* Remove logged-in user */

            localStorage.removeItem(
                "campusFixUser"
            );


            /* Return to login */

            window.location.href =
                "login.html";

        }
    );

}


/* =========================
   ADMIN PROFILE
========================= */

function initializeProfile() {

    const profileButton =
        document.getElementById(
            "profileButton"
        );


    if (!profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin-profile.html";

        }
    );

}


/* =========================
   LOAD ADMIN DASHBOARD
========================= */

async function loadAdminDashboard() {

    try {

        const response =
            await fetch(
                "https://campusfix-obdm.onrender.com/api/complaints/all"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load complaints"
            );

        }


        const complaints =
            await response.json();


        console.log(
            "Admin dashboard complaints:",
            complaints
        );


        updateStatistics(
            complaints
        );


        updateRecentComplaints(
            complaints
        );


        updateBackendStatus(
            true
        );


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );


        updateBackendStatus(
            false
        );

    }

}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics(complaints) {

    const total =
        complaints.length;


    const pending =
        complaints.filter(function (complaint) {

            return normalizeStatus(
                complaint.status
            ) === "pending";

        }).length;


    const progress =
        complaints.filter(function (complaint) {

            return normalizeStatus(
                complaint.status
            ) === "in progress";

        }).length;


    const resolved =
        complaints.filter(function (complaint) {

            return normalizeStatus(
                complaint.status
            ) === "resolved";

        }).length;


    const totalElement =
        document.getElementById(
            "totalComplaints"
        );


    const pendingElement =
        document.getElementById(
            "pendingComplaints"
        );


    const progressElement =
        document.getElementById(
            "progressComplaints"
        );


    const resolvedElement =
        document.getElementById(
            "resolvedComplaints"
        );


    if (totalElement) {

        animateNumber(
            totalElement,
            total
        );

    }


    if (pendingElement) {

        animateNumber(
            pendingElement,
            pending
        );

    }


    if (progressElement) {

        animateNumber(
            progressElement,
            progress
        );

    }


    if (resolvedElement) {

        animateNumber(
            resolvedElement,
            resolved
        );

    }

}


/* =========================
   RECENT COMPLAINTS
========================= */

function updateRecentComplaints(
    complaints
) {

    const container =
        document.getElementById(
            "adminComplaintsList"
        );


    if (!container) {
        return;
    }


    if (!complaints ||
        complaints.length === 0) {

        container.innerHTML = `

            <div class="admin-empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-inbox"></i>

                </div>

                <strong>
                    No complaints yet
                </strong>

                <span>
                    Complaints submitted by students
                    will appear here.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /*
       Show only the five most recent complaints.
       Backend already sorts them by created_at.
    */

    const recentComplaints =
        complaints.slice(0, 5);


    recentComplaints.forEach(
        function (complaint) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "admin-complaint-row";


            const statusClass =
                getStatusClass(
                    complaint.status
                );


            row.innerHTML = `

                <div class="complaint-icon">

                    <i class="${getCategoryIcon(
                        complaint.category
                    )}"></i>

                </div>


                <div class="complaint-info">

                <strong>
                    ${escapeHTML(
                        complaint.title
                    )}
                </strong>
            
                <small>
    ${escapeHTML(
        complaint.location
    )}
</small>

<small>
    <i class="fa-solid fa-user"></i>
    Submitted by:
    ${escapeHTML(
        complaint.student_name ||
        "Unknown Student"
    )}
</small>
            
            </div>

                <span
                    class="complaint-status ${statusClass}"
                >
                    ${escapeHTML(
                        complaint.status ||
                        "Pending"
                    )}
                </span>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =========================
   CATEGORY ICON
========================= */

function getCategoryIcon(category) {

    const value =
        (category || "").toLowerCase();


    if (value.includes("plumbing")) {

        return "fa-solid fa-faucet";

    }


    if (
        value.includes("wifi") ||
        value.includes("internet")
    ) {

        return "fa-solid fa-wifi";

    }


    if (value.includes("electrical")) {

        return "fa-solid fa-bolt";

    }


    if (value.includes("furniture")) {

        return "fa-solid fa-chair";

    }


    if (
        value.includes("clean") ||
        value.includes("cleaning")
    ) {

        return "fa-solid fa-broom";

    }


    if (
        value.includes("water")
    ) {

        return "fa-solid fa-droplet";

    }


    if (
        value.includes("security")
    ) {

        return "fa-solid fa-shield-halved";

    }


    return "fa-solid fa-circle-exclamation";

}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    const value =
        normalizeStatus(status);


    if (value === "resolved") {

        return "status-resolved";

    }


    if (value === "in progress") {

        return "status-progress";

    }


    return "status-pending";

}


/* =========================
   NORMALIZE STATUS
========================= */

function normalizeStatus(status) {

    return String(
        status || "Pending"
    )
        .trim()
        .toLowerCase();

}


/* =========================
   BACKEND STATUS
========================= */

function updateBackendStatus(
    isOnline
) {

    const statusElement =
        document.getElementById(
            "backendStatus"
        );


    if (!statusElement) {
        return;
    }


    if (isOnline) {

        statusElement.textContent =
            "Online";

        statusElement.style.color =
            "#55d99a";

    } else {

        statusElement.textContent =
            "Offline";

        statusElement.style.color =
            "#ff6b7a";

    }

}


/* =========================
   NUMBER ANIMATION
========================= */

function animateNumber(
    element,
    target
) {

    const start =
        Number(
            element.textContent
        ) || 0;


    const duration = 600;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const progress =
            Math.min(
                (
                    currentTime -
                    startTime
                ) / duration,
                1
            );


        const value =
            Math.floor(
                start +
                (
                    target -
                    start
                ) *
                progress
            );


        element.textContent =
            value;


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                target;

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}
