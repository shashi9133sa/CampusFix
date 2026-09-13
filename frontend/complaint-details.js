document.addEventListener("DOMContentLoaded", async function () {

    const params =
        new URLSearchParams(window.location.search);

    const complaintId =
        params.get("id");

    if (!complaintId) {
        document.getElementById("complaintTitle").textContent =
            "Complaint not found";
        return;
    }

    try {

        const response = await fetch(
            `https://campusfix-obdm.onrender.com/api/complaints/${encodeURIComponent(complaintId)}`
        );

        if (!response.ok) {
            throw new Error("Complaint not found");
        }

        const complaint =
            await response.json();

        document.getElementById("complaintTitle").textContent =
            complaint.title;

        document.getElementById("complaintId").textContent =
            complaint.id;

        document.getElementById("complaintCategory").textContent =
            complaint.category;

        document.getElementById("complaintPriority").textContent =
            complaint.priority;

        document.getElementById("complaintLocation").textContent =
            complaint.location;

        document.getElementById("complaintDescription").textContent =
            complaint.description;

        const status =
            document.getElementById("complaintStatus");

        status.textContent =
            complaint.status || "Pending";

        const imageSection =
            document.getElementById("imageSection");

        const image =
            document.getElementById("complaintImage");

        if (complaint.image) {

            image.src = complaint.image;
            imageSection.style.display = "block";

        } else {

            imageSection.style.display = "none";

        }

    } catch (error) {

        console.error(
            "Failed to load complaint:",
            error
        );

        document.getElementById("complaintTitle").textContent =
            "Unable to load complaint";

    }

});