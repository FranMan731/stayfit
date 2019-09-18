const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
   id_chat: {type: String, default: ''},
   nombre: String,
   email: String,
   password: String,
   edad: Number,
   rut: String,
   estatura: Number,
   experiencia: String,
   especialidades: [String],
   rol: { type: String, enum: ['ALUMNO', 'PROFESOR', 'ADMIN'], default: 'ALUMNO' },
   avatar: { type: String, default: ''},
   objetivo: [{
      _id: {type: Schema.ObjectId, ref: 'Objetivo'},
      nombre: String
   }],
   observacion: String,
   motivacion: String,
   calificacion: { type: Number, default: 0 },
   cantidad_calificacion: { type: Number, default: 0 },
   total_calificacion: { type: Number, default: 0 },
   nivel: Number,
   sexo: String,
   coach: {
      id_usuario: { type: Schema.ObjectId, ref: 'Usuario'},
   },
   alumnos: [{
      id_alumno: { type: Schema.ObjectId, ref: 'Usuario' }
   }],
   ciudad: String,
   peso: [Number],
   imc: [Number],
   grasa: [Number],
   masa_muscular: [Number],
   onesignal_id: String,
   deshabilitar: { type: Boolean, default: false }
})

module.exports = mongoose.model('usuarios', UsuarioSchema)