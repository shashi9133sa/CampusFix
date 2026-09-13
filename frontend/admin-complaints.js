/* =========================================================
   CAMPUSFIX - ADMIN COMPLAINT MANAGEMENT
   ========================================================= */

   let allComplaints = [];
   let selectedComplaintId = null;
   
   
   /* =========================
      PAGE LOAD
   ========================= */
   
   document.addEventListener("DOMContentLoaded", function () {
   
       initializeMobileMenu();
       initializeLogout();
       initializeFilters();
       initializeRefresh();
       initializeModal();
   
       loadComplaints();
   
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
      LOAD COMPLAINTS
   ========================= */
   
   async function loadComplaints() {
   
       const tableBody =
           document.getElementById(
               "complaintsTableBody"
           );
   
       if (tableBody) {
   
           tableBody.innerHTML = `
               <tr>
                   <td colspan="7" class="loading-cell">
                       <i class="fa-solid fa-spinner fa-spin"></i>
                       Loading complaints...
                   </td>
               </tr>
           `;
   
       }
   
       try {
   
           const response =
               await fetch(
                   "https://campusfix-obdm.onrender.com/api/complaints/all"
               );
   
           if (!response.ok) {
               throw new Error(
                   "Failed to load complaints."
               );
           }
   
           allComplaints =
               await response.json();
   
           renderComplaints(allComplaints);
   
       } catch (error) {
   
           console.error(
               "Complaint loading error:",
               error
           );
   
           if (tableBody) {
   
               tableBody.innerHTML = `
                   <tr>
                       <td colspan="7" class="loading-cell">
                           <i class="fa-solid fa-triangle-exclamation"></i>
                           Unable to load complaints.
                       </td>
                   </tr>
               `;
   
           }
   
           updateComplaintCount(0);
   
       }
   
   }
   
   
   /* =========================
      RENDER COMPLAINTS
   ========================= */
   
   function renderComplaints(
       complaints
   ) {
   
       const tableBody =
           document.getElementById(
               "complaintsTableBody"
           );
   
       if (!tableBody) {
           return;
       }
   
       tableBody.innerHTML = "";
   
       updateComplaintCount(
           complaints.length
       );
   
   
       if (complaints.length === 0) {
   
           tableBody.innerHTML = `
               <tr>
                   <td
                       colspan="7"
                       class="loading-cell"
                   >
                       <i class="fa-solid fa-inbox"></i>
                       No complaints found.
                   </td>
               </tr>
           `;
   
           return;
   
       }
   
   
       complaints.forEach(function (complaint) {
   
           const row =
               document.createElement("tr");
   
           const status =
               complaint.status || "Pending";
   
           const priority =
               complaint.priority || "Medium";
   
           const category =
               complaint.category || "Other";
   
           row.innerHTML = `
   
               <td>
   
                   <div class="complaint-title">
   
                       ${escapeHTML(
                           complaint.title ||
                           "Untitled Complaint"
                       )}
   
                   </div>
   
                   <span class="complaint-id">
   
                       ID:
                       ${escapeHTML(
                           complaint.id
                       )}
   
                   </span>
   
               </td>
   
   
               <td>
   
                   ${escapeHTML(category)}
   
               </td>
   
   
               <td>
   
                   <span class="${getPriorityClass(
                       priority
                   )}">
   
                       ${escapeHTML(priority)}
   
                   </span>
   
               </td>
   
   
               <td>

    ${escapeHTML(
        complaint.location ||
        "Unknown"
    )}

</td>


<td>

    <div class="complaint-student">

        <i class="fa-solid fa-user"></i>

        <span>
            ${escapeHTML(
                complaint.student_name ||
                "Unknown Student"
            )}
        </span>

    </div>

</td>


<td>

    <span class="badge ${getStatusBadgeClass(
        status
    )}">
   
   
               <td>
   
                   <button
                       class="manage-button"
                       data-id="${escapeHTML(
                           complaint.id
                       )}"
                   >
   
                       <i class="fa-solid fa-pen"></i>
                       Manage
   
                   </button>
   
               </td>
   
           `;
   
   
           tableBody.appendChild(row);
   
       });
   
   
       initializeManageButtons();
   
   }
   
   
   /* =========================
      MANAGE BUTTONS
   ========================= */
   
   function initializeManageButtons() {
   
       const buttons =
           document.querySelectorAll(
               ".manage-button"
           );
   
       buttons.forEach(function (button) {
   
           button.addEventListener(
               "click",
               function () {
   
                   const complaintId =
                       button.dataset.id;
   
                   openStatusModal(
                       complaintId
                   );
   
               }
           );
   
       });
   
   }
   
   
   /* =========================
      FILTERS
   ========================= */
   
   function initializeFilters() {
   
       const searchInput =
           document.getElementById(
               "searchInput"
           );
   
       const statusFilter =
           document.getElementById(
               "statusFilter"
           );
   
       const categoryFilter =
           document.getElementById(
               "categoryFilter"
           );
   
   
       if (searchInput) {
   
           searchInput.addEventListener(
               "input",
               applyFilters
           );
   
       }
   
   
       if (statusFilter) {
   
           statusFilter.addEventListener(
               "change",
               applyFilters
           );
   
       }
   
   
       if (categoryFilter) {
   
           categoryFilter.addEventListener(
               "change",
               applyFilters
           );
   
       }
   
   }
   
   
   /* =========================
      APPLY FILTERS
   ========================= */
   
   function applyFilters() {
   
       const searchInput =
           document.getElementById(
               "searchInput"
           );
   
       const statusFilter =
           document.getElementById(
               "statusFilter"
           );
   
       const categoryFilter =
           document.getElementById(
               "categoryFilter"
           );
   
   
       const search =
           searchInput
               ? searchInput.value
                   .trim()
                   .toLowerCase()
               : "";
   
   
       const selectedStatus =
           statusFilter
               ? statusFilter.value
               : "all";
   
   
       const selectedCategory =
           categoryFilter
               ? categoryFilter.value
               : "all";
   
   
       const filtered =
           allComplaints.filter(
               function (complaint) {
   
                   const title =
                       String(
                           complaint.title || ""
                       ).toLowerCase();
   
                   const id =
                       String(
                           complaint.id || ""
                       ).toLowerCase();
   
                   const location =
                       String(
                           complaint.location || ""
                       ).toLowerCase();
   
                   const category =
                       String(
                           complaint.category || ""
                       );
   
   
                   const matchesSearch =
                       !search ||
                       title.includes(search) ||
                       id.includes(search) ||
                       location.includes(search);
   
   
                   const matchesStatus =
                       selectedStatus === "all" ||
                       normalizeStatus(
                           complaint.status
                       ) === normalizeStatus(
                           selectedStatus
                       );
   
   
                   const matchesCategory =
                       selectedCategory === "all" ||
                       category.toLowerCase() ===
                       selectedCategory.toLowerCase();
   
   
                   return (
                       matchesSearch &&
                       matchesStatus &&
                       matchesCategory
                   );
   
               }
           );
   
   
       renderComplaints(filtered);
   
   }
   
   
   /* =========================
      REFRESH
   ========================= */
   
   function initializeRefresh() {
   
       const refreshButton =
           document.getElementById(
               "refreshBtn"
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
   
               await loadComplaints();
   
               if (icon) {
                   icon.classList.remove("fa-spin");
               }
   
           }
       );
   
   }
   
   
   /* =========================
      STATUS MODAL
   ========================= */
   
   function initializeModal() {
   
       const modal =
           document.getElementById(
               "statusModal"
           );
   
       const closeButton =
           document.getElementById(
               "modalClose"
           );
   
       const cancelButton =
           document.getElementById(
               "modalCancel"
           );
   
   
       if (closeButton) {
   
           closeButton.addEventListener(
               "click",
               closeStatusModal
           );
   
       }
   
   
       if (cancelButton) {
   
           cancelButton.addEventListener(
               "click",
               closeStatusModal
           );
   
       }
   
   
       if (modal) {
   
           modal.addEventListener(
               "click",
               function (event) {
   
                   if (event.target === modal) {
                       closeStatusModal();
                   }
   
               }
           );
   
       }
   
   
       const statusButtons =
           document.querySelectorAll(
               ".status-option"
           );
   
   
       statusButtons.forEach(function (button) {
   
           button.addEventListener(
               "click",
               function () {
   
                   const status =
                       button.dataset.status;
   
                   updateComplaintStatus(
                       status
                   );
   
               }
           );
   
       });
   
   }
   
   
   /* =========================
      OPEN MODAL
   ========================= */
   
   function openStatusModal(
       complaintId
   ) {
   
       const modal =
           document.getElementById(
               "statusModal"
           );
   
       const hiddenInput =
           document.getElementById(
               "selectedComplaintId"
           );
   
       const titleElement =
           document.getElementById(
               "modalComplaintTitle"
           );
   
   
       const complaint =
           allComplaints.find(
               function (item) {
   
                   return String(item.id) ===
                       String(complaintId);
   
               }
           );
   
   
       if (!complaint) {
           return;
       }
   
   
       selectedComplaintId =
           complaintId;
   
   
       if (hiddenInput) {
   
           hiddenInput.value =
               complaintId;
   
       }
   
   
       if (titleElement) {
   
           titleElement.textContent =
               complaint.title ||
               "Select a new status.";
   
       }
   
   
       if (modal) {
   
           modal.classList.add("show");
   
       }
   
   }
   
   
   /* =========================
      CLOSE MODAL
   ========================= */
   
   function closeStatusModal() {
   
       const modal =
           document.getElementById(
               "statusModal"
           );
   
   
       selectedComplaintId = null;
   
   
       if (modal) {
   
           modal.classList.remove(
               "show"
           );
   
       }
   
   }
   
   
   /* =========================
      UPDATE STATUS
   ========================= */
   
   async function updateComplaintStatus(
       newStatus
   ) {
   
       if (!selectedComplaintId) {
           return;
       }
   
   
       try {
   
           const response =
               await fetch(
                   `https://campusfix-obdm.onrender.com/api/complaints/${encodeURIComponent(
                       selectedComplaintId
                   )}/status`,
                   {
                       method: "PUT",
   
                       headers: {
                           "Content-Type":
                               "application/json"
                       },
   
                       body: JSON.stringify({
                           status: newStatus
                       })
   
                   }
               );
   
   
           const result =
               await response.json();
   
   
           if (!response.ok) {
   
               throw new Error(
                   result.message ||
                   "Failed to update status."
               );
   
           }
   
   
           closeStatusModal();
   
   
           await loadComplaints();
   
   
       } catch (error) {
   
           console.error(
               "Status update error:",
               error
           );
   
   
           alert(
               error.message ||
               "Unable to update complaint status."
           );
   
       }
   
   }
   
   
   /* =========================
      STATUS BADGE
   ========================= */
   
   function getStatusBadgeClass(
       status
   ) {
   
       const value =
           normalizeStatus(status);
   
   
       if (value === "resolved") {
           return "badge-resolved";
       }
   
   
       if (value === "in progress") {
           return "badge-progress";
       }
   
   
       if (value === "rejected") {
           return "badge-rejected";
       }
   
   
       return "badge-pending";
   
   }
   
   
   /* =========================
      PRIORITY CLASS
   ========================= */
   
   function getPriorityClass(
       priority
   ) {
   
       const value =
           String(
               priority || "Medium"
           ).toLowerCase();
   
   
       if (value === "high") {
           return "priority-high";
       }
   
   
       if (value === "low") {
           return "priority-low";
       }
   
   
       return "priority-medium";
   
   }
   
   
   /* =========================
      COUNT
   ========================= */
   
   function updateComplaintCount(
       count
   ) {
   
       const element =
           document.getElementById(
               "complaintCount"
           );
   
   
       if (!element) {
           return;
       }
   
   
       element.textContent =
           `${count} complaint${
               count === 1 ? "" : "s"
           }`;
   
   }
   
   
   /* =========================
      NORMALIZE STATUS
   ========================= */
   
   function normalizeStatus(
       status
   ) {
   
       return String(
           status || "Pending"
       )
           .trim()
           .toLowerCase();
   
   }
   
   
   /* =========================
      HTML ESCAPE
   ========================= */
   
   function escapeHTML(text) {
   
       const div =
           document.createElement(
               "div"
           );
   
       div.textContent =
           text ?? "";
   
       return div.innerHTML;
   
   }
