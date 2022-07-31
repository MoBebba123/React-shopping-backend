const bodyParser = require("body-parser");
const express = require("express")
require("dotenv").config();
const app = express();
const database =  require("./database/database")
const cookiesParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const userRoute = require("./routes/user")
// connection database
database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }))
app.use(express.json());
app.use(cookiesParser());
app.use("/api", userRoute);
cloudinary.config({
    cloud_name: "dkyyqvbna",
    api_key: "368228333932484",
    api_secret: process.env.API_SECRET ,
  });
  

app.use(errorMiddleware)
app.listen(process.env.PORT,()=>{
    console.log(`server is running on Port ${process.env.PORT}`)
})