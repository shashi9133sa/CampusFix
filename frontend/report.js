document.addEventListener("DOMContentLoaded", function () {

    const reportForm = document.getElementById("reportForm");
    const photoInput = document.getElementById("photo");
    const imagePreview = document.getElementById("imagePreview");
    const previewImage = document.getElementById("previewImage");
    const removeImage = document.getElementById("removeImage");
    const submitButton = document.getElementById("submitButton");
    const backButton = document.getElementById("backButton");
    const logoutButton = document.getElementById("logoutButton");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    // Get logged-in user
    let loggedInUser = null;

    try {
        const savedUser = localStorage.getItem("campusFixUser");

        if (savedUser) {
            loggedInUser = JSON.parse(savedUser);
        }
    } catch (error) {
        console.error("User data error:", error);
    }

    // Mobile menu
    if (menuButton && sidebar) {
        menuButton.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }

    // Photo preview
    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (event) {
                previewImage.src = event.target.result;
                imagePreview.style.display = "block";
            };

            reader.readAsDataURL(file);
        });
    }

    // Remove photo
    if (removeImage) {
        removeImage.addEventListener("click", function () {
            photoInput.value = "";
            previewImage.src = "";
            imagePreview.style.display = "none";
        });
    }

    // Back button
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "student-dashboard.html";
        });
    }

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("campusFixUser");
            window.location.href = "login.html";
        });
    }

    // Submit complaint
    if (reportForm) {
        reportForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const category = document.getElementById("category").value;
            const priority = document.getElementById("priority").value;
            const location = document.getElementById("location").value.trim();
            const description = document.getElementById("description").value.trim();

            if (!title || !category || !priority || !location || !description) {
                alert("Please fill in all required fields.");
                return;
            }

            // Make sure student is logged in
            if (!loggedInUser || !loggedInUser.id) {
                alert("Please login before submitting a complaint.");
                window.location.href = "login.html";
                return;
            }

            const complaintId = "CF-" + Date.now();

            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            try {
                let imageData = null;

                if (photoInput.files.length > 0) {
                    imageData = await convertImageToBase64(photoInput.files[0]);
                }

                const complaint = {
                    id: complaintId,
                    user_id: loggedInUser.id,
                    title: title,
                    category: category,
                    priority: priority,
                    location: location,
                    description: description,
                    status: "Pending",
                    image: imageData
                };

                const response = await fetch(
                    "http://localhost:5000/api/complaints",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(complaint)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to submit complaint"
                    );
                }

                showSuccessMessage(result.complaintId);

                reportForm.reset();

                if (imagePreview) {
                    imagePreview.style.display = "none";
                }

                if (previewImage) {
                    previewImage.src = "";
                }

                setTimeout(function () {
                    window.location.href = "complaints.html";
                }, 1800);

            } catch (error) {
                console.error("Submission error:", error);

                alert(
                    "Unable to submit complaint. Please make sure the backend server is running."
                );

                submitButton.disabled = false;
                submitButton.textContent = "Submit Complaint";
            }
        });
    }

    // Convert image to Base64
    function convertImageToBase64(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();

            reader.onload = function () {
                resolve(reader.result);
            };

            reader.onerror = function () {
                reject(new Error("Failed to read image"));
            };

            reader.readAsDataURL(file);
        });
    }

    // Success message
    function showSuccessMessage(complaintId) {

        const message = document.createElement("div");

        message.className = "report-success";

        message.innerHTML = `
            <div class="success-icon">
                <i class="fa-solid fa-check"></i>
            </div>

            <div>
                <strong>Complaint submitted successfully!</strong>
                <p>Complaint ID: ${complaintId}</p>
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

});