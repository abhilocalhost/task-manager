const mongoose = require('mongoose')

const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description:{
        required:true,
        trim:true,
        type: String
    },
    action:{
        type:Boolean,
        required:true
    },
    owner:{
        //it tell type is object Id
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref :'User'
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task',taskSchema)

module.exports = Task;