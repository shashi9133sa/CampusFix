document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeSidebarLinks();
    initializeNotificationButton();
    initializeProfileButton();
    initializeLogout();

    initializeFilters();
    loadComplaints();

});


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenu");

    const sidebar =
        document.getElementById("sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        const icon =
            menuButton.querySelector("i");

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

        localStorage.removeItem("campusFixUser");

        window.location.href =
            "login.html";

    });

}


/* =========================
   FILTERS
========================= */

function initializeFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }

}


/* =========================
   LOAD COMPLAINTS
========================= */

async function loadComplaints() {

    const container =
        document.getElementById("complaintsContainer");

    if (!container) return;


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


    /* Loading state */

    container.innerHTML = `
        <div class="complaints-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Loading your complaints...</span>
        </div>
    `;


    try {

        const response =
            await fetch(
                "https://campusfix-obdm.onrender.com/api/complaints/all"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch complaints"
            );

        }


        const complaints =
            await response.json();


        /* =========================
           ONLY LOGGED-IN USER
        ========================= */

        const userComplaints =
            complaints.filter(function (complaint) {

                return Number(complaint.user_id) ===
                    Number(loggedInUser.id);

            });


        /* Save for filtering */

        window.allUserComplaints =
            userComplaints;


        renderComplaints(
            userComplaints
        );

    } catch (error) {

        console.error(
            "Error loading complaints:",
            error
        );


        container.innerHTML = `
            <div class="complaints-empty">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <strong>
                    Unable to load complaints
                </strong>

                <span>
                    Please try again later.
                </span>
            </div>
        `;

    }

}


/* =========================
   RENDER COMPLAINTS
========================= */

function renderComplaints(complaints) {

    const container =
        document.getElementById(
            "complaintsContainer"
        );

    if (!container) return;


    container.innerHTML = "";


    if (complaints.length === 0) {

        container.innerHTML = `
            <div class="complaints-empty">

                <div class="empty-icon">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>

                <strong>
                    No complaints found
                </strong>

                <span>
                    You haven't reported any complaints yet.
                </span>

                <a href="report.html" class="empty-button">
                    <i class="fa-solid fa-plus"></i>
                    Report an Issue
                </a>

            </div>
        `;

        return;

    }


    complaints.forEach(function (complaint) {

        const card =
            document.createElement("article");

        card.className =
            "complaint-card";


        const icon =
            getCategoryIcon(
                complaint.category
            );


        const statusClass =
            getStatusClass(
                complaint.status
            );


        const date =
            formatDate(
                complaint.created_at
            );


        card.innerHTML = `

            <div class="complaint-icon ${icon.className}">
                <i class="${icon.icon}"></i>
            </div>


            <div class="complaint-details">

                <div class="complaint-title-row">

                    <h3>
                        ${escapeHTML(
                            complaint.title
                        )}
                    </h3>

                    <span class="status ${statusClass}">
                        ${escapeHTML(
                            complaint.status
                        )}
                    </span>

                </div>


                <p class="complaint-description">
                    ${escapeHTML(
                        complaint.description
                    )}
                </p>


                <div class="complaint-meta">

                    <span>
                        <i class="fa-solid fa-location-dot"></i>
                        ${escapeHTML(
                            complaint.location
                        )}
                    </span>

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${date}
                    </span>

                    <span>
                        <i class="fa-solid fa-tag"></i>
                        ${escapeHTML(
                            complaint.category
                        )}
                    </span>

                </div>

            </div>


            <button
                class="view-button"
                type="button"
            >
                View Details
                <i class="fa-solid fa-arrow-right"></i>
            </button>

        `;


        const viewButton =
            card.querySelector(
                ".view-button"
            );


            if (viewButton) {

                viewButton.addEventListener(
                    "click",
                    function (event) {
            
                        event.preventDefault();
                        event.stopPropagation();
            
                        showComplaintDetails(complaint);
            
                    }
                );
            
            }


        container.appendChild(card);

    });

}


/* =========================
   APPLY FILTERS
========================= */

