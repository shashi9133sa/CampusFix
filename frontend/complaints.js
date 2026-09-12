document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // MOBILE MENU
    // =========================

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    if (menuButton && sidebar) {
        menuButton.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }


    // =========================
    // LOAD SAVED COMPLAINTS
    // =========================

    loadComplaints();


    // =========================
    // FILTERS
    // =========================

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", applyFilters);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilters);
    }


    // =========================
    // LOGOUT
    // =========================

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

});


// =====================================================
// LOAD COMPLAINTS
// =====================================================

async function loadComplaints() {

    const container =
        document.getElementById("complaintsContainer");

    if (!container) return;

    // Get logged-in student
    let loggedInUser = null;

    try {
        const savedUser =
            localStorage.getItem("campusFixUser");

        if (savedUser) {
            loggedInUser = JSON.parse(savedUser);
            console.log("Logged-in user:", loggedInUser);
console.log("Student ID:", loggedInUser.id);
        }
    } catch (error) {
        console.error("User data error:", error);
    }

    if (!loggedInUser || !loggedInUser.id) {
        window.location.href = "login.html";
        return;
    }

    let savedComplaints = [];

    try {

        const response = await fetch(
            "https://campusfix-obdm.onrender.com/api/complaints/all"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        savedComplaints = await response.json();

        // Show only this student's complaints
        savedComplaints = savedComplaints.filter(
            complaint =>
                Number(complaint.user_id) === Number(loggedInUser.id)
        );

        console.log(
            "Student complaints loaded:",
            savedComplaints
        );

    } catch (error) {

        console.error(
            "Could not load complaints:",
            error
        );

        container.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <h3>Unable to load complaints</h3>
                <p>Please make sure the CampusFix backend is running.</p>
            </div>
        `;

        return;
    }

    // Remove old dummy/static complaints
container
.querySelectorAll(".complaint-card")
.forEach(card => card.remove());

    // Create complaint cards
    savedComplaints
        .slice()
        .reverse()
        .forEach(complaint => {

            const card =
                createComplaintCard(complaint);

            container.appendChild(card);

        });

    // Connect View Details buttons
    initializeViewButtons();

    // Apply filters
    applyFilters();
}

// =====================================================
// CREATE COMPLAINT CARD
// =====================================================

function createComplaintCard(complaint) {

    const article =
        document.createElement("article");


    article.className =
        "complaint-card dynamic-complaint";


    // Status

    const status =
        complaint.status || "Pending";

    const statusClass =
        getStatusClass(status);


    // Category

    const category =
        complaint.category || "Other";

    const categoryClass =
        getCategoryClass(category);

    const categoryIcon =
        getCategoryIcon(category);


    // Date

    const date =
        complaint.date || getCurrentDate();


    article.dataset.status =
        statusClass;

    article.dataset.category =
        category;


    // Same structure as your original HTML

    article.innerHTML = `

        <div class="complaint-icon ${categoryClass}">

            <i class="${categoryIcon}"></i>

        </div>


        <div class="complaint-details">

            <div class="complaint-title-row">

                <h3>
                    ${escapeHTML(complaint.title || "Untitled Complaint")}
                </h3>

                <span class="status ${statusClass}">
                    ${escapeHTML(status)}
                </span>

            </div>


            <p class="complaint-description">

                ${escapeHTML(
                    complaint.description ||
                    "No description provided."
                )}

            </p>


            <div class="complaint-meta">

                <span>

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHTML(
                        complaint.location ||
                        "Location not specified"
                    )}

                </span>


                <span>

                    <i class="fa-regular fa-calendar"></i>

                    ${escapeHTML(date)}

                </span>


                <span>

                    <i class="fa-solid fa-tag"></i>

                    ${escapeHTML(category)}

                </span>

            </div>

        </div>


        <button class="view-button" type="button">

            View Details

            <i class="fa-solid fa-arrow-right"></i>

        </button>

    `;


    // Store complete complaint data directly on card

    article.complaintData = complaint;


    return article;
}


// =====================================================
// CATEGORY ICON
// =====================================================

function getCategoryIcon(category) {

    const value =
        category.toLowerCase();


    if (value.includes("electrical")) {
        return "fa-solid fa-bolt";
    }

    if (value.includes("plumbing")) {
        return "fa-solid fa-droplet";
    }

    if (value.includes("internet") ||
        value.includes("wifi")) {
        return "fa-solid fa-wifi";
    }

    if (value.includes("furniture")) {
        return "fa-solid fa-chair";
    }

    if (value.includes("cleanliness")) {
        return "fa-solid fa-broom";
    }

    return "fa-solid fa-circle-exclamation";
}


// =====================================================
// CATEGORY CSS CLASS
// =====================================================

function getCategoryClass(category) {

    const value =
        category.toLowerCase();


    if (value.includes("electrical")) {
        return "electrical";
    }

    if (value.includes("plumbing")) {
        return "plumbing";
    }

    if (value.includes("internet") ||
        value.includes("wifi")) {
        return "internet";
    }

    if (value.includes("furniture")) {
        return "furniture";
    }

    return "electrical";
}


// =====================================================
// STATUS CSS CLASS
// =====================================================

function getStatusClass(status) {

    const value =
        status.toLowerCase();


    if (value.includes("progress")) {
        return "progress";
    }

    if (value.includes("resolved")) {
        return "resolved";
    }

    return "pending";
}


// =====================================================
// VIEW DETAILS
// =====================================================

function initializeViewButtons() {

    const buttons =
        document.querySelectorAll(".view-button");


    buttons.forEach(button => {

        // Prevent duplicate listeners

        if (button.dataset.connected === "true") {
            return;
        }

        button.dataset.connected = "true";


        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();


            const card =
                this.closest(".complaint-card");


            if (!card) {
                console.error("Complaint card not found.");
                return;
            }


            // For new complaints

            if (card.complaintData) {

                showComplaintDetails(
                    card.complaintData
                );

                return;
            }


            // For original static complaints

            const title =
                card.querySelector("h3")?.textContent.trim()
                || "Complaint";


            const description =
                card.querySelector(
                    ".complaint-description"
                )?.textContent.trim()
                || "No description available.";


            const status =
                card.querySelector(".status")
                ?.textContent.trim()
                || "Pending";


            const meta =
                card.querySelectorAll(
                    ".complaint-meta span"
                );


            const location =
                meta[0]?.textContent.trim()
                || "Not specified";


            const date =
                meta[1]?.textContent.trim()
                || "Not specified";


            const category =
                meta[2]?.textContent.trim()
                || "Not specified";


            showComplaintDetails({

                title,
                description,
                status,
                location,
                date,
                category

            });

        });

    });
}


// =====================================================
// DETAILS MODAL
// =====================================================

function showComplaintDetails(complaint) {

    // Remove existing modal

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


    const categoryIcon =
        getCategoryIcon(
            complaint.category || ""
        );


    const statusClass =
        getStatusClass(
            complaint.status || "Pending"
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

                <i class="${categoryIcon}"></i>

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

                <h4>Date</h4>

                <p>

                    ${escapeHTML(
                        complaint.date ||
                        "Not specified"
                    )}

                </p>

            </div>


            ${
                complaint.priority
                ? `
                    <div class="details-section">

                        <h4>Priority</h4>

                        <p>
                            ${escapeHTML(
                                complaint.priority
                            )}
                        </p>

                    </div>
                `
                : ""
            }


            <button
                class="details-close-button"
                type="button"
            >

                Close

            </button>

        </div>

    `;


    document.body.appendChild(overlay);


    // Close X

    const closeButton =
        overlay.querySelector(".details-close");


    closeButton.addEventListener(
        "click",
        closeDetailsModal
    );


    // Close button

    const bottomClose =
        overlay.querySelector(
            ".details-close-button"
        );


    bottomClose.addEventListener(
        "click",
        closeDetailsModal
    );


    // Click outside modal

    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {
                closeDetailsModal();
            }

        }
    );


    // Escape key

    document.addEventListener(
        "keydown",
        handleEscape
    );


    function closeDetailsModal() {

        overlay.remove();

        document.removeEventListener(
            "keydown",
            handleEscape
        );

    }


    function handleEscape(event) {

        if (event.key === "Escape") {
            closeDetailsModal();
        }

    }
}


// =====================================================
// FILTERS
// =====================================================

function applyFilters() {

    const searchInput =
        document.getElementById("searchInput");


    const statusFilter =
        document.getElementById("statusFilter");


    const categoryFilter =
        document.getElementById("categoryFilter");


    const noResults =
        document.getElementById("noResults");


    const search =
        searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";


    const selectedStatus =
        statusFilter
        ? statusFilter.value.toLowerCase()
        : "all";


    const selectedCategory =
        categoryFilter
        ? categoryFilter.value.toLowerCase()
        : "all";


    const cards =
        document.querySelectorAll(
            ".complaint-card"
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();


        const status =
            card.dataset.status || "";


        const category =
            (card.dataset.category || "")
            .toLowerCase();


        const matchesSearch =
            text.includes(search);


        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;


        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        if (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        ) {

            card.style.display = "flex";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
            ? "block"
            : "none";

    }
}


// =====================================================
// CURRENT DATE
// =====================================================

function getCurrentDate() {

    const now =
        new Date();


    return now.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


// =====================================================
// SECURITY
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
