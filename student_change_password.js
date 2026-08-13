async function changePassword() {

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword === "" || confirmPassword === "") {
        alert("Please fill all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const student = JSON.parse(localStorage.getItem("student"));

    const response = await fetch("http://localhost:5000/api/student/change-password", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            studentID: student.id,
            newPassword: newPassword

        })

    });

    const data = await response.json();

    if (data.success) {

        alert("Password Changed Successfully");

        window.location.href = "student_dashboard.html";

    } else {

        alert(data.message);

    }

}