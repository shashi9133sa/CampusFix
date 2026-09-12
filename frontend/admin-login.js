document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("adminLoginForm");

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginButton =
        document.getElementById("adminLoginButton");

    const loginError =
        document.getElementById("loginError");


    /* =========================
       PASSWORD TOGGLE
    ========================= */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const icon =
                    passwordToggle.querySelector("i");

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    if (icon) {
                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );
                    }

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    passwordInput.type = "password";

                    if (icon) {
                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }

                    passwordToggle.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }
            }
        );
    }


    /* =========================
       ADMIN LOGIN
    ========================= */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;


                if (!email || !password) {
                    showError(
                        "Please enter your email and password."
                    );
                    return;
                }


                loginButton.disabled = true;

                loginButton.innerHTML = `
                    <span>Signing in...</span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;

                hideError();


                try {

                    const response =
                        await fetch(
                            "http://localhost:5000/api/users/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                })
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Invalid administrator credentials."
                        );
                    }


                    /*
                     * Only allow admin accounts
                     */

                    if (
                        !result.user ||
                        result.user.role !== "admin"
                    ) {

                        throw new Error(
                            "This account does not have administrator access."
                        );
                    }


                    /*
                     * Save logged-in user
                     */

                    localStorage.setItem(
                        "campusFixUser",
                        JSON.stringify(result.user)
                    );


                    /*
                     * Redirect to admin dashboard
                     */

                    window.location.href =
                        "admin-dashboard.html";


                } catch (error) {

                    console.error(
                        "Admin login error:",
                        error
                    );

                    showError(
                        error.message ||
                        "Unable to login. Please try again."
                    );


                    loginButton.disabled = false;

                    loginButton.innerHTML = `
                        <span>Sign In</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    `;
                }
            }
        );
    }


    /* =========================
       ERROR FUNCTIONS
    ========================= */

    function showError(message) {

        if (!loginError) return;

        const errorText =
            loginError.querySelector("span");

        if (errorText) {
            errorText.textContent = message;
        }

        loginError.classList.add("show");
    }


    function hideError() {

        if (!loginError) return;

        loginError.classList.remove("show");
    }

});