const express = require("express");
const cors = require("cors");

require("dotenv").config();

const studentRoutes = require("./routes/student");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
    res.send("UNIDOCS Backend is Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});