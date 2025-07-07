const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use(cors({
    origin:"http://localhost:3000",
     credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));


