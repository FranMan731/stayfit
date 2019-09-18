/**
 * Con este controlador, agregamos los tokens a la lista negra
 * De esta forma, los tokens que se encuentren en esa lista, no seran
 * tomados en cuenta y no son aceptados para realizar llamadas.
 *
 * Se usa para cuando un usuario hace logout, o bloqueamos un usuario
 */

const Blacklist = require('./../models/Blacklist')

const getToken = (authorization) => {
   // con este regex obtenemos el token, sin el prefijo 'Bearer'
   var token = authorization.replace(/['"]+/g, '');
   // ejecutamos el regex y retornamos el token
   return token
}

module.exports = {
   addToBlacklist: async (user, authorization) => {
      // obtenemos el token del authorization
      const token = getToken(authorization)

      // user.exp tiene el tiempo en epoch unix (ej: 155885848) indicando cuando expira el token
      // lo pasamos a Date para que mongo a traves de un index, lo elimine automaticamente cuando llegue ese tiempo
      const blacklist = new Blacklist({ token, expireAt: new Date(user.exp * 1000) })

      await blacklist.save((err) => {
         if (err) console.log('No se pudo añadir a blacklist')
      })
   },

   agregarBlacklistRecuperar: async(token) => {
      const blacklist = new Blacklist({ token, expireAt: new Date() })

      await blacklist.save((err) => {
         if (err) console.log('No se pudo añadir a blacklist')
         return false;
         
      })

      return true;
   },

   // esta funcion la usamos como Middleware
   // recibe el token en el req, y verificamos que no este bloqueada
   // mostramos error si esta bloqueada
   verifyBlacklist: async (req, res, next) => {
      // vemos si existe el token en la llamada
      if (req.headers.authorization) {
         // obtenemos el token del authorization
         const token = getToken(req.headers.authorization)

         // buscamos si el token esta en la lista de blacklist
         const result = await Blacklist.findOne({ token })

         // si esta en blacklist, mostramos error
         if (result)
            return res.end('Token bloqueado')
      }
      
      next()
   },

   verificarTokenCambio: async(token) => {
      const result = await Blacklist.findOne({ token })

      if (result) {
         return {
            status: false,
            message: "Token ya utilizado, vuelva a solicitar el cambio de contraseña."
         };
      } else {
         return {
            status: true
         };
      }
   }
}

