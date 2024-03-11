const User = require("../models/user")

const express = require('express')

const auth = require('../middleware/auth')
const router = new express.Router()

const multer = require('multer')

const {sendWelcomeEmail,deleteuser} = require('../emails/account')


//app.post('/users',(req,res)=>{
  //  const user = new User(req.body)
  //  user.save().then((result)=>{
  //    res.send(user)
  //  }).catch((error)=>{
  //      res.status(400).send(error)
   
  //  }) 

//signUP
router.post('/users',async(req,res)=>{
    const user = new User(req.body)
     try{
       await user.save()
       sendWelcomeEmail(user.email,user.name)
       const token = await user.generateAuthToken()
       res.status(201).send({user,token})
     }
     catch(e){
       res.status(400)
     }
   })
    

   //login
   router.post('/users/login',async(req,res)=>{
     try{
       const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
       res.send({user,token})
     }catch(e){
       res.status(400).send()
     }  
   })
   //getting all the users
   
   // app.get('/users',(req,res)=>{   
   //   User.find({}).then((user)=>{
   //     res.send(user)
   //   }).catch((error)=>{
   //     res.status(500).send()
   //   })
   // })
   

   //logout
   router.post('/users/logout',auth,async(req,res)=>{
          try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token!== req.token

            })
            await req.user.save()
            res.send()
           } catch(e){
              res.status(500).send()
          }
   })

   //logout from all devices

   router.post('/users/logoutAll',auth,async(req,res)=>{
    try{ 
    req.user.tokens = []
     await req.user.save()
            res.send()
           } catch(e){
              res.status(500).send()
          }
     
   })

   //if the middleware auth call next then only 
   router.get('/users/me',auth, async(req,res)=>{
    
    res.send(req.user)
    //  try{
    //    const users = await User.find({})
    //    res.send(users)
    //  }catch(e){
    //    res.status(500).send()
    //  }
   
   })
   
    
   //getting user by specific id
   
   
   // app.get('/users/:id',(req,res)=>{
   //   const _id = req.params.id
   //   User.findById(_id).then((user)=>{
   //     //if database does not contain user with given _id, its not an error
   //     if(!user){
   //       return res.status(400).send()
   //     }
   //     res.send(user)
   //   }).catch((error)=>{
   //     res.status(500).send()
   //   })
   // }) 
   
   
  //  router.get('/users/:id',async(req,res)=>{
    
  //    const id = req.params.id
  //    try{
  //      const user = await User.findById(id)
  //      if(!user){
  //              return res.status(400).send()
  //            }
  //            res.send(user)
  //    }catch(e){
  //      res.status(500).send()
  //    }
  //  })
   
   
   
   //updating 
   
   router.patch('/users/me', auth, async(req,res)=>{
     const id = req.user._id
   const updates = Object.keys(req.body)
   const allowedUpdates = ['name','email','password','age']
   
   
   //EVERY FUNCTION will return true if all the value it
   //receive is true otherwise false
   const isValidOperation = updates.every((update)=>{
     return allowedUpdates.includes(update)
   })
   
   if(!isValidOperation)
   res.status(400).send('invalid update')
   
     try{

      // findbyIdandUpdate bypasses mongoose it perform direct changes in database thats why we provide runValidator
      //  const user = await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
       
      const user = req.user

      updates.forEach((update)=>{
          user[update] = req.body[update]
      })

      //at this point middleware executes
      await user.save()

       res.send(user)
     }catch(e){
       res.status(400).send(e)
     }
   })
   
   //deleting 
   
   router.delete('/users/me',auth, async (req,res)=>{
     const id = req.user._id
     try{
      //  const user = await User.findByIdAndDelete(id)
      //  if(!user)
      //  return res.status(404).send()
      await req.user.remove()
      deleteuser(req.user.email,req.user.name)
       res.send(req.user)
     }catch(e){
       res.status(400).send(e)
     }
     
   })

   const upload = multer({
    
    limits:1000000,
    fileFilter(req,file,cb){

      // if(!file.originalname.endsWith('.jpg')&&!file.originalname.endsWith('.png')&&!file.originalname.endsWith('.jpeg'))
      // return cb(new Error('please upload pic'))

      if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error('please upload pic'))

      cb(undefined,true)
    }
      
    
  })
   router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
     //sharp used for resizing and converting the type of pic
    //const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
   },(error,req,res,next)=>{
    res.status(400).send({error:error.message})

})


router.delete('/users/me/avatar', auth,async(req,res)=>{
  
  try{
    req.user.avatar = undefined
  await req.user.save()
  res.send()
  }catch(e){
    res.status(400).send(e)
  }
  
})


router.get('/user/:id/avatar', async(req,res)=>{
  try{
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error()
    }

    //tell the client what type of image they are receiving
    res.set('Content-Type','image/png')
    res.send(user.avatar)
  }catch(e){
      res.status(404).send()
  }
})
 
module.exports = router