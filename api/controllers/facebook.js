const Promise = require('bluebird')         // Promises mas rapido que el nativo de javascript
const rp = require('request-promise')

module.exports = {
   get_user_id: (access_token) => {
      return new Promise((resolve, reject) => {
         const url = `https://graph.facebook.com/v3.1/debug_token?input_token=${access_token}&access_token=${process.env.APP_TOKEN_FB}`

         rp(url).then((res) => {
            const json = JSON.parse(res)

            if (json.data.is_valid)
               resolve(json.data.user_id)

            else
               reject('Token invalido')

         }).catch(e => {
            reject(e.message)
         })
      })
   },

   get_user_data: (id, access_token) => {
      return new Promise((resolve, reject) => {
         const url = `https://graph.facebook.com/v3.1/${id}?access_token=${access_token}&fields=name,email`

         rp(url).then((res) => {
            const json = JSON.parse(res)

            resolve({
               name: json.name,
               email: json.email,
               picture: `https://graph.facebook.com/${id}/picture?type=large`
            })

         }).catch(e => {
            reject({ error: e.message })
         })
      })
   }
}