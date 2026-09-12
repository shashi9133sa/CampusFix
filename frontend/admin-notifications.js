/* =========================================================
   CAMPUSFIX - ADMIN NOTIFICATIONS
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeNotifications();
    initializeLogout();

    console.log("🔔 CampusFix Admin Notifications loaded!");

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


/* ================= NOTIFICATIONS ================= */

function initializeNotifications() {

    const refreshButton =
        document.getElementById("refreshNotifications");


    loadNotifications();


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                loadNotifications();

            }
        );

    }

}


/* ================= LOAD DATA ================= */

async function loadNotifications() {

    const notificationList =
        document.getElementById(
            "adminNotificationList"
        );


    if (!notificationList) {
        return;
    }


    showLoading(notificationList);


    try {

        const response =
            await fetch(
                "https://campusfix-obdm.onrender.com/api/complaints/all"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load system activity."
            );

        }


        const complaints =
            await response.json();


        updateSummary(complaints);

        renderNotifications(
            complaints,
            notificationList
        );


    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );


        showError(notificationList);

    }

}


/* ================= SUMMARY ================= */

function updateSummary(complaints) {

    const total =
        document.getElementById(
            "totalNotifications"
        );

    const pending =
        document.getElementById(
            "pendingNotifications"
        );

    const resolved =
        document.getElementById(
            "resolvedNotifications"
        );


    const totalCount =
        complaints.length;


    const pendingCount =
        complaints.filter(function (complaint) {

            return normalizeStatus(
                complaint.status
            ) === "pending";

        }).length;


    const resolvedCount =
        complaints.filter(function (complaint) {

            return normalizeStatus(
                complaint.status
            ) === "resolved";

        }).length;


    if (total) {
        total.textContent = totalCount;
    }


    if (pending) {
        pending.textContent = pendingCount;
    }


    if (resolved) {
        resolved.textContent = resolvedCount;
    }

}


/* ================= RENDER ================= */

function renderNotifications(
    complaints,
    notificationList
) {

    if (!complaints || complaints.length === 0) {

        notificationList.innerHTML = `

            <div class="notification-empty">

                <i class="fa-regular fa-bell-slash"></i>

                <strong>
                    No system activity yet
                </strong>

                <p>
                    New complaint activity will appear here.
                </p>

            </div>

        `;

        return;
    }


    const sortedComplaints =
        [...complaints].sort(function (a, b) {

            return new Date(
                b.created_at || 0
            ) - new Date(
                a.created_at || 0
            );

        });


    notificationList.innerHTML =
        sortedComplaints
            .map(function (complaint) {

                return createNotification(
                    complaint
                );

            })
            .join("");

}


/* ================= CREATE NOTIFICATION ================= */

function createNotification(complaint) {

    const status =
        normalizeStatus(
            complaint.status
        );


    const statusClass =
        status.replace(
            /\s+/g,
            "-"
        );


    const icon =
        getNotificationIcon(status);


    const title =
        getNotificationTitle(
            complaint,
            status
        );


    const description =
        getNotificationDescription(
            complaint,
            status
        );


    const time =
        formatDate(
            complaint.created_at
        );


    const complaintId =
        escapeHtml(
            complaint.id || "N/A"
        );


    return `

        <div class="notification-item">

            <div class="notification-icon ${statusClass}">

                <i class="${icon}"></i>

            </div>


            <div class="notification-content">

                <h4>
                    ${title}
                </h4>

                <p>
                    ${description}
                </p>


                <div class="notification-meta">

                    <span>
                        Complaint #${complaintId}
                    </span>

                    <span>
                        ${time}
                    </span>

                    <span class="notification-status ${statusClass}">
                        ${capitalizeStatus(status)}
                    </span>

                </div>

            </div>

        </div>

    `;

}


/* ================= NOTIFICATION TEXT ================= */

function getNotificationTitle(
    complaint,
    status
) {

    if (status === "resolved") {

        return "Complaint resolved";

    }


    if (status === "in progress") {

        return "Complaint moved to maintenance";

    }


    if (status === "rejected") {

        return "Complaint rejected";

    }


    return "New complaint submitted";

}


function getNotificationDescription(
    complaint,
    status
) {

    const title =
        complaint.title ||
        "Campus maintenance issue";


    if (status === "resolved") {

        return `"${escapeHtml(title)}" has been marked as resolved.`;

    }


    if (status === "in progress") {

        return `"${escapeHtml(title)}" is currently being handled by the maintenance team.`;

    }


    if (status === "rejected") {

        return `"${escapeHtml(title)}" has been rejected by the administration.`;

    }


    return `"${escapeHtml(title)}" requires administrative attention.`;

}


/* ================= ICON ================= */

function getNotificationIcon(status) {

    if (status === "resolved") {

        return "fa-solid fa-circle-check";

    }


    if (status === "in progress") {

        return "fa-solid fa-screwdriver-wrench";

    }


    if (status === "rejected") {

        return "fa-solid fa-circle-xmark";

    }


    return "fa-solid fa-triangle-exclamation";

}


/* ================= STATUS ================= */

function normalizeStatus(status) {

    return String(
        status || "Pending"
    )
        .trim()
        .toLowerCase();

}


function capitalizeStatus(status) {

    if (!status) {
        return "Pending";
    }


    return status
        .split(" ")
        .map(function (word) {

            return word.charAt(0).toUpperCase()
                + word.slice(1);

        })
        .join(" ");

}


/* ================= DATE ================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Recently";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(
        date.getTime()
    )) {

        return "Recently";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* ================= LOADING ================= */

function showLoading(notificationList) {

    notificationList.innerHTML = `

        <div class="notification-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Loading system activity...
            </span>

        </div>

    `;

}


/* ================= ERROR ================= */

function showError(notificationList) {

    notificationList.innerHTML = `

        <div class="notification-empty">

            <i class="fa-solid fa-triangle-exclamation"></i>

            <strong>
                Unable to load notifications
            </strong>

            <p>
                Make sure the CampusFix backend is running.
            </p>

        </div>

    `;

}


/* ================= HTML SAFETY ================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

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
