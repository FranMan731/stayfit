const Mensaje = require('../../models/Mensaje')
const Usuario = require('../../models/Usuario')
const { getMensajesChat, getChats } = require('../../controllers/mensaje')
const {
	AuthError,
	AdminError,
	ErrorUpdate,
	ErrorInsert,
	ErrorDelete,
	ElementNotFound
} = require('../../errors');

module.exports = {
	getChats: async(parent, args, {user}) => {
		let datos = await getChats(user)

		return datos
	},

    getMensajesChat: async(parent, args, {user}) => {
			let id_receiver = user.id_usuario
			let id_sender = args._id

			const mensajes = await getMensajesChat(id_sender, id_receiver)

			return mensajes
	}
}