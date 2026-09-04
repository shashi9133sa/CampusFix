
/* =========================================================
   CAMPUSFIX - LOGIN JAVASCRIPT
   ========================================================= */


/* ===================== PAGE LOAD ===================== */

document.addEventListener("DOMContentLoaded", function () {

    initializePasswordToggle();
    initializeLoginForm();

    console.log("🔐 CampusFix Login loaded successfully!");

});


/* ===================== PASSWORD TOGGLE ===================== */

function initializePasswordToggle() {

    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");

    if (!passwordInput || !passwordToggle) {
        return;
    }


    passwordToggle.addEventListener("click", function () {

        const icon = passwordToggle.querySelector("i");


        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


/* ===================== LOGIN FORM ===================== */

function initializeLoginForm() {

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("loginMessage");

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");


        if (!emailInput || !passwordInput) {
            return;
        }


        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();


        /* Clear previous message */

        if (message) {
            message.textContent = "";
        }


        /* Validate email */

        if (!isValidEmail(email)) {

            showLoginMessage(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;
        }


        /* Validate password */

        if (password.length === 0) {

            showLoginMessage(
                "Please enter your password."
            );

            passwordInput.focus();

            return;
        }


        if (password.length < 6) {

            showLoginMessage(
                "Password must contain at least 6 characters."
            );

            passwordInput.focus();

            return;
        }


        /* Show loading state */

        setLoginLoading(true);


        /*
         * TEMPORARY LOGIN
         *
         * Later we will replace this section
         * with a real backend API request.
         */

        setTimeout(function () {

            setLoginLoading(false);

            showLoginSuccess(
                "Login successful! Welcome to CampusFix."
            );


            /*
             * Temporary redirect.
             *
             * Later this will redirect according
             * to the user's role.
             */

            setTimeout(function () {

                window.location.href =
                    "student-dashboard.html";

            }, 1200);


        }, 1200);

    });

}


/* ===================== EMAIL VALIDATION ===================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ===================== SHOW ERROR ===================== */

function showLoginMessage(text) {

    const message =
        document.getElementById("loginMessage");

    if (!message) {
        return;
    }

    message.textContent = text;

}


/* ===================== SHOW SUCCESS ===================== */

function showLoginSuccess(text) {

    const message =
        document.getElementById("loginMessage");

    if (!message) {
        return;
    }


    message.textContent = text;

    message.style.color = "#55d99a";

    message.style.background =
        "rgba(70, 210, 143, 0.05)";

    message.style.border =
        "1px solid rgba(70, 210, 143, 0.15)";

}


/* ===================== LOADING STATE ===================== */

function setLoginLoading(isLoading) {

    const submitButton =
        document.querySelector(".auth-submit");

    if (!submitButton) {
        return;
    }


    const buttonText =
        submitButton.querySelector("span");

    const buttonIcon =
        submitButton.querySelector("i");


    if (isLoading) {

        submitButton.disabled = true;

        submitButton.style.opacity = "0.7";

        if (buttonText) {
            buttonText.textContent = "Signing in...";
        }

        if (buttonIcon) {

            buttonIcon.classList.remove(
                "fa-arrow-right"
            );

            buttonIcon.classList.add(
                "fa-spinner",
                "fa-spin"
            );

        }

    } else {

        submitButton.disabled = false;

        submitButton.style.opacity = "1";

        if (buttonText) {
            buttonText.textContent = "Sign In";
        }

        if (buttonIcon) {

            buttonIcon.classList.remove(
                "fa-spinner",
                "fa-spin"
            );

            buttonIcon.classList.add(
                "fa-arrow-right"
            );

        }

    }

}