function applyFilters() {

    const complaints =
        window.allUserComplaints || [];


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
                .toLowerCase()
            : "all";


    const category =
        categoryFilter
            ? categoryFilter.value
                .toLowerCase()
            : "all";


    const filtered =
        complaints.filter(function (complaint) {

            const title =
                (complaint.title || "")
                    .toLowerCase();

            const description =
                (complaint.description || "")
                    .toLowerCase();

            const complaintStatus =
                (complaint.status || "")
                    .toLowerCase();

            const complaintCategory =
                (complaint.category || "")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                title.includes(search) ||
                description.includes(search);


            const matchesStatus =
                status === "all" ||
                complaintStatus === status;


            const matchesCategory =
                category === "all" ||
                complaintCategory === category;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });


    renderComplaints(filtered);

}


/* =========================
   CATEGORY ICON
========================= */

function getCategoryIcon(category) {

    const value =
        (category || "").toLowerCase();


    if (value.includes("electrical")) {

        return {
            className: "electrical",
            icon: "fa-solid fa-bolt"
        };

    }


    if (value.includes("plumbing")) {

        return {
            className: "plumbing",
            icon: "fa-solid fa-droplet"
        };

    }


    if (value.includes("internet") ||
        value.includes("wifi")) {

        return {
            className: "internet",
            icon: "fa-solid fa-wifi"
        };

    }


    if (value.includes("furniture")) {

        return {
            className: "furniture",
            icon: "fa-solid fa-chair"
        };

    }


    if (value.includes("clean")) {

        return {
            className: "cleaning",
            icon: "fa-solid fa-broom"
        };

    }


    return {
        className: "electrical",
        icon: "fa-solid fa-circle-exclamation"
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
   FORMAT DATE
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Recently reported";
    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {
        return "Recently reported";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================
   HTML SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}
/* =========================
   COMPLAINT DETAILS POPUP
========================= */

function showComplaintDetails(complaint) {

    const existingModal =
        document.querySelector(
            ".complaint-details-overlay"
        );

    if (existingModal) {
        existingModal.remove();
    }

    const overlay =
        document.createElement("div");

    overlay.className =
        "complaint-details-overlay";

    const icon =
        getCategoryIcon(
            complaint.category || ""
        );

    const statusClass =
        getStatusClass(
            complaint.status || "Pending"
        );

    const date =
        formatDate(
            complaint.created_at
        );

    overlay.innerHTML = `

        <div class="complaint-details-modal">

            <button
                class="details-close"
                type="button"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="details-icon">
                <i class="${icon.icon}"></i>
            </div>

            <h2>
                ${escapeHTML(
                    complaint.title ||
                    "Complaint Details"
                )}
            </h2>

            <span class="details-status ${statusClass}">
                ${escapeHTML(
                    complaint.status ||
                    "Pending"
                )}
            </span>

            <div class="details-section">

                <h4>Description</h4>

                <p>
                    ${escapeHTML(
                        complaint.description ||
                        "No description provided."
                    )}
                </p>

            </div>

            <div class="details-section">

                <h4>Location</h4>

                <p>
                    ${escapeHTML(
                        complaint.location ||
                        "Not specified"
                    )}
                </p>

            </div>

            <div class="details-section">

                <h4>Category</h4>

                <p>
                    ${escapeHTML(
                        complaint.category ||
                        "Not specified"
                    )}
                </p>

            </div>

            <div class="details-section">

                <h4>Priority</h4>

                <p>
                    ${escapeHTML(
                        complaint.priority ||
                        "Not specified"
                    )}
                </p>

            </div>

            <div class="details-section">

                <h4>Date</h4>

                <p>
                    ${date}
                </p>

            </div>

            <button
                class="details-close-button"
                type="button"
            >
                Close
            </button>

        </div>

    `;

    document.body.appendChild(overlay);


    /* Close X */

    overlay
        .querySelector(".details-close")
        .addEventListener(
            "click",
            function () {
                overlay.remove();
            }
        );


    /* Close button */

    overlay
        .querySelector(".details-close-button")
        .addEventListener(
            "click",
            function () {
                overlay.remove();
            }
        );


    /* Click outside */

    overlay.addEventListener(
        "click",
        function (event) {

            if (event.target === overlay) {
                overlay.remove();
            }

        }
    );


    /* Escape */

    function closeWithEscape(event) {

        if (event.key === "Escape") {

            overlay.remove();

            document.removeEventListener(
                "keydown",
                closeWithEscape
            );

        }

    }

    document.addEventListener(
        "keydown",
        closeWithEscape
    );

}