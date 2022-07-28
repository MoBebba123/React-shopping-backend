const bodyParser = require("body-parser");
const express = require("express")
require("dotenv").config();
const app = express();
const database =  require("./database/database")
const userRoute = require("./routes/user")
// connection database
database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", userRoute);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on Port ${process.env.PORT}`)
})