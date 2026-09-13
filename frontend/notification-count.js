document.addEventListener("DOMContentLoaded", async function () {

    const savedUser = localStorage.getItem("campusFixUser");

    if (!savedUser) {
        return;
    }

    let user;

    try {
        user = JSON.parse(savedUser);
    } catch (error) {
        console.error("Invalid CampusFix user session");
        return;
    }

    try {

        const response = await fetch(
            "https://campusfix-obdm.onrender.com/api/complaints/all"
        );

        if (!response.ok) {
            throw new Error("Failed to load complaints");
        }

        const complaints = await response.json();


        // ==========================================
        // ONLY LOGGED-IN USER'S COMPLAINTS
        // ==========================================

        const myComplaints = complaints.filter(function (complaint) {

            return Number(complaint.user_id) ===
                Number(user.id);

        });


        // ==========================================
        // TOTAL COMPLAINTS
        // ==========================================

        const totalComplaints =
            myComplaints.length;


        // ==========================================
        // GET READ NOTIFICATIONS
        // ==========================================

        const readKey =
            `campusFixReadNotifications_${user.id}`;

        let readNotifications = [];

        try {

            readNotifications =
                JSON.parse(
                    localStorage.getItem(readKey) || "[]"
                );

        } catch (error) {

            readNotifications = [];

        }


        // ==========================================
        // UNREAD NOTIFICATIONS
        // ==========================================

        const unreadCount =
            myComplaints.filter(function (complaint) {

                return !readNotifications.includes(
                    String(complaint.id)
                );

            }).length;


        // ==========================================
        // MY COMPLAINTS SIDEBAR
        // ==========================================

        document
            .querySelectorAll(".notification-count")
            .forEach(function (element) {

                const parentText =
                    element.parentElement?.textContent
                        ?.toLowerCase() || "";


                if (parentText.includes("my complaints")) {

                    element.textContent =
                        totalComplaints;

                }


                if (parentText.includes("notifications")) {

                    element.textContent =
                        unreadCount;

                }

            });


        // ==========================================
        // NOTIFICATION SIDEBAR COUNT
        // ==========================================

        const sidebarNotificationCount =
            document.getElementById(
                "sidebarNotificationCount"
            );

        if (sidebarNotificationCount) {

            sidebarNotificationCount.textContent =
                unreadCount;

        }


        // ==========================================
        // NOTIFICATION SUMMARY
        // ==========================================

        const totalNotifications =
            document.getElementById(
                "totalNotifications"
            );

        if (totalNotifications) {

            totalNotifications.textContent =
                totalComplaints;

        }


        const unreadNotifications =
            document.getElementById(
                "unreadNotifications"
            );

        if (unreadNotifications) {

            unreadNotifications.textContent =
                unreadCount;

        }


        console.log("CampusFix dynamic counts:", {

            totalComplaints:
                totalComplaints,

            unreadNotifications:
                unreadCount,

            readNotifications:
                readNotifications

        });

    } catch (error) {

        console.error(
            "Failed to update CampusFix counts:",
            error
        );

    }

});