const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()
const port =process.env.PORT



//automatic parse the incoming json so we can access it as an object we use we do that using req.body
 app.use(express.json())
 app.use(userRouter)
 app.use(taskRouter)


 

app.listen(port,()=>{ 
    console.log('server is up on port '+port)
})

