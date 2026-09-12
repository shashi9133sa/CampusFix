/* =========================================================
   CAMPUSFIX - ADMIN USERS JAVASCRIPT
   ========================================================= */

   let allUsers = [];


   /* =========================
      PAGE LOAD
   ========================= */
   
   document.addEventListener("DOMContentLoaded", function () {
   
       initializeMobileMenu();
       initializeLogout();
       initializeSearch();
       initializeRefresh();
   
       loadUsers();
   
   });
   
   
   /* =========================
      MOBILE MENU
   ========================= */
   
   function initializeMobileMenu() {
   
       const menuButton =
           document.getElementById("mobileMenu");
   
       const sidebar =
           document.querySelector(".admin-sidebar");
   
       if (!menuButton || !sidebar) {
           return;
       }
   
       menuButton.addEventListener("click", function () {
   
           sidebar.classList.toggle("mobile-open");
   
           const icon =
               menuButton.querySelector("i");
   
           if (!icon) {
               return;
           }
   
           if (sidebar.classList.contains("mobile-open")) {
   
               icon.classList.remove("fa-bars");
               icon.classList.add("fa-xmark");
   
           } else {
   
               icon.classList.remove("fa-xmark");
               icon.classList.add("fa-bars");
   
           }
   
       });
   
   }
   
   
   /* =========================
      LOGOUT
   ========================= */
   
   function initializeLogout() {
   
       const logoutButton =
           document.getElementById("logoutBtn");
   
       if (!logoutButton) {
           return;
       }
   
       logoutButton.addEventListener("click", function () {
   
           if (!confirm("Are you sure you want to logout?")) {
               return;
           }
   
           localStorage.removeItem("campusFixUser");
   
           window.location.href = "login.html";
   
       });
   
   }
   
   
   /* =========================
      LOAD USERS
   ========================= */
   
   async function loadUsers() {
   
       const tableBody =
           document.getElementById("usersTableBody");
   
       if (tableBody) {
   
           tableBody.innerHTML = `
               <tr>
                   <td colspan="5" class="loading-cell">
                       <i class="fa-solid fa-spinner fa-spin"></i>
                       Loading students...
                   </td>
               </tr>
           `;
   
       }
   
       try {
   
           const response =
               await fetch(
                   "https://campusfix-obdm.onrender.com/api/users/all"
               );
   
           if (!response.ok) {
   
               throw new Error(
                   "Failed to load students."
               );
   
           }
   
           allUsers =
               await response.json();
   
           updateSummary(allUsers);
   
           renderUsers(allUsers);
   
       } catch (error) {
   
           console.error(
               "Users loading error:",
               error
           );
   
           if (tableBody) {
   
               tableBody.innerHTML = `
                   <tr>
                       <td colspan="5" class="loading-cell">
                           <i class="fa-solid fa-triangle-exclamation"></i>
                           Unable to load students.
                       </td>
                   </tr>
               `;
   
           }
   
           updateSummary([]);
   
       }
   
   }
   
   
   /* =========================
      UPDATE SUMMARY
   ========================= */
   
   function updateSummary(users) {
   
       const totalElement =
           document.getElementById("totalStudents");
   
       const studentElement =
           document.getElementById("studentAccounts");
   
   
       const total =
           users.length;
   
   
       const students =
           users.filter(function (user) {
   
               return String(
                   user.role || "student"
               ).toLowerCase() === "student";
   
           }).length;
   
   
       if (totalElement) {
   
           totalElement.textContent =
               total;
   
       }
   
   
       if (studentElement) {
   
           studentElement.textContent =
               students;
   
       }
   
   }
   
   
   /* =========================
      RENDER USERS
   ========================= */
   
   function renderUsers(users) {
   
       const tableBody =
           document.getElementById(
               "usersTableBody"
           );
   
       if (!tableBody) {
           return;
       }
   
   
       tableBody.innerHTML = "";
   
   
       if (users.length === 0) {
   
           tableBody.innerHTML = `
               <tr>
                   <td colspan="5" class="loading-cell">
   
                       <i class="fa-solid fa-users-slash"></i>
   
                       No students found.
   
                   </td>
               </tr>
           `;
   
           return;
   
       }
   
   
       users.forEach(function (user) {
   
           const row =
               document.createElement("tr");
   
   
           const role =
               user.role || "student";
   
   
           const joined =
               formatDate(user.created_at);
   
   
           row.innerHTML = `
   
               <td>
   
                   <div class="student-cell">
   
                       <div class="student-avatar">
   
                           <i class="fa-solid fa-user-graduate"></i>
   
                       </div>
   
                       <div>
   
                           <div class="student-name">
   
                               ${escapeHTML(
                                   user.name ||
                                   "Unnamed User"
                               )}
   
                           </div>
   
                           <span class="student-id">
   
                               ID #${escapeHTML(
                                   String(
                                       user.id || ""
                                   )
                               )}
   
                           </span>
   
                       </div>
   
                   </div>
   
               </td>
   
   
               <td>
   
                   ${escapeHTML(
                       user.email ||
                       "No email"
                   )}
   
               </td>
   
   
               <td>
   
                   <span class="role-badge">
   
                       ${escapeHTML(
                           capitalize(role)
                       )}
   
                   </span>
   
               </td>
   
   
               <td>
   
                   ${escapeHTML(joined)}
   
               </td>
   
   
               <td>
   
                   <span class="account-badge">
   
                       <i class="fa-solid fa-circle-check"></i>
   
                       Active
   
                   </span>
   
               </td>
   
           `;
   
   
           tableBody.appendChild(row);
   
       });
   
   }
   
   
   /* =========================
      SEARCH
   ========================= */
   
   function initializeSearch() {
   
       const searchInput =
           document.getElementById(
               "studentSearch"
           );
   
   
       if (!searchInput) {
           return;
       }
   
   
       searchInput.addEventListener(
           "input",
           function () {
   
               const search =
                   searchInput.value
                       .trim()
                       .toLowerCase();
   
   
               const filtered =
                   allUsers.filter(
                       function (user) {
   
                           const name =
                               String(
                                   user.name || ""
                               ).toLowerCase();
   
   
                           const email =
                               String(
                                   user.email || ""
                               ).toLowerCase();
   
   
                           const id =
                               String(
                                   user.id || ""
                               ).toLowerCase();
   
   
                           return (
                               name.includes(search) ||
                               email.includes(search) ||
                               id.includes(search)
                           );
   
                       }
                   );
   
   
               renderUsers(filtered);
   
           }
       );
   
   }
   
   
   /* =========================
      REFRESH
   ========================= */
   
   function initializeRefresh() {
   
       const refreshButton =
           document.getElementById(
               "refreshUsers"
           );
   
   
       if (!refreshButton) {
           return;
       }
   
   
       refreshButton.addEventListener(
           "click",
           async function () {
   
               const icon =
                   refreshButton.querySelector("i");
   
   
               if (icon) {
                   icon.classList.add("fa-spin");
               }
   
   
               await loadUsers();
   
   
               if (icon) {
                   icon.classList.remove("fa-spin");
               }
   
           }
       );
   
   }
   
   
   /* =========================
      FORMAT DATE
   ========================= */
   
   function formatDate(dateValue) {
   
       if (!dateValue) {
           return "Unknown";
       }
   
   
       const date =
           new Date(dateValue);
   
   
       if (Number.isNaN(date.getTime())) {
           return "Unknown";
       }
   
   
       return date.toLocaleDateString(
           "en-IN",
           {
               day: "2-digit",
               month: "short",
               year: "numeric"
           }
       );
   
   }
   
   
   /* =========================
      CAPITALIZE
   ========================= */
   
   function capitalize(value) {
   
       if (!value) {
           return "";
       }
   
   
       return value.charAt(0).toUpperCase() +
           value.slice(1);
   
   }
   
   
   /* =========================
      HTML ESCAPE
   ========================= */
   
   function escapeHTML(text) {
   
       const div =
           document.createElement("div");
   
       div.textContent =
           text ?? "";
   
       return div.innerHTML;
   
   }
