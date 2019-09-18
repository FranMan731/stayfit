const { makeExecutableSchema, gql } = require('apollo-server-express')
const resolvers = require('./resolvers/index')

const typeDefs = gql`
    scalar JSON

##########################################################
######## CLASS ###########################################
##########################################################

### Usuario ###
type Usuario {
    _id: ID
    id_chat: String
    nombre: String
    email: String
    password: String
    edad: Int
    rut: String
    estatura: Float
    experiencia: String
    especialidades: [String]
    rol: Rol
    avatar: String
    objetivo: [Objetivo]
    observacion: String
    motivacion: String
    calificacion: Float
    cantidad_calificacion: Float
    nivel: Int
    sexo: String
    coach: ID
    alumnos: [Alumnos]
    ciudad: String
    peso: [Float]
    imc: [Float]
    grasa: [Float]
    masa_muscular: [Float]
    onesignal_id: String
    deshabilitar: Boolean
}

enum Rol {
    ALUMNO
    PROFESOR
    ADMIN
}

type Alumnos {
    id_alumno: ID
}
### Fin Usuario ###
###################
#### Ejercicio ####
type Ejercicio {
    _id: ID
    nombre: String
    descripcion: String
    actividad: ActividadEnum
    imagen: String
}

enum ActividadEnum {
    FUNCIONAL
    HIIT
    FUERZA
    NUCLEO
    EQUILIBRIO
    AEROBICO
}

### FIN Ejercicio ###
#####################
####    PLAN    #####

type Plan {
    _id: ID
    id_usuario: ID!
    nombre: String
    ejercicios: [EjerciciosPlan]
    fechas: [FechasPlan]
}

type EjerciciosPlan {
    tipo_entrenamiento: ActividadEnum
    ejercicios: [EjerciciosEjerciciosPlan]
}

type EjerciciosEjerciciosPlan {
    id_ejercicio: ID!
    nombre: String
    series: Int
    repeticiones: Int
    duracion: Int
}

type FechasPlan {
    fecha: String,
    tipo_entrenamiento: ActividadEnum
}
##### FIN PLAN ######
#####################
####### Chat ########

type Mensaje {
    _id: ID
    id_sender: ID
    id_receiver: ID
    visto: Boolean
    texto: String
    fecha: String
}
##### FIN Chat #####
####################
####### Cita #######

type Cita {
    _id: ID
    id_alumno: ID
    id_profesor: ID
    hora: String
    fecha: String
    notificado: Boolean
}

##### FIN Cita #####
####################
#### Objetivo ######

type Objetivo {
    _id: ID
    nombre: String
}

### FIN Objetivo ###
####################
#########################################################
###### FIN CLASS ########################################
#########################################################
#----------------------------#
#           INPUT            #
#----------------------------#
#### USUARIO ####
input UsuarioInput {
    _id: ID
    id_chat: String
    nombre: String
    email: String
    password: String
    edad: Float
    rut: String
    estatura: Float
    experiencia: String
    especialidades: [String]
    rol: Rol
    avatar: String
    objetivo: [ObjetivoInput]
    observacion: String
    motivacion: String
    calificacion: Float
    cantidad_calificacion: Float
    nivel: Int
    sexo: String
    coach: ID
    alumnos: [AlumnosInput]
    ciudad: String
    peso: [Float]
    imc: [Float]
    grasa: [Float]
    masa_muscular: [Float]
    onesignal_id: String
    deshabilitar: Boolean
}

input ObjetivoUsuarioInput {
    id: ID
    nombre: String
}

input AlumnosInput {
    id_alumno: ID
}
#### FIN USUARIO ####
#####################
##### EJERCICIO #####
input EjercicioInput {
    _id: ID
    nombre: String!
    descripcion: String
    actividad: ActividadEnum
    imagen: String
}

### FIN Ejercicio ###
#####################
####    PLAN    #####
input PlanInput {
    _id: ID
    id_usuario: ID!
    nombre: String
    ejercicios: [EjerciciosPlanInput]
    fechas: [FechasPlanInput]
}

input EjerciciosPlanInput {
    tipo_entrenamiento: ActividadEnum
    ejercicios: [EjerciciosEjerciciosPlanInput]
}

input EjerciciosEjerciciosPlanInput {
    id_ejercicio: ID!
    nombre: String
    series: Int
    repeticiones: Int
    duracion: Int
}

input FechasPlanInput {
    fecha: String,
    tipo_entrenamiento: ActividadEnum
}
##### FIN PLAN ######
#####################
###### Mensaje ######

input MensajeInput {
    _id: ID
    id_sender: ID
    id_receiver: ID
    visto: Boolean
    texto: String
    fecha: String
}

### FIN Mensaje #####
#####################

####### Cita #######

input CitaInput {
    _id: ID
    id_alumno: ID
    id_profesor: ID
    hora: String
    fecha: String
    notificado: Boolean
}

##### FIN Cita #####
####################

input ObjetivoInput {
    _id: ID
    nombre: String
}
################################################################
################################################################
################################################################
################################################################
################################################################
type Query {
    #----------------------------#
    #        Usuarios            #
    #----------------------------#
    login(email: String!, password: String!, onesignal_id: String): JSON
    fb_login(access_token: String!, onesignal_id: String!): JSON
    getUsuario(_id: ID!): Usuario
    getUsuarios: JSON
    logout: Boolean

    getAlumnos: [Usuario]
    getAlumnosPorProfesor(_id: ID!): [Usuario]

    getProfesores: [Usuario]
    getProfesorPorAlumno(_id: ID!): Usuario

    getAlumnosPorProfesorConPlan(_id: ID!): JSON

    getCalificacion(_id: ID): JSON
    #----------------------------#
    #        Ejercicio           #
    #----------------------------#
    getEjercicios: [Ejercicio]
    getEjercicio(_id: ID): Ejercicio
    getEjerciciosPorTipo: JSON
    
    #----------------------------#
    #            Plan            #
    #----------------------------#
    getPlanes: [Plan]
    getPlanesPorAlumno(_id: ID): JSON
    getPlan(_id: ID): JSON
    getPlanActual(_id: ID): JSON
    getPlanesPorMes(_id: ID): JSON
    getHistorial(_id: ID): JSON

    #----------------------------#
    #      Chat y Mensaje        #
    #----------------------------#
    getMensajesChat(_id: ID!): JSON
    getChats: JSON

    #----------------------------#
    #            Cita            #
    #----------------------------#
    getCitas: [Cita]
    getCitaAlumno(_id: ID): JSON
    getCitasPorAlumno(id_alumno: ID): JSON

    #----------------------------#
    #        Objetivo            #
    #----------------------------#
    getObjetivos: [Objetivo]
    getObjetivo(_id: ID): Objetivo
}

type Mutation {
   #----------------------------#
   #        Usuarios            #
   #----------------------------#
    login(email: String!, password: String!, onesignal_id: String): JSON
    signupCoach(input: UsuarioInput): JSON
    signupAlumno(email: String!, password: String!, nombre: String!): JSON
    
    contactoEmail(_id: ID, mensaje: String): Boolean

    insertUsuario(input: UsuarioInput): Usuario
    updateUsuario(input: UsuarioInput): Usuario
    deleteUsuario(_id: ID!): JSON

    calificarProfesor(_id: ID, calificacion: Float): Usuario
    ### Le ingresa un nuevo coach 
    insertAlumno(input: UsuarioInput): JSON
    deleteAlumno(id_alumno: ID): JSON

    #----------------------------#
    #        Ejercicio           #
    #----------------------------#
    insertEjercicio(input: EjercicioInput): Ejercicio
    updateEjercicio(input: EjercicioInput): Ejercicio
    deleteEjercicio(_id: ID!): JSON

    #----------------------------#
    #            Plan            #
    #----------------------------#
    insertPlan(input: PlanInput): Plan
    updatePlan(input: PlanInput): Plan
    deletePlan(_id: ID!): JSON
    finalizarPlan(_id: ID!): JSON
    
    #----------------------------#
    #            Cita            #
    #----------------------------#
    insertCita(input: CitaInput): Cita
    updateCita(input: CitaInput): Cita
    deleteCita(_id: ID!): JSON
}
`;
   
module.exports = makeExecutableSchema({ typeDefs, resolvers })