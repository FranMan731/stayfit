const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CitaSchema = new Schema({
    id_alumno: { type: Schema.ObjectId, ref: 'Usuario' },
    id_profesor:  { type: Schema.ObjectId, ref: 'Usuario' },
    hora: String,
    fecha: String,
    notificado: { type: Boolean, default: false}
})

module.exports = mongoose.model('citas', CitaSchema)