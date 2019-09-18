const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PlanSchema = new Schema({
    id_usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    nombre: String,
    ejercicios: [{
        tipo_entrenamiento: {
            type: String,
            enum: ['FUNCIONAL', 'HIIT', 'FUERZA', 'NUCLEO', 'EQUILIBRIO', 'AEROBICO']
        },
        ejercicios: [
            {
                id_ejercicio: { type: Schema.ObjectId, ref: 'Ejercicio' },
                imagen: { type: String, default: '' },
                nombre: String,
                series: Number,
                repeticiones: Number,
                duracion: Number
            }
        ]
    }],
    fechas: [
        {   
            fecha: String,
            tipo_entrenamiento: {
                type: String,
                enum: ['FUNCIONAL', 'HIIT', 'FUERZA', 'NUCLEO', 'EQUILIBRIO', 'AEROBICO']
            }
        }  
    ],
    finalizado: { type: Boolean, default: false }
})

module.exports = mongoose.model('plan', PlanSchema)