const mongoose = require('mongoose')

const Schema = mongoose.Schema

const EjercicioSchema = new Schema({
    nombre: String,
    descripcion: String,
    actividad: {type: String, enum: ['FUNCIONAL', 'HIIT', 'FUERZA', 'NUCLEO', 'EQUILIBRIO', 'AEROBICO']},
    imagen: String
})

module.exports = mongoose.model('ejercicios', EjercicioSchema)