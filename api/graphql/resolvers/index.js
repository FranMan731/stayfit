/* ESTE ARCHIVO CONTIENE TODAS LAS FUNCIONES DISPONIBLES EN GRAPHQL
* Para que este mas ordenado,
* hemos dividido las funciones segun el tipo de modelo en archivos
*/

const GraphQLJSON = require('graphql-type-json')
const UsuarioResolvers = require('./resolvers-usuario')
const EjercicioResolvers = require('./resolvers-ejercicio')
const PlanResolvers = require('./resolvers-plan')
const MensajeResolvers = require('./resolvers-mensaje')
const CitaResolvers = require('./resolvers-cita')
const ObjetivoResolvers = require('./resolvers-objetivos')

module.exports = {
   JSON: GraphQLJSON,

   Query: {
      /** Usuarios */
      login: UsuarioResolvers.login,
      logout: UsuarioResolvers.logout,
      fb_login: UsuarioResolvers.fb_login,
      getUsuarios: UsuarioResolvers.getUsuarios,
      getUsuario: UsuarioResolvers.getUsuario,
      getAlumnos: UsuarioResolvers.getAlumnos,
      getAlumnosPorProfesor: UsuarioResolvers.getAlumnosPorProfesor,
      getProfesores: UsuarioResolvers.getProfesores,
      getProfesorPorAlumno: UsuarioResolvers.getProfesorPorAlumno,

      getAlumnosPorProfesorConPlan: UsuarioResolvers.getAlumnosPorProfesorConPlan,

      getCalificacion: UsuarioResolvers.getCalificacion,

      /** Ejercicio */
      getEjercicios: EjercicioResolvers.getEjercicios,
      getEjercicio: EjercicioResolvers.getEjercicio,
      getEjerciciosPorTipo: EjercicioResolvers.getEjerciciosPorTipo,
      
      /** Plan */
      getPlanes: PlanResolvers.getPlanes,
      getPlanesPorAlumno: PlanResolvers.getPlanesPorAlumno,
      getPlan: PlanResolvers.getPlan,
      getPlanActual: PlanResolvers.getPlanActual,
      getPlanesPorMes: PlanResolvers.getPlanesPorMes,
      getHistorial: PlanResolvers.getHistorial,

      /** Mensaje */
      getMensajesChat: MensajeResolvers.getMensajesChat,
      getChats: MensajeResolvers.getChats,

      /** Cita */
      getCitas: CitaResolvers.getCitas,
      getCitaAlumno: CitaResolvers.getCitaAlumno,
      getCitasPorAlumno: CitaResolvers.getCitasPorAlumno,

      /** Objetivo */
      getObjetivos: ObjetivoResolvers.getObjetivos,
      getObjetivo: ObjetivoResolvers.getObjetivo,
   },
   Mutation: {
      /** Usuarios */
      signupAlumno: UsuarioResolvers.signupAlumno,
      signupCoach: UsuarioResolvers.signupCoach,
      insertUsuario: UsuarioResolvers.insertUsuario,
      updateUsuario: UsuarioResolvers.updateUsuario,
      deleteUsuario: UsuarioResolvers.deleteUsuario,
      
      contactoEmail: UsuarioResolvers.contactoEmail,

      insertAlumno: UsuarioResolvers.insertAlumno,
      deleteAlumno: UsuarioResolvers.deleteAlumno,

      calificarProfesor: UsuarioResolvers.calificarProfesor,
      
      /** Ejercicio */
      insertEjercicio: EjercicioResolvers.insertEjercicio,
      updateEjercicio: EjercicioResolvers.updateEjercicio,
      deleteEjercicio: EjercicioResolvers.deleteEjercicio,

      /** Plan */
      insertPlan: PlanResolvers.insertPlan,
      updatePlan: PlanResolvers.updatePlan,
      deletePlan: PlanResolvers.deletePlan,
      finalizarPlan: PlanResolvers.finalizarPlan,
      
      /** Cita */
      insertCita: CitaResolvers.insertCita,
      updateCita: CitaResolvers.updateCita,
      deleteCita: CitaResolvers.deleteCita,
   },
}