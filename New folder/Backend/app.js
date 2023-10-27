const express = require("express");
const dotenv = require('dotenv');
const app = express();
const dbConnection = require('./config/database');
const post = require("./routes/post")
const user = require("./routes/user")
const cookieParser = require("cookie-parser")


dotenv.config();

dbConnection();


//using middleware

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())


app.use("/api/v1", post)
app.use("/api/v1", user)

module.exports = app;
