/* =========================================================
   CAMPUSFIX - ADMIN ACCESS GUARD
   ========================================================= */

   (function () {

    const savedUser =
        localStorage.getItem("campusFixUser");


    if (!savedUser) {

        window.location.href =
            "login.html";

        return;

    }


    try {

        const user =
            JSON.parse(savedUser);


        if (!user || user.role !== "admin") {

            localStorage.removeItem(
                "campusFixUser"
            );

            window.location.href =
                "login.html";

        }

    } catch (error) {

        console.error(
            "Invalid authentication data:",
            error
        );


        localStorage.removeItem(
            "campusFixUser"
        );


        window.location.href =
            "login.html";

    }

})();