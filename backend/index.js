const express = require("express");
const cors = require("cors");
const geocodeRoutes = require("./routes/geocode");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", geocodeRoutes); // GET /api/reverse-geocode

app.listen(5000, () => console.log("Server running on port 5000"));
