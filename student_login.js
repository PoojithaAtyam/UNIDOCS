async function studentLogin() {

    const collegeID = document.getElementById("collegeID").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!collegeID || !password) {
        alert("Enter College ID and Password");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/student/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                collegeID,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        localStorage.setItem("student", JSON.stringify(data.student));

        if (data.firstLogin == 1) {

            window.location.href = "student_change_password.html";

        } else {

            window.location.href = "student_dashboard.html";

        }

    }

    catch (err) {

        alert("Cannot connect to backend.");

    }

}