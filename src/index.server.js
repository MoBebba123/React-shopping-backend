const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const app = express();
const database = require("./database/database");
const cookiesParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

// Routes imports
const userRoute = require("./routes/user");
const merchantRouter = require("./routes/merchant");
const itemRouter = require("./routes/merchantItem");
const category = require("./routes/itemCategory");
// connection database
database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());
app.use(cookiesParser());
app.use(cors());
// Routes
app.use("/api", userRoute);
app.use("/api", merchantRouter);
app.use("/api", itemRouter);
app.use("/api", category);

cloudinary.config({
  cloud_name: "dkyyqvbna",
  api_key: "368228333932484",
  api_secret: process.env.API_SECRET,
});

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });
//app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
  console.log(`server is running on Port ${process.env.PORT}`);
});
