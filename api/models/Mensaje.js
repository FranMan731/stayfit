const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MensajeSchema = new Schema({
    id_sender: { type: Schema.ObjectId, ref: 'Usuario' },
    id_receiver: { type: Schema.ObjectId, ref: 'Usuario' },
    visto: { type: Boolean, default: false },
    texto: String,
    fecha: { type: Date, default: Date.now }
})

module.exports = mongoose.model('mensajes', MensajeSchema)