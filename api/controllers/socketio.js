/*
*
* CLASE SOCKET PARA CHATS
*
*/

var { io } = require('../index')
const Mensaje = require('../models/Mensaje')
const {
    insertMensaje,
    insertIdChat,
    getIdChat,
    desconectar,
    enviarNotificacion
} = require('./mensaje')
const Usuario = require('../models/Usuario')
const {
	AuthError,
	AdminError,
	ErrorUpdate,
	ErrorInsert,
	ErrorDelete,
	ElementNotFound
} = require('../errors');


/*
* Funcion principal que indica que en el path /chat, vamos a ver todas las conexiones y
* funciones principales del chat.
* 'connection': Primer argumento, nombre de funcion, que guarda la información de los
*               usuarios conectados a la aplicacion.
*  onConnect: funcion donde se guarda la respuesta de 'connection', donde podremos interactuar
*             con el usuario.
*/
io.of('/chat').on('connection', onConnect)
// http://localhost:3000/chat
function onConnect(client) {
    /*
    *   Función 'online': es el principal listener, que el cliente emite, donde obtenemos
    *                      los datos del usuario.
    *   'id_usuario': el id del usuario que se acaba de conectar.
    *   'fn': funcion callback, que va a retornar al usuario una vez que finalice la ejecucion
    *         del proceso. Retorna true.
    */
    client.on('online', (id_usuario, fn) => {
        // Guardo en variable 'data' los datos del usuario.
        const data = {
            id_usuario: id_usuario,
            id_chat: client.id
        }

        /**
         * Función que busca un usuario, y se le actualiza el id_chat con el client.id
         */
        insertIdChat(data)
        
        client.emit('usuarioConectado', id_usuario)
    })

    /* 
    *   'mensajeNuevo': funcion listener que crea un nuevo mensaje privado.
    *   'data': son los datos que el usuario envía.
    *                   data {   
    *                       id_sender: id del usuario que envía el mensaje.
    *                       id_receiver: id del usuario que recibe el mensaje.
    *                       texto: el texto del mensaje.
    *                   }
    *   'fn': funcion callback que se envía al usuario que devuelve un JSON con una 
    *         variable llamada: 'status', contiene 3 estados
    *                       Status:
    *                               - missed: mensaje perdido, no se pudo guardar.
    *                               - sended: mensaje guardado, pero no entregado. (Usuario no esta conectado)
    *                               - committed: mensaje entregado. (Usuario conectado)
    */
    client.on('mensajeNuevo', async(data, fn) => {
        /**
         * Funcion que inserta un nuevo mensaje a la base de datos. Se le envía el data.
         * Retorna: 'true' si se pudo guardar el mensaje.
         *          'false' si no se pudo guardar el error.
         */
        var mensaje = await insertMensaje(data)

        if(mensaje) {
             /**
             * Si el usuario que va a recibir el mensaje esta conectado, va a devolver
             * id_chat con un valor. Si no, va a devolver: ''
             */
            const id_receiver = await getIdChat(data.id_receiver)
            const {id_chat} = id_receiver
            
            // Si usuario esta conectado:
            if(id_chat) {
                //Funcion que le envía el mensaje al usuario elegido.
                client.broadcast.to(id_chat).emit('mensajePrivado', {_id: mensaje._id, texto: mensaje.texto})

                fn({
                    status: 'committed',
                    id_mensaje: mensaje._id
                })
            } else {
                enviarNotificacion(mensaje)

                fn({
                    status: 'sended',
                    id_mensaje: mensaje._id
                })
            }
        } else {
            fn({
                status: 'missed',
            })
        }
    })

    /**
     * 'disconnect': funcion listener que sirve para conocer si un usuario se ha desconectado
     *              o no.
     */
    client.on('desconectar', () => {
        //Funcion que elimina el id_chat.
        desconectar(client.id)
        console.log('desconectado')
    })
}