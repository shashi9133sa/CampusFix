/* =========================================================
   CAMPUSFIX - LOGIN JAVASCRIPT
   ========================================================= */

   let selectedRole = "student";


   /* ===================== PAGE LOAD ===================== */
   
   document.addEventListener("DOMContentLoaded", function () {
   
       initializeAccountType();
       initializePasswordToggle();
       initializeLoginForm();
   
       console.log("🔐 CampusFix Login loaded successfully!");
   
   });
   
   
   /* ===================== ACCOUNT TYPE SWITCH ===================== */
   
   function initializeAccountType() {
   
       const studentOption =
           document.getElementById("studentOption");
   
       const adminOption =
           document.getElementById("adminOption");
   
       const accountSwitch =
           document.querySelector(".account-switch");
   
   
       if (studentOption) {
   
           studentOption.addEventListener("click", function () {
   
               selectedRole = "student";
   
               studentOption.classList.add("active");
   
               if (adminOption) {
                   adminOption.classList.remove("active");
               }
   
               if (accountSwitch) {
                   accountSwitch.classList.remove(
                       "admin-selected"
                   );
               }
   
           });
   
       }
   
   
       if (adminOption) {
   
           adminOption.addEventListener("click", function () {
   
               selectedRole = "admin";
   
               adminOption.classList.add("active");
   
               if (studentOption) {
                   studentOption.classList.remove("active");
               }
   
               if (accountSwitch) {
                   accountSwitch.classList.add(
                       "admin-selected"
                   );
               }
   
           });
   
       }
   
   }
   
   
   /* ===================== PASSWORD TOGGLE ===================== */
   
   function initializePasswordToggle() {
   
       const passwordInput =
           document.getElementById("password");
   
       const passwordToggle =
           document.getElementById("passwordToggle");
   
   
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
                       icon.classList.remove("fa-eye");
                       icon.classList.add("fa-eye-slash");
                   }
   
                   passwordToggle.setAttribute(
                       "aria-label",
                       "Hide password"
                   );
   
               } else {
   
                   passwordInput.type = "password";
   
                   if (icon) {
                       icon.classList.remove("fa-eye-slash");
                       icon.classList.add("fa-eye");
                   }
   
                   passwordToggle.setAttribute(
                       "aria-label",
                       "Show password"
                   );
   
               }
   
           }
       );
   
   }
   
   
   /* ===================== LOGIN FORM ===================== */
   
   function initializeLoginForm() {
   
       const loginForm =
           document.getElementById("loginForm");
   
       const message =
           document.getElementById("loginMessage");
   
   
       if (!loginForm) {
           return;
       }
   
   
       loginForm.addEventListener(
           "submit",
           async function (event) {
   
               event.preventDefault();
   
   
               const emailInput =
                   document.getElementById("email");
   
               const passwordInput =
                   document.getElementById("password");
   
   
               if (!emailInput || !passwordInput) {
                   return;
               }
   
   
               const email =
                   emailInput.value.trim();
   
               const password =
                   passwordInput.value.trim();
   
   
               /* Clear previous message */
   
               if (message) {
   
                   message.textContent = "";
   
                   message.style.color = "";
                   message.style.background = "";
                   message.style.border = "";
   
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
   
   
               /* Show loading */
   
               setLoginLoading(true);
   
   
               /* =========================
                  BACKEND LOGIN
               ========================= */
   
               try {
   
                   const response =
                       await fetch(
                           "https://campusfix-obdm.onrender.com/api/users/login",
                           {
                               method: "POST",
   
                               headers: {
                                   "Content-Type":
                                       "application/json"
                               },
   
                               body: JSON.stringify({
   
                                   email: email,
   
                                   password: password,
   
                                   role: selectedRole
   
                               })
                           }
                       );
   
   
                   const result =
                       await response.json();
   
   
                   if (!response.ok) {
   
                       throw new Error(
                           result.message ||
                           "Invalid email or password."
                       );
   
                   }
   
   
                   /* Save logged-in user */
   
                   localStorage.setItem(
                       "campusFixUser",
                       JSON.stringify(result.user)
                   );
   
   
                   setLoginLoading(false);
   
   
                   showLoginSuccess(
                       "Login successful! Welcome to CampusFix."
                   );
   
   
                   /* =========================
                      ROLE-BASED REDIRECT
                   ========================= */
   
                   setTimeout(function () {
   
                       if (result.user.role === "admin") {
   
                           window.location.href =
                               "admin-dashboard.html";
   
                       } else {
   
                           window.location.href =
                               "student-dashboard.html";
   
                       }
   
                   }, 1000);
   
   
               } catch (error) {
   
                   console.error(
                       "Login error:",
                       error
                   );
   
   
                   setLoginLoading(false);
   
   
                   showLoginMessage(
                       error.message ||
                       "Unable to login. Please try again."
                   );
   
               }
   
           }
       );
   
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
   
       message.style.color = "";
       message.style.background = "";
       message.style.border = "";
   
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
