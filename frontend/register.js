/* =========================================================
   CAMPUSFIX - STUDENT REGISTRATION
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {

    initializePasswordToggle(
        "password",
        "passwordToggle"
    );

    initializePasswordToggle(
        "confirmPassword",
        "confirmPasswordToggle"
    );

    initializeRegisterForm();

    console.log("📝 CampusFix Registration loaded!");

});


/* =========================
   PASSWORD TOGGLE
   ========================= */

function initializePasswordToggle(
    inputId,
    buttonId
) {

    const passwordInput =
        document.getElementById(inputId);

    const passwordToggle =
        document.getElementById(buttonId);

    if (!passwordInput || !passwordToggle) {
        return;
    }

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
   REGISTER FORM
   ========================= */

function initializeRegisterForm() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameInput =
                document.getElementById("name");

            const studentIdInput =
                document.getElementById("studentId");

            const emailInput =
                document.getElementById("email");

            const departmentInput =
                document.getElementById("department");

            const yearInput =
                document.getElementById("year");

            const passwordInput =
                document.getElementById("password");

            const confirmPasswordInput =
                document.getElementById(
                    "confirmPassword"
                );

            const termsInput =
                document.getElementById("terms");


            if (
                !nameInput ||
                !studentIdInput ||
                !emailInput ||
                !departmentInput ||
                !yearInput ||
                !passwordInput ||
                !confirmPasswordInput ||
                !termsInput
            ) {
                return;
            }


            const name =
                nameInput.value.trim();

            const studentId =
                studentIdInput.value.trim();

            const email =
                emailInput.value.trim();

            const department =
                departmentInput.value;

            const year =
                yearInput.value;

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            clearRegisterMessage();


            /* =========================
               VALIDATION
               ========================= */

            if (name.length < 3) {

                showRegisterMessage(
                    "Please enter your full name."
                );

                nameInput.focus();

                return;

            }


            if (studentId.length < 2) {

                showRegisterMessage(
                    "Please enter your student ID."
                );

                studentIdInput.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showRegisterMessage(
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;

            }


            if (!department) {

                showRegisterMessage(
                    "Please select your department."
                );

                departmentInput.focus();

                return;

            }


            if (!year) {

                showRegisterMessage(
                    "Please select your year of study."
                );

                yearInput.focus();

                return;

            }


            if (password.length < 6) {

                showRegisterMessage(
                    "Password must contain at least 6 characters."
                );

                passwordInput.focus();

                return;

            }


            if (password !== confirmPassword) {

                showRegisterMessage(
                    "Passwords do not match."
                );

                confirmPasswordInput.focus();

                return;

            }


            if (!termsInput.checked) {

                showRegisterMessage(
                    "Please accept the CampusFix usage agreement."
                );

                termsInput.focus();

                return;

            }


            /* =========================
               LOADING
               ========================= */

            setRegisterLoading(true);


            try {

                const response =
                    await fetch(
                        "https://campusfix-obdm.onrender.com/api/users",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password,

                                role: "student",

                                student_id: studentId,

                                department: department,

                                year: year

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to create your account."
                    );

                }


                setRegisterLoading(false);


                showRegisterSuccess(
                    "Account created successfully! Redirecting to login..."
                );


                registerForm.reset();


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                setRegisterLoading(false);


                showRegisterMessage(
                    error.message ||
                    "Unable to create your account. Please try again."
                );

            }

        }
    );

}


/* =========================
   EMAIL VALIDATION
   ========================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* =========================
   ERROR MESSAGE
   ========================= */

function showRegisterMessage(text) {

    const message =
        document.getElementById(
            "registerMessage"
        );

    if (!message) {
        return;
    }


    message.textContent = text;

    message.style.color = "#ff7d8d";

    message.style.background =
        "rgba(255, 80, 100, 0.06)";

    message.style.border =
        "1px solid rgba(255, 80, 100, 0.15)";

    message.style.padding =
        "10px 12px";

}


/* =========================
   SUCCESS MESSAGE
   ========================= */

function showRegisterSuccess(text) {

    const message =
        document.getElementById(
            "registerMessage"
        );

    if (!message) {
        return;
    }


    message.textContent = text;

    message.style.color = "#55d99a";

    message.style.background =
        "rgba(70, 210, 143, 0.05)";

    message.style.border =
        "1px solid rgba(70, 210, 143, 0.15)";

    message.style.padding =
        "10px 12px";

}


/* =========================
   CLEAR MESSAGE
   ========================= */

function clearRegisterMessage() {

    const message =
        document.getElementById(
            "registerMessage"
        );

    if (!message) {
        return;
    }


    message.textContent = "";

    message.style.color = "";

    message.style.background = "";

    message.style.border = "";

    message.style.padding = "";

}


/* =========================
   LOADING STATE
   ========================= */

function setRegisterLoading(
    isLoading
) {

    const submitButton =
        document.querySelector(
            ".auth-submit"
        );

    if (!submitButton) {
        return;
    }


    const buttonText =
        submitButton.querySelector(
            "span"
        );

    const buttonIcon =
        submitButton.querySelector(
            "i"
        );


    if (isLoading) {

        submitButton.disabled = true;

        submitButton.style.opacity =
            "0.7";


        if (buttonText) {

            buttonText.textContent =
                "Creating account...";

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

        submitButton.style.opacity =
            "1";


        if (buttonText) {

            buttonText.textContent =
                "Create Account";

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