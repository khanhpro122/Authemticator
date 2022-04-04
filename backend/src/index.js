const express = require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
dotenv.config()
const route = require('./routes')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT | 4000
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})