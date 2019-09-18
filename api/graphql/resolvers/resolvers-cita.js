const Cita = require('../../models/Cita');
const Usuario = require('../../models/Usuario');
const {sendNotification} = require('./../../controllers/onesignal')
const {
    AuthError,
    UserNotFound,
	SinPermisos,
	ErrorUpdate,
    ErrorInsert,
    DataExist,
	ErrorDelete,
    ErrorGet,
    ElementNotFound
} = require('../../errors');

const moment = require('moment');

module.exports = {
    insertCita: async(parent, args, {user}) => {
        const { input } = args;
		if (!user)
         throw new AuthError()

      	if (user.rol !== 'PROFESOR')
         throw new SinPermisos()

        // verificamos si existe usuario
        const alumno = await Usuario.findOne({_id: input.id_alumno});
        const profesor = await Usuario.findOne({_id: input.id_profesor});

        if (!alumno) throw new UserNotFound();
        // verificamos si existe cita
        if (await Cita.findOne({ id_alumno: input.id_alumno, fecha: input.fecha, hora: input.hora })) throw new DataExist();
        
		const cita = new Cita(input);

		await cita.save((err) => {
			if (err) throw new ErrorInsert();
        });

        const fecha = new Date(cita.fecha);
        const mes = moment(fecha).locale('es').format('MMMM');
        const dia = moment(fecha).format('DD');

        if(alumno.onesignal_id) {
            sendNotification({
                app_id: process.env.ONESIGNAL_ID,
                content_available: true,
                include_player_ids: [alumno.onesignal_id],
                headings: {
                   en: `Nueva cita con el coach ${profesor.nombre}`
                },
                contents: {
                   en: `Hola ${alumno.nombre}, el coach ${profesor.nombre} le ha asignado una nueva cita el día ${dia} de ${mes}, a las ${cita.hora}.`
                },
                subtitle: {
                   en: "StayFit"
                }
             })
        }
        
		return cita;
    },

    getCitasPorAlumno: async(parent, args, {user}) => {
        const { id_alumno } = args;
        let citas = [];

        if (!user)
         throw new AuthError()

        const todasCitas = await Cita.find({id_alumno: id_alumno });

        for (let i = 0; i < todasCitas.length; i++) {
            const cita = todasCitas[i];
            
            let profesor = await Usuario.findOne({_id: cita.id_profesor}).select('nombre');
            let alumno = await Usuario.findOne({_id: cita.id_alumno}).select('nombre');

            citas.push({
                _id: cita._id,
                alumno: {
                    _id: cita.id_alumno,
                    nombre: alumno.nombre
                },
                profesor: {
                    _id: cita.id_profesor,
                    nombre: profesor.nombre
                },
                fecha: cita.fecha,
                hora: cita.hora
            })
        }
        
        return citas;
    },

    getCitas: async(parent, args, {user}) => {
        return await Cita.find();
    },

    getCitaAlumno: async(parent, args, {user}) => {
        const { _id } = args;
        let respuesta = {};
        if (!user)
         throw new AuthError()

        let cita = await Cita.findOne({_id: _id }).select('-__v')
        let profesor = await Usuario.findOne({_id: cita.id_profesor}).select('nombre');
        let alumno = await Usuario.findOne({_id: cita.id_alumno}).select('nombre');

        if(cita && profesor && alumno) {
            respuesta = {
                _id: cita._id,
                alumno: {
                    _id: cita.id_alumno,
                    nombre: alumno.nombre
                },
                profesor: {
                    _id: cita.id_profesor,
                    nombre: profesor.nombre
                },
                fecha: cita.fecha,
                hora: cita.hora
            }
        }
        return respuesta;
    },

    updateCita: async(parent, args, {user}) => {
        const { input } = args;

		if (!user)
        	throw new AuthError()
      
        if (user.rol !== 'ADMIN' || user.rol !== 'PROFESOR' )
        	throw new SinPermisos()
      
		if (!input._id) throw new ElementNotFound();

		return Cita.findOneAndUpdate(
			{ _id: input._id },
			{ $set: input },
			{ new: true } // return modified document
		).catch(() => {
			throw new ErrorUpdate();
		});
    },

    deleteCita: async(parent, args, {user}) => {
        if (!user)
         throw new AuthError()

      	if (user.rol !== 'ADMIN' || user.rol !== 'PROFESOR' )
         throw new SinPermisos()

        await Cita.findOneAndRemove({_id}).catch(() => {
			throw new ErrorDelete();
		});

		return {
			status: true,
			message: "Ha sido eliminado"
		};
    }
}