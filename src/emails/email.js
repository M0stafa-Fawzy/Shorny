const sgMail = require('@sendgrid/mail')
const { CustomError } = require('../utils/errors')

sgMail.setApiKey(process.env.SENDGRID_API)

const registerMail = (email, name) => {
    try {
        return sgMail.send({
            to: email,
            from: 'mostafafawzy471@gmail.com',
            subject: 'Thanks for registering on our site',
            text: 'Welcome to our app ' + name + '.'
        })
    } catch (error) {
        throw new CustomError(error.message, 500)
    }
}


const deleteMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mostafafawzy471@gmail.com',
        subject: 'Sorry to see you go',
        text: 'Goodbye ' + name + '. Hope to see you back soon.'
    })
}

const verificationMail = (email, code) => {

    sgMail.send({
        to: email,
        from: 'mostafafawzy471@gmail.com',
        subject: 'verification Code',
        text: `your virification code is ${code}`
    })
}

module.exports = {
    registerMail,
    deleteMail,
    verificationMail
}

