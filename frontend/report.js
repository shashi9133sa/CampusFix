
document.addEventListener("DOMContentLoaded", function () {
    initializeMobileMenu();
    initializePhotoPreview();
    initializeReportForm();
    initializeLogout();
});


/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        const icon = menuButton.querySelector("i");

        if (!icon) return;

        if (sidebar.classList.contains("open")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

    });
}


/* =========================
   PHOTO PREVIEW
========================= */

function initializePhotoPreview() {

    const photoInput = document.getElementById("photo");
    const previewContainer = document.getElementById("imagePreview");
    const previewImage = document.getElementById("previewImage");
    const removeButton = document.getElementById("removeImage");

    if (!photoInput || !previewContainer) return;

    photoInput.addEventListener("change", function () {

        const file = photoInput.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            photoInput.value = "";

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            alert("Image must be smaller than 5MB.");

            photoInput.value = "";

            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            if (previewImage) {
                previewImage.src = event.target.result;
            }

            previewContainer.style.display = "block";

        };

        reader.readAsDataURL(file);

    });


    if (removeButton) {

        removeButton.addEventListener("click", function () {

            photoInput.value = "";

            if (previewImage) {
                previewImage.src = "";
            }

            previewContainer.style.display = "none";

        });

    }

}


/* =========================
   REPORT FORM
========================= */

function initializeReportForm() {

    const form = document.getElementById("reportForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const titleInput =
            document.getElementById("title");

        const categoryInput =
            document.getElementById("category");

        const priorityInput =
            document.getElementById("priority");

        const locationInput =
            document.getElementById("location");

        const descriptionInput =
            document.getElementById("description");

        const photoInput =
            document.getElementById("photo");


        /* =========================
           VALIDATION
        ========================= */

        const title =
            titleInput.value.trim();

        const category =
            categoryInput.value;

        const priority =
            priorityInput.value;

        const location =
            locationInput.value.trim();

        const description =
            descriptionInput.value.trim();


        if (!title) {

            alert("Please enter an issue title.");
            titleInput.focus();
            return;

        }


        if (!category) {

            alert("Please select a category.");
            categoryInput.focus();
            return;

        }


        if (!priority) {

            alert("Please select a priority.");
            priorityInput.focus();
            return;

        }


        if (!location) {

            alert("Please enter the location.");
            locationInput.focus();
            return;

        }


        if (!description) {

            alert("Please describe the issue.");
            descriptionInput.focus();
            return;

        }


        /* =========================
           CREATE COMPLAINT
        ========================= */

        const complaint = {

            id:
                "CF-" +
                Date.now(),

            title:
                title,

            category:
                category,

            priority:
                priority,

            location:
                location,

            description:
                description,

            status:
                "Pending",

            date:
                new Date().toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                ),

            createdAt:
                new Date().toISOString(),

            image:
                null

        };


        /* =========================
           SAVE IMAGE
        ========================= */

        if (
            photoInput &&
            photoInput.files &&
            photoInput.files[0]
        ) {

            const file =
                photoInput.files[0];

            const reader =
                new FileReader();


            reader.onload = function (event) {

                complaint.image =
                    event.target.result;

                saveComplaint(complaint);

            };


            reader.readAsDataURL(file);

        } else {

            saveComplaint(complaint);

        }

    });

}


/* =========================
   SAVE COMPLAINT
========================= */

function saveComplaint(complaint) {

    let complaints = [];

    try {

        complaints =
            JSON.parse(
                localStorage.getItem(
                    "campusFixComplaints"
                )
            ) || [];

    } catch (error) {

        complaints = [];

    }


    complaints.unshift(complaint);


    localStorage.setItem(
        "campusFixComplaints",
        JSON.stringify(complaints)
    );


    /* Verify save */

    const saved =
        JSON.parse(
            localStorage.getItem(
                "campusFixComplaints"
            )
        ) || [];


    if (!saved.some(function (item) {
        return item.id === complaint.id;
    })) {

        alert(
            "There was a problem saving your complaint."
        );

        return;

    }


    showSuccessMessage(complaint.id);


    const form =
        document.getElementById("reportForm");

    if (form) {
        form.reset();
    }


    const preview =
        document.getElementById("imagePreview");

    if (preview) {
        preview.style.display = "none";
    }


    const previewImage =
        document.getElementById("previewImage");

    if (previewImage) {
        previewImage.src = "";
    }


    /* Redirect */

    setTimeout(function () {

        window.location.href =
            "complaints.html";

    }, 1500);

}


/* =========================
   SUCCESS MESSAGE
========================= */

function showSuccessMessage(complaintId) {

    const message =
        document.createElement("div");

    message.className =
        "report-success";

    message.innerHTML = `

        <div class="success-icon">
            <i class="fa-solid fa-check"></i>
        </div>

        <div>

            <strong>
                Complaint submitted successfully!
            </strong>

            <p>
                Complaint ID: ${complaintId}
            </p>

        </div>

    `;


    document.body.appendChild(message);


    setTimeout(function () {

        message.classList.add("show");

    }, 50);

    setTimeout(function () {

        message.classList.remove("show");
    
        setTimeout(function () {
            message.remove();
        }, 300);
    
    }, 2500);

}


/* =========================
   LOGOUT
========================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", function () {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) return;


        window.location.href =
            "login.html";

    });

}

