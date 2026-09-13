document.addEventListener("DOMContentLoaded", function () {

    const savedUser =
        localStorage.getItem("campusFixUser");

    // No logged-in user
    if (!savedUser) {
        return;
    }

    let user;

    try {

        user = JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Invalid CampusFix user session:",
            error
        );

        return;

    }


    const name =
        user.name || "Student";


    // ==========================================
    // PROFILE AVATAR
    // ==========================================

    const avatars =
        document.querySelectorAll(
            ".profile-avatar"
        );


    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word =>
                word.charAt(0).toUpperCase()
            )
            .join("") || "ST";


    avatars.forEach(function (avatar) {

        avatar.textContent =
            initials;

    });


    // ==========================================
    // PROFILE NAME
    // ==========================================

    const profileNames =
        document.querySelectorAll(
            ".profile-info strong, .profile-details strong"
        );


    profileNames.forEach(function (element) {

        element.textContent =
            name;

    });


    // ==========================================
    // ACCOUNT LABEL
    // ==========================================

    const accountLabels =
        document.querySelectorAll(
            ".profile-info small, .profile-details small"
        );


    accountLabels.forEach(function (element) {

        if (user.role === "admin") {

            element.textContent =
                "Administrator";

        } else {

            element.textContent =
                "Student Account";

        }

    });


    // ==========================================
    // WELCOME MESSAGE
    // ==========================================

    const welcomeHeading =
        document.querySelector(
            ".welcome-section h1"
        );


    if (welcomeHeading) {

        const hour =
            new Date().getHours();


        let greeting;


        if (hour < 12) {

            greeting =
                "Good morning";

        } else if (hour < 17) {

            greeting =
                "Good afternoon";

        } else {

            greeting =
                "Good evening";

        }


        welcomeHeading.textContent =
            `${greeting}, ${name} 👋`;

    }

});