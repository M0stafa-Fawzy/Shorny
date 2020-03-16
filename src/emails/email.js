const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API)

const registerMail = (email , name) => {
    sgMail.send({
        to : email , 
        from : 'mostafafawzy471@gmail.com' , 
        subject : 'Thanks for registering on our site' , 
        text : 'Welcome to our app '+ name +'.'
    })
}


const deleteMail = (email , name) => {
    sgMail.send({
        to : email , 
        from : 'mostafafawzy471@gmail.com' , 
        subject : 'Sorry to see you go' , 
        text : 'Goodbye '+ name +'. Hope to see you back soon.'
    })
}


module.exports = {
    registerMail , 
    deleteMail
}

