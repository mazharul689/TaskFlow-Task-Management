const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isComplete: {
        type: String,
        required: true,
        enum: ["yes", "no"],
        default: "no"
    }
}, {
    collection: "tasks",
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task