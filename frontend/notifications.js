
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    const markAllButton =
        document.getElementById("markAllButton");

    const searchInput =
        document.getElementById("searchInput");

    const notificationFilter =
        document.getElementById("notificationFilter");

    const unreadNotifications =
        document.getElementById("unreadNotifications");

    const totalNotifications =
        document.getElementById("totalNotifications");

    const sidebarNotificationCount =
        document.getElementById("sidebarNotificationCount");

    const noResults =
        document.getElementById("noResults");


    // ==========================================
    // MOBILE MENU
    // ==========================================

    if (menuButton && sidebar) {

        menuButton.addEventListener("click", () => {

            sidebar.classList.toggle("open");

        });

    }


    // ==========================================
    // GET NOTIFICATIONS
    // ==========================================

    function getNotifications() {

        return document.querySelectorAll(
            ".notification-card"
        );

    }


    // ==========================================
    // UPDATE COUNTS
    // ==========================================

    function updateCounts() {

        const notifications = getNotifications();

        let unread = 0;

        notifications.forEach(notification => {

            if (
                notification.classList.contains("unread")
            ) {

                unread++;

            }

        });


        if (unreadNotifications) {

            unreadNotifications.textContent = unread;

        }


        if (totalNotifications) {

            totalNotifications.textContent =
                notifications.length;

        }


        if (sidebarNotificationCount) {

            sidebarNotificationCount.textContent =
                unread;

        }

    }


    // ==========================================
    // MARK SINGLE NOTIFICATION AS READ
    // ==========================================

    function markAsRead(notification) {

        notification.classList.remove("unread");
    
        notification.dataset.status = "read";
    
        const complaintId =
            notification.dataset.complaintId;
    
        const savedUser =
            localStorage.getItem("campusFixUser");
    
        if (savedUser && complaintId) {
    
            const user =
                JSON.parse(savedUser);
    
            const readKey =
                `campusFixReadNotifications_${user.id}`;
    
            let readNotifications =
                JSON.parse(
                    localStorage.getItem(readKey) || "[]"
                );
    
            if (!readNotifications.includes(complaintId)) {
    
                readNotifications.push(complaintId);
    
                localStorage.setItem(
                    readKey,
                    JSON.stringify(readNotifications)
                );
            }
        }
    
    
        const unreadDot =
            notification.querySelector(".unread-dot");
    
        if (unreadDot) {
            unreadDot.remove();
        }
    
    
        const readButton =
            notification.querySelector(".read-button");
    
        if (readButton) {
            readButton.remove();
        }
    
    
        updateCounts();
    
        applyFilters();
    
    }

    // ==========================================
    // SINGLE READ BUTTON
    // ==========================================

    function setupReadButtons() {

        document
            .querySelectorAll(".read-button")
            .forEach(button => {

                button.addEventListener("click", event => {

                    event.stopPropagation();

                    const notification =
                        button.closest(
                            ".notification-card"
                        );

                    if (notification) {

                        markAsRead(notification);

                    }

                });

            });

    }


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            () => {

                const notifications =
                    getNotifications();

                notifications.forEach(notification => {

                    markAsRead(notification);

                });

                updateCounts();

                applyFilters();

            }
        );

    }


    // ==========================================
    // DELETE NOTIFICATION
    // ==========================================

    function setupDeleteButtons() {

        document
            .querySelectorAll(".delete-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const notification =
                            button.closest(
                                ".notification-card"
                            );

                        if (!notification) return;


                        notification.style.opacity = "0";

                        notification.style.transform =
                            "translateX(30px)";


                        setTimeout(() => {

                            notification.remove();

                            updateCounts();

                            applyFilters();

                        }, 300);

                    }
                );

            });

    }


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    function applyFilters() {

        const notifications =
            getNotifications();


        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const filterValue =
            notificationFilter
                ? notificationFilter.value
                : "all";


        let visibleCount = 0;


        notifications.forEach(notification => {

            const text =
                notification.textContent
                    .toLowerCase();


            const status =
                notification.dataset.status;


            const matchesSearch =
                text.includes(searchText);


            let matchesFilter = true;


            if (filterValue === "unread") {

                matchesFilter =
                    status === "unread";

            }


            if (filterValue === "read") {

                matchesFilter =
                    status === "read";

            }


            if (
                matchesSearch &&
                matchesFilter
            ) {

                notification.style.display = "";

                visibleCount++;

            } else {

                notification.style.display =
                    "none";

            }

        });


        // NO RESULTS

        if (noResults) {

            if (visibleCount === 0) {

                noResults.style.display = "flex";

            } else {

                noResults.style.display = "none";

            }

        }

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    // ==========================================
    // FILTER
    // ==========================================

    if (notificationFilter) {

        notificationFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "login.html";

            }
        );

    }


    // ==========================================
    // SIDEBAR LINK CLOSE ON MOBILE
    // ==========================================

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (sidebar) {

                        sidebar.classList.remove(
                            "active"
                        );

                    }

                }
            );

        });


// ==========================================
// LOAD BACKEND NOTIFICATIONS
// ==========================================

