const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri =
  "mongodb+srv://admin:admin123@securenote-cluster.kuuah.mongodb.net/?retryWrites=true&w=majority&appName=securenote-cluster";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(`MongoDB Atlas connection error: ${err}`));

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
