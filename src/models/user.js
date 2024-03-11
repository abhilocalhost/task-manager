const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.length<=6)
            throw new Error('length should be grater than 6')

            if(value.includes('password'))
            throw new Error ('password not allow th have password')
        }

    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('not a valid email')
        }
    },
    age:{
        type: Number,
        required: true,
        default: 0,
        validate(value){
            if(value<0)
            throw new Error('Age must be +ve')
        }
    },avatar:{
        type:Buffer
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},
{
    timestamps:true
})

//not stored in database as Owner but just to maintain the relationship
//for mongoose
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',//location where data is stored
    foreignField:'owner'//
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

//userSchema.methods =  accessible on instances 
userSchema.methods.generateAuthToken = async function(){

    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

//userSchema.static = something we can access directly from the model, accessible on models
   userSchema.statics.findByCredentials = async(email,password) => {
    const user = await User.findOne({email})
    console.log(user)
    if(!user)
     throw new Error('unable to login')
    
    const isMatch = await bcrypt.compare(password,user.password) 

    if(!isMatch)
    throw new Error('unable to login')
 
    return user 
} 



//"pre"=before, "save"= saving=====> before saving
userSchema.pre('save',async function(next){

    const user = this

    if(user.isModified('password')){
      
        user.password = await bcrypt.hash(user.password,8)

    }

    //it will tell that async function is done
    next()
})


//deleting user task when user is remmoved

userSchema.pre('remove',async function(next){

    const user = this

    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User',userSchema)


module.exports = User;