async function studentLogin() {

    const collegeID = document.getElementById("collegeID").value.trim();
    const password = document.getElementById("password").value;

    if (collegeID === "" || password === "") {
        return showError("Please enter your College ID and Password.");
    }

    try {

        const response = await fetch("http://localhost:5000/api/student/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                collegeID: collegeID,
                password: password
            })

        });

        const data = await response.json();

        if (!response.ok) {
            return showError(data.message);
        }

        if (data.firstLogin) {

            window.location.href = "student-change-password.html";

        } else {

            window.location.href = "student_dashboard.html";

        }

    }

    catch (error) {

        showError("Unable to connect to the server.");

    }

}

function showError(message) {

    const error = document.getElementById("error");

    error.innerHTML = message;

    error.style.display = "block";

}