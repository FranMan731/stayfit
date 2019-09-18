const { isInstance, formatError } = require('apollo-errors')

/*
* esta funcion recibe todos los errores que genera graphql
* podemos retornar un error por default si es un error interno
*/
module.exports = {
   formatError: function(error) {
      const { originalError } = error;

      // vemos si es un error que hemos lanzado nosotros (con throw new Error...)
      if (isInstance(originalError))
         return formatError(error)

      // si no, es un error generado por el servidor
      return formatError({name: 'InternalError', error: error})
   }
}