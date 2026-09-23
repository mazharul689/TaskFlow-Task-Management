const Task = require("../models/taskModel")

const allTask = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            tasks
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: err.message
        })
    }
}

const getSingleTask = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Id is required"
        })
    }

    try {
        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        res.status(200).json({
            success: true,
            task
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task",
            error: err.message
        })
    }
}

const addTask = async (req, res) => {
    const { name } = req.body
    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        })
    }
    try {
        const newTask = await Task.create({ name: name.trim(), isComplete: "no" })
        res.status(200).json({
            success: true,
            newTask
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to create tasks",
            error: err.message
        })
    }
}

const updateTask = async (req, res) => {
    const { name, isComplete } = req.body
    const { id } = req.params

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Id is required"
        })
    }

    if (!name || !name.trim() || isComplete === undefined) {
        return res.status(400).json({
            success: false,
            message: "All the info is required"
        })
    }

    if (!["yes", "no"].includes(isComplete)) {
        return res.status(400).json({
            success: false,
            message: "isComplete must be either yes or no"
        })
    }

    try {
        // Updated from { new: true } to { returnDocument: 'after' }
        const updatedData = await Task.findByIdAndUpdate(
            id, 
            { name: name.trim(), isComplete }, 
            { returnDocument: 'after' }
        )

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        res.status(200).json({
            success: true,
            task: updatedData
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: err.message
        })
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Id is required"
        })
    }
    try {
        const deletedData = await Task.findByIdAndDelete(id)

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        res.status(200).json({
            success: true,
            task: deletedData
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to delet task",
            error: err.message
        })
    }
}

module.exports = {
    allTask,
    getSingleTask,
    addTask,
    updateTask,
    deleteTask
}