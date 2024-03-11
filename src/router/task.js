const Task = require("../models/task")
const auth = require('../middleware/auth')
const express = require('express')

const router = new express.Router()




// app.post('/task',(req,res)=>{
//   const task = new Task(req.body)

//   task.save().then((result)=>{
//     res.send(task)
//   }).catch((error)=>{
//     res.status(400).send(error)
//   })
// })


router.post('/task', auth, async(req,res)=>{
    const task=new Task({
      ...req.body,
      owner: req.user._id
    })
    try{
      await task.save()
      res.send(task)
    }catch(e){
      console.log(e)
      res.status(400).send(error)
    }
  })  
   
  // app.get('/task',(req,res)=>{
  //   Task.find({}).then((task)=>{
  //     res.send(task);
  //   }).catch((error)=>{
  //     res.status(500).send()
  //   })
  // })
  

  // GET/task?limit=10&skip=20  it means skipping first 20 and showing next 10(21-30)
  //GET/task?sortBy=createdAt:desc
  router.get('/task',auth, async (req,res)=>{
      const match ={}  /*match k andr woh object honge jo query se mach karwaane hai */

      if(req.query.action){
        match.action = req.query.action ==='true'
      }

      const sort ={}
      if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'? -1:1   //createdAt =-1
      }

    try{
    
     //populate
     await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit), //converting string to int 
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
     res.send(req.user.tasks)
    
    // if(!req.query.action ){
    // const task =  await Task.find({owner:req.user._id})
    // res.send(task)
    // }
    // else{
    //   const action = req.query.action ==='true'
    //  const task =  await Task.find({owner:req.user._id,action})
    //  res.send(task)
    // }
    }catch(e){
      res.status(500).send()
    }
  })
  
  // app.get('/task/:id',(req,res)=>{
  //   const _id = req.params.id
  //   Task.findById(_id).then((task)=>{
  //     res.send(task)
  //   }).catch((error)=>{
  //     res.status(500).send()
  //   })
  // })
  
  
  router.get('/task/:id',auth, async(req,res)=>{
    const id = req.params.id
    try{
     // const task = await Task.findById(id)
      const task = await Task.findOne({_id:id,owner:req.user._id})
      if(!task)
      return res.status(404).send()
      res.send(task)
    }catch(e){
      res.status(500).send()
    } 
  })
  
  //updating
  router.patch('/task/:id',auth,async(req,res)=>{
    const id = req.params.id
    const allowedUpdates = ['action','description']
    const updates = Object.keys(req.body)
  
    const isValidUpdate = updates.every((update)=>{
      return allowedUpdates.includes(update)
    })
  
      if(!isValidUpdate){
        return res.status(400).send('Invalid update')
      }
  
      try{
         //findbyIdandUpdate bypasses mongoose it perform direct changes in database thats why we provide runValidator
        //const task = await Task.findByIdAndUpdate(id,req.body,{new:true, runValidators:true})

       //console.log(req.user)
        const task = await Task.findOne({_id:id, owner:req.user._id})
       // console.log(task)
        if(!task)
        return res.status(404).send()

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
      }catch(e){
        console.log(e)
        res.status(500).send(e)
      }
  })
   
  //delete
  router.delete('/task/:id',auth, async(req,res)=>{
    const id = req.params.id
    try{
      const task = await Task.findOne({_id:id, owner:req.user._id})
  
      if(!task)
      return res.status(404).send('no task with this id')
  
      res.send(task)
    }
    catch(e){
      res.status(500)
    }
  })

  module.exports = router;
  