async function submitRequest(){

    const student = JSON.parse(localStorage.getItem("student"));

    const documentType =
        document.getElementById("documentType").value;

    const purpose =
        document.getElementById("purpose").value;

    if(documentType==="" || purpose===""){

        alert("Please fill all fields.");

        return;

    }

    const response = await fetch(
        "http://localhost:5000/api/student/request-document",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                studentID:student.id,

                documentType,

                purpose

            })

        });

    const data = await response.json();

    alert(data.message);

    if(data.success){

        window.location.href="student_dashboard.html";

    }

}