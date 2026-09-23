const express = require("express")
const { allTask, getSingleTask, addTask, updateTask, deleteTask } = require("../controllers/mainController")
const router = express.Router()

router.get("/all-task", allTask)
router.get("/single-task/:id", getSingleTask)
router.post("/add-task", addTask)
router.put("/update-task/:id", updateTask)
router.delete("/delete-task/:id", deleteTask)

module.exports = router