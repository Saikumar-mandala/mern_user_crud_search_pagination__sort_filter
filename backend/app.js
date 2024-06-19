require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const dbConnect = require("./db/conn");
const cors = require("cors");
const router = require("./Routes/router");
const PORT = process.env.PORT || 4000;

// Database Connection
dbConnect();

app.use(cors());
app.use(express.json());
// app.use("/public", express.static("./public"));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


app.use("/files", express.static("./public/files"));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
