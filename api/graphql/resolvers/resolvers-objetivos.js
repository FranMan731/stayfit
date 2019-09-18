const Objetivo = require('../../models/Objetivo');
const {
    ErrorGet
} = require('../../errors');

module.exports = {
    getObjetivos: async(parent, args, { user }) => {
        const objetivos = await Objetivo.find().catch(err => { if(err) throw new ErrorGet })

        console.log("Estoy aca: " + objetivos)
        return objetivos
    },

    getObjetivo: async(parent, { _id }, {user}) => {
        const objetivo = await Objetivo.findById(_id).catch(err => { if(err) throw new ErrorGet })

        return objetivo
    }
}