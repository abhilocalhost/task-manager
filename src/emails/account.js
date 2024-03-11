const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)


// sgMail.send({
//    to:'17ucc004@lnmiit.ac.in' ,
//    from:'17ucc004@lnmiit.ac.in',
//    subject:'this is my first creation',
//    text:'ok'
// })


const sendWelcomeEmail =(email,name)=>{
   sgMail.send({
      to:email,
      from:'17ucc004@lnmiit.ac.in',
      subject:"thanks for joining",
      text:`welcome to app ${name}`
   })
}


const deleteuser =(email,name)=>{
  sgMail.send({
     to:email,
     from:"17ucc004@lnmiit.ac.in",
     subject:"comeback babe",
     text:`sad to lose a valuable customer ${name}`
  })

}


module.exports = {
   sendWelcomeEmail,
   deleteuser
}