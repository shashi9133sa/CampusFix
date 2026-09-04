
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
    // INITIAL SETUP
    // ==========================================

    setupReadButtons();

    setupDeleteButtons();

    updateCounts();

    applyFilters();

});

