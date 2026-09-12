
document.addEventListener("DOMContentLoaded", function () {
    initializeMobileMenu();
    initializeSettings();
    initializePasswordButton();
    initializeLogout();
    initializeSidebarLinks();
    initializeNotificationButton();
});


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {
    const menuButton = document.getElementById("menuButton");
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
   SETTINGS
========================= */

function initializeSettings() {
    const saveButton = document.getElementById("saveSettings");
    const switches = document.querySelectorAll(
        '.switch input[type="checkbox"]'
    );

    /* Restore saved settings */

    switches.forEach(function (toggle) {
        const savedValue = localStorage.getItem(toggle.id);

        if (savedValue !== null) {
            toggle.checked = savedValue === "true";
        }
    });

    /* Apply saved appearance */

    applyDarkMode();
    applyCompactMode();


    /* Listen for changes */

    switches.forEach(function (toggle) {

        toggle.addEventListener("change", function () {

            if (toggle.id === "darkMode") {
                applyDarkMode();
            }

            if (toggle.id === "compactView") {
                applyCompactMode();
            }

        });

    });


    /* Save button */

    if (saveButton) {

        saveButton.addEventListener("click", function () {

            switches.forEach(function (toggle) {
                localStorage.setItem(
                    toggle.id,
                    toggle.checked
                );
            });

            applyDarkMode();
            applyCompactMode();

            const originalText = saveButton.innerHTML;

            saveButton.innerHTML =
                '<i class="fa-solid fa-check"></i> Saved!';

            saveButton.classList.add("saved");

            setTimeout(function () {

                saveButton.innerHTML = originalText;
                saveButton.classList.remove("saved");

            }, 1800);

        });

    }
}


/* =========================
   DARK MODE
========================= */

function applyDarkMode() {

    const darkMode = document.getElementById("darkMode");

    if (!darkMode) return;

    document.body.classList.toggle(
        "light-mode",
        !darkMode.checked
    );

}


/* =========================
   COMPACT MODE
========================= */

function applyCompactMode() {

    const compactView = document.getElementById("compactView");

    if (!compactView) return;

    document.body.classList.toggle(
        "compact-mode",
        compactView.checked
    );

}


/* =========================
   PASSWORD
========================= */

function initializePasswordButton() {

    const passwordButton =
        document.getElementById("passwordButton");

    if (!passwordButton) return;

    passwordButton.addEventListener("click", function () {

        showPasswordModal();

    });

}


/* =========================
   PASSWORD MODAL
========================= */

function showPasswordModal() {

    if (document.getElementById("passwordModal")) return;

    const modal = document.createElement("div");

    modal.id = "passwordModal";

    modal.innerHTML = `
        <div class="password-modal-overlay">
            <div class="password-modal">

                <button class="password-modal-close" id="closePasswordModal">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="password-modal-icon">
                    <i class="fa-solid fa-lock"></i>
                </div>

                <h2>Change Password</h2>

                <p>
                    Update your CampusFix account password.
                </p>

                <form id="passwordForm">

                    <div class="password-field">
                        <label>Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            required
                        >
                    </div>

                    <div class="password-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            required
                        >
                    </div>

                    <div class="password-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                        >
                    </div>

                    <button type="submit" class="password-submit">
                        <i class="fa-solid fa-key"></i>
                        Update Password
                    </button>

                </form>

            </div>
        </div>
    `;

    document.body.appendChild(modal);


    /* Close button */

    document
        .getElementById("closePasswordModal")
        .addEventListener("click", function () {

            modal.remove();

        });


    /* Submit password */

    document
        .getElementById("passwordForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            const newPassword =
                document.getElementById("newPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (newPassword.length < 6) {

                alert("Password must contain at least 6 characters.");
                return;

            }

            if (newPassword !== confirmPassword) {

                alert("New passwords do not match.");
                return;

            }

            alert(
                "Password updated successfully!\n\nBackend authentication will be connected later."
            );

            modal.remove();

        });


    /* Close when clicking outside */

    modal
        .querySelector(".password-modal-overlay")
        .addEventListener("click", function (event) {

            if (event.target === this) {
                modal.remove();
            }

        });

}


/* =========================
   LOGOUT
========================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");

    const logoutSettingsButton =
        document.getElementById("logoutSettingsButton");


    function logout() {

        const confirmLogout =
            confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        window.location.href = "login.html";

    }


    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    if (logoutSettingsButton) {
        logoutSettingsButton.addEventListener("click", logout);
    }

}


/* =========================
   SIDEBAR LINKS
========================= */

function initializeSidebarLinks() {

    const links =
        document.querySelectorAll(".nav-link");

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
   NOTIFICATION BUTTON
========================= */

function initializeNotificationButton() {

    const notificationButton =
        document.querySelector(".top-icon");

    if (!notificationButton) return;

    notificationButton.setAttribute(
        "href",
        "notifications.html"
    );

}

