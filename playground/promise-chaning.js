require('../src/db/mongoose')

const User = require('../src/models/user')

const Task = require('../src/models/task')


// //600c357ca1c8c9163468ed08

// User.findByIdAndUpdate('600c357ca1c8c9163468ed08',{age:22}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:22})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

// Async -Await method

// const updateAndCount = async(id,age)=>{
//     const user = await User.findByIdAndUpdate(id,{age:age})
//     const count =await User.countDocuments({age:age})

//     return count
// }

// updateAndCount('600c357ca1c8c9163468ed08', 25).then((count)=>{
//     console.log(count)
// }).catch((error)=>{
//     console.log('error')
// })











// Task.findByIdAndDelete('600d8d99b3326c2d70c49471').then(()=>{
//     console.log('deleted')
//     return Task.countDocuments({action:true})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })


// Async-Await method

// const deleteTaskandCount = async(id,action)=>{
//     const response = await findByIdAndDelete(id)
//     const count = await countDocuments({action:action})
//     return count
// }

// deleteTaskandCount('600d8d99b3326c2d70c49471',true).then((count)=>{
//    console.log(count)
// }).catch((error)=>{
//     console.log(error)
// }) 