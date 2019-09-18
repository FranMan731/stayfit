const createError = require('apollo-errors').createError

module.exports = {
   AuthError: createError('AuthError', {
      message: 'No ha ingresado al usuario.'
   }),

   SinPermisos: createError('SinPermisos', {
      message: 'No tiene permisos para realizar la siguiente tarea.'
   }),
   
   NotYourUser: createError('NotYourUser', {
      message: 'No es su usuario.'
   }),

   ErrorUpdate: createError('ErrorUpdate', {
      message: 'Error al editar'
   }),

   DataExist: createError('DataExist', {
      message: 'Ya existe el elemento que quiere ingresar.'
   }),

   ErrorInsert: createError('ErrorInsert', {
      message: 'Error al crear elemento.'
   }),

   ErrorGet: createError('ErrorGet', {
      message: 'Error al obtener datos'
   }),

   ErrorDelete: createError('ErrorDelete', {
      message: 'Error al eliminar'
   }),

   AdminError: createError('AdminError', {
      message: 'No tienes permisos de administrador'
   }),

   UserNotFound: createError('UserNotFound', {
      message: 'Usuario no existe'
   }),

   NotAlumn: createError('NotAlumn', {
      message: 'No es un alumno'
   }),

   PasswordError: createError('PasswordError', {
      message: 'Contraseña incorrecta'
   }),

   SignupError: createError('SignupError', {
      message: 'No se pudo crear el usuario'
   }),

   CamposVaciosError: createError('CamposVaciosError', {
      message: 'No se puede crear usuario con campos vacíos.'
   }),

   EmailNoValidoError: createError('EmailNoValidoError', {
      message: 'Debe ingresar un email válido'
   }),

   UserExist: createError('UserExist', {
      message: 'El usuario ya existe'
   }),

   NoProfesorError: createError('NoProfesorError', {
      message: 'El usuario debe ser un Profesor.'
   }),

   ElementNotFound: createError('ElementNoFound', {
      message: 'Elemento no encontrado'
   })
}