async function loadBackendNotifications() {
    const container =
    document.getElementById("notificationsContainer");

if (container) {
    container.innerHTML = "";
}
  
    try {

        const response = await fetch(
            "https://campusfix-obdm.onrender.com/api/complaints/all"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        const complaints = await response.json();

console.log(
    "All complaints loaded from backend:",
    complaints
);


/* ==========================================
   GET LOGGED-IN USER
========================================== */

const savedUser =
    localStorage.getItem("campusFixUser");

if (!savedUser) {

    window.location.href =
        "login.html";

    return;

}


let loggedInUser;

try {

    loggedInUser =
        JSON.parse(savedUser);

} catch (error) {

    console.error(
        "Invalid logged-in user:",
        error
    );

    localStorage.removeItem(
        "campusFixUser"
    );

    window.location.href =
        "login.html";

    return;

}


/* ==========================================
   ONLY THIS USER'S COMPLAINTS
========================================== */

const userComplaints =
    complaints.filter(function (complaint) {

        return Number(complaint.user_id) ===
            Number(loggedInUser.id);

    });


console.log(
    "Notifications for logged-in user:",
    userComplaints
);


/* ==========================================
   CLEAR OLD CONTENT
========================================== */

const container =
    document.getElementById(
        "notificationsContainer"
    );

if (container) {
    container.innerHTML = "";
}


/* ==========================================
   CREATE USER NOTIFICATIONS
========================================== */

userComplaints.forEach(function (complaint) {

    createNotification(complaint);

});

        setupReadButtons();

        setupDeleteButtons();

        updateCounts();

        applyFilters();

    } catch (error) {

        console.error(
            "Could not load notifications:",
            error
        );

        updateCounts();

        applyFilters();

    }

}


// ==========================================
// CREATE NOTIFICATION
// ==========================================

function createNotification(complaint) {

    const container =
        document.getElementById("notificationsContainer");

    if (!container) return;


    const notification =
        document.createElement("article");


        const savedUser =
        localStorage.getItem("campusFixUser");
    
    let isRead = false;
    
    if (savedUser) {
    
        const user =
            JSON.parse(savedUser);
    
        const readKey =
            `campusFixReadNotifications_${user.id}`;
    
        const readNotifications =
            JSON.parse(
                localStorage.getItem(readKey) || "[]"
            );
    
        isRead =
            readNotifications.includes(
                String(complaint.id)
            );
    }
    
    
    notification.className =
        isRead
            ? "notification-card"
            : "notification-card unread";
    
    notification.dataset.status =
        isRead ? "read" : "unread";
    
    notification.dataset.complaintId =
        String(complaint.id);


    // =========================
    // STATUS DESIGN
    // =========================

    let iconClass =
        "report-icon";

    let icon =
        "fa-solid fa-file-circle-plus";

    let title =
        "Complaint Submitted";

    let message =
        "was successfully submitted.";


    if (
        complaint.status &&
        complaint.status.toLowerCase() === "in progress"
    ) {

        iconClass =
            "progress-icon";

        icon =
            "fa-solid fa-screwdriver-wrench";

        title =
            "Complaint is now In Progress";

        message =
            "has been assigned to the maintenance team.";

    }


    if (
        complaint.status &&
        complaint.status.toLowerCase() === "resolved"
    ) {

        iconClass =
            "resolved-icon";

        icon =
            "fa-solid fa-circle-check";

        title =
            "Complaint Resolved";

        message =
            "has been successfully resolved.";

    }


    // =========================
    // TIME
    // =========================

    const timeText =
        complaint.created_at
            ? getNotificationTime(complaint.created_at)
            : "Just now";


    // =========================
    // CARD
    // =========================

    notification.innerHTML = `

        <div class="notification-icon ${iconClass}">

            <i class="${icon}"></i>

        </div>


        <div class="notification-content">

            <div class="notification-title-row">

                <h3>
                    ${title}
                </h3>

                ${isRead ? "" : '<span class="unread-dot"></span>'}

            </div>


            <p>

                Your complaint

                <strong>
                    "${escapeHTML(complaint.title)}"
                </strong>

                ${message}

            </p>


            <span class="notification-time">

                <i class="fa-regular fa-clock"></i>

                ${timeText}

            </span>

        </div>


        <div class="notification-actions">

        ${isRead ? "" : `
        <button
            class="read-button"
            title="Mark as read"
        >
            <i class="fa-solid fa-check"></i>
        </button>
        `}


            <button
                class="delete-button"
                title="Delete"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;


    container.appendChild(notification);

}
function getNotificationTime(createdAt) {

    const created =
        new Date(createdAt);

    const now =
        new Date();

    const difference =
        Math.floor(
            (now - created) / 1000
        );


    if (difference < 60) {
        return "Just now";
    }


    const minutes =
        Math.floor(
            difference / 60
        );


    if (minutes < 60) {
        return `${minutes} min ago`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {
        return "Yesterday";
    }


    return `${days} days ago`;

}
// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// INITIAL SETUP
// ==========================================

loadBackendNotifications();
});


