const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ObjetivoSchema = new Schema({
    nombre: String
})

module.exports = mongoose.model('objetivos', ObjetivoSchema)