const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BlacklistSchema = new Schema({
   token: String,
   expireAt: Date
})

// index para que sea mas rapido la busqueda en base al string token
BlacklistSchema.index({ token: 'text' })

// index para borrar documentos automaticmante en base al expireAt
// el expireAt contiene un Date y cuando la hora actual llegue a ese Date se borra...
BlacklistSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('blacklists', BlacklistSchema)