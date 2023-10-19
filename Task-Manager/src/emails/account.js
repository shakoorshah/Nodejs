const sqMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sqMail.setApiKey(sendgridAPIKey)

// sqMail.send({
//     to: 'hassanqari9@gmail.com',
//     from: 'hassanqari9@gmail.com',
//     subject: 'me',
//     text: 'I hope u go ur self'
// })
const sendWelcomeEmail = (email,name) => {
    sqMail.send({
        to: email,
        from: 'hassanqari9@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to app, ${name}`,
        html: ''
    })
}

const sendCancelationEmail = (email,name) => {
    sqMail.send({
        to: email,
        from: 'hassanqari9@gmail.com',
        subject: 'Cancelled',
        text: `Why u cancelled, ${name}`,
        html: ''
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}