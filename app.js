document.getElementById("requestForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const id = document.getElementById("studentId").value;

    document.getElementById("output").innerHTML = `
        <h3> Request Submitted!</h3> 
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Document:</strong> ${id}</p>
        `;
});
