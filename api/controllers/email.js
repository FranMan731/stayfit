const nodemailer = require('nodemailer')
const Email = require('email-templates')
const path = require('path')

module.exports =  {
   sendEmail: (args) => {
      return new Promise(async (resolve, reject) => {
         // activar 'less secure apps' para poder enviar email
         // https://myaccount.google.com/u/8/lesssecureapps?pageId=none&pli=1
         let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,                    // true for 465, false for other ports
            auth: {
               user: 'envios@cncs.cl',
               pass: 'envios2017'
            }  
         })

         const email = new Email({
            views: {
               root: path.join(__dirname, '../templates'),
               options: {
                  extension: 'ejs'
               }
            },
            message: {
               from: args.from
            },
            transport: transporter,
            send: true
         })

         email.send({
            template: args.template,
            message: {
               to: args.to
            },
            locals: args

         }).then(res => {
            resolve(true)

         }).catch(err => {
            console.log(err.message)
            reject(false)
         })
      })
   }
}
