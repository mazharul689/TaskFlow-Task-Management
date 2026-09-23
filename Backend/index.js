const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database connected successsfully")
}).catch((err) => {
    console.log(err)
})

const apiRouter = require("./routes/api")
app.use("/api", apiRouter)

app.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on : http://localhost:${process.env.PORT}`)
})