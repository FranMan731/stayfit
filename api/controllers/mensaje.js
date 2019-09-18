const Mensaje = require('../models/Mensaje')
const Usuario = require('../models/Usuario')
const {
    getProfesorPorAlumno,
	getAlumnosPorProfesor
} = require('./usuario')

const { sendNotification } = require('./onesignal')

const {
    ErrorUpdate,
    ErrorInsert
} = require('../errors');

module.exports = {
    /**
     * Funcion que crea un nuevo mensaje para guardarlo a la base de datos.
     *  'data': son los datos que el usuario envía.
    *                   data {   
    *                       id_sender: id del usuario que envía el mensaje.
    *                       id_receiver: id del usuario que recibe el mensaje.
    *                       texto: el texto del mensaje.
    *                   }
     */
    insertMensaje: (data) => {
        if(data.texto === '') {
            return false
        }

        const mensaje = new Mensaje(data)

        mensaje.save((err) => {
            if(err) {
                console.log(err)

                return false
            }
        })

        return mensaje
    },

    /** 
     * Funcion que guarda el id_chat al usuario (Usuario se ha conectado a la aplicacion)
     */
    insertIdChat: async ({id_usuario, id_chat}) => {
        await Usuario.findOneAndUpdate(
			{ _id: id_usuario },
			{ $set: {id_chat: id_chat} },
			{ new: true } // return modified document
        )

        return true
    },

    /**
     * Funcion que obtiene el id_chat del receiver.
     */
    getIdChat: (id_receiver) => {
        return Usuario.findById(id_receiver, 'id_chat -_id')
    },

    /**
     * Funcion que obtiene los mensajes del sender con el receiver.
     */
    getMensajesChat: async (id_sender, id_receiver) => {
        //Obtengo los mensajes que ha enviado el sender.
        let mensajes_sender = await Mensaje.find({$and: [{id_sender: id_sender}, {id_receiver: id_receiver}]})
        //Obtengo los mensajes que ha recibido el sender
        let mensajes_receiver = await Mensaje.find({$and: [{id_sender: id_receiver}, {id_receiver: id_sender}]})
        //Variable donde se van a guardar los mensajes ordenados.
        let mensajes = []

        //Actualizo el ultimo mensaje a visto.
        await Mensaje.findOne({
            $or: [
                { $and: [{id_sender: id_sender}, {id_receiver: id_receiver}] },
                { $and: [{id_sender: id_receiver}, {id_receiver: id_sender}] }
            ]
        }).sort({ fecha: -1 }).limit(1).exec((err, mensaje) => {
            if(mensaje) {
                mensaje.visto = true
                mensaje.save();
            }
        });

        if(mensajes_sender || mensajes_receiver) {
            //Guardo en un nuevo formato los mensajes enviados por el sender y lo agrego al array Mensajes
            mensajes_sender.map((item, i) => {
                let it = {
                    _id: item._id,
                    from: 'receiver',
                    fecha: item.fecha,
                    texto: item.texto
                }

                mensajes.push(it)
            })

            //Guardo en un nuevo formato los mensajes recibidos por el sender y lo agrego al array Mensajes
            mensajes_receiver.map((item, i) => {
                let it = {
                    _id: item._id,
                    from: 'sender',
                    fecha: item.fecha,
                    texto: item.texto
                }

                mensajes.push(it)
            })

            //Los ordeno por la fecha
            mensajes.sort((a, b) => {
                return new Date(a.fecha) - new Date(b.fecha);
            })
        }

        return mensajes
    },

    getChats: async(user) => {
        const id = user.id_usuario
        let datos = []

        if(user.rol === 'PROFESOR') {
            let alumnos = await getAlumnosPorProfesor(id)

            if(alumnos) {
                for (let i = 0; i < alumnos.length; i++) {
                    const alumno = alumnos[i];
                    
                    let mensaje = await Mensaje.findOne({
                        $or: [
                            { $and: [{id_sender: id}, {id_receiver: alumno._id}] },
                            { $and: [{id_sender: alumno._id}, {id_receiver: id}] }
                        ]
                    }).sort({ fecha: -1 }).limit(1);
    
                    if(mensaje) {
                        datos.push({
                            _id: alumno._id,
                            usuario: {
                                nombre: alumno.nombre,
                                avatar: alumno.avatar
                            },
                            last_message: mensaje.texto,
                            nuevo: mensaje.visto
                        })
                    } else {
                        datos.push({
                            _id: alumno._id,
                            usuario: {
                                nombre: alumno.nombre,
                                avatar: alumno.avatar
                            }
                        }) 
                    }
                }
            }
        } else {
            let profesor = await getProfesorPorAlumno(id)

            if(profesor) {
                let mensaje = await Mensaje.findOne({
                    $or: [
                        { $and: [{id_sender: id}, {id_receiver: profesor._id}] },
                        { $and: [{id_sender: profesor._id}, {id_receiver: id}] }
                    ]
                }).sort({ fecha: -1 }).limit(1)
    
                if(mensaje) {
                    datos.push({
                        _id: profesor._id,
                        usuario: {
                            nombre: profesor.nombre,
                            avatar: profesor.avatar
                        },
                        last_message: mensaje.texto,
                        nuevo: mensaje.visto
                    })
                } else {
                    datos.push({
                        _id: profesor._id,
                        usuario: {
                            nombre: profesor.nombre,
                            avatar: profesor.avatar
                        }
                    })
                }
            }
        }

        return datos;
    },

    /**
     * Funcion que modifica el id_chat, para mostrar que esta desconectado.
     */
    desconectar: async (id_chat) => {
        let persona = await Usuario.findOne({id_chat: id_chat})

        persona.id_chat = ''
        persona.save((err) => {
            if (err) throw new ErrorUpdate()
        })
    },

    enviarNotificacion: async (mensaje) => {
        const receiver = await Usuario.findOne({_id: mensaje.id_receiver})
        const sender = await Usuario.findOne({_id: mensaje.id_sender})

        if(sender && receiver) {
            if(receiver.onesignal_id) {
                sendNotification({
                    app_id: process.env.ONESIGNAL_ID,
                    content_available: true,
                    include_player_ids: [receiver.onesignal_id],
                    headings: {
                       en: `Nuevo mensaje de ${sender.nombre}`
                    },
                    contents: {
                       en: `${mensaje.texto}`
                    },
                    subtitle: {
                       en: "StayFit"
                    }
                 })
            }
        }

        return true;
    }
}