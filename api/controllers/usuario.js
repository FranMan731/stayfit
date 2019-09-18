const Mensaje = require('../models/Mensaje')
const Usuario = require('../models/Usuario')
const Plan = require('../models/Plan')
const Ejercicio = require('../models/Ejercicio')
const moment = require('moment');

const bcrypt = require('bcryptjs');

const {
	AuthError,
	AdminError,
	UserNotFound,
	PasswordError,
	SignupError,
	ErrorUpdate,
	ErrorInsert,
	UserExist,
	ErrorDelete,
	NoProfesorError,
	ErrorGet
} = require('../errors');

module.exports = {
    insertUsuario: async(data) => {
        // verificamos si ya existe el usuario
		if (await Usuario.findOne({ email: data.email })) throw new UserExist();

		// encriptamos la contraseña, y la guardamos nuevamente reemplazando la anterior
		data.password = await bcrypt.hashSync(data.password, 10);

		const usuario = new Usuario(data);

		await usuario.save((err) => {
			if (err) throw new ErrorInsert();
        });
        
        return usuario
    },

    getUsuario: async(_id) => {
        return await Usuario.findById(_id, (error, usuario) => {
            if (error) throw new ErrorGet();
            else return usuario;
        });
    },

    getUsuarios: async() => {
        let datos = await Usuario.find().select('-password -__v');
        let resultados = [];

        if(datos) {
            for (let index = 0; index < datos.length; index++) {
                let element = datos[index];
                let rol = element.rol;
                if(rol == 'ALUMNO') {
                    resultados.push({
                        _id: element._id,
                        nombre: element.nombre,
                        email: element.email,
                        rol: rol,
                        avatar: element.avatar,
                        estatura: element.estatura,
                        objectivo: element.objetivo,
                        observacion: element.observacion,
                        motivacion: element.motivacion,
                        nivel: element.nivel,
                        ciudad: element.ciudad,
                        peso: element.peso,
                        imc: element.imc,
                        grasa: element.grasa,
                        masa_muscular: element.masa_muscular,
                        coach: element.coach
                    });
                }
    
                if(rol == 'PROFESOR') {
                    resultados.push({
                        _id: element._id,
                        nombre: element.nombre,
                        email: element.email,
                        rol: element.rol,
                        avatar: element.avatar,
                        rut: element.rut,
                        experiencias: element.experiencia,
                        especialidades: element.especialidades,
                        sexo: element.sexo,
                    });
                }
                if(rol == 'ADMIN') {
                    resultados.push({
                        _id: element._id,
                        nombre: element.nombre,
                        email: element.email,
                        rol: element.rol,
                        avatar: element.avatar
                    })
                }
            }
        }

        return resultados
    },
    
    getProfesorPorAlumno: async(id_usuario) => {
        const usuario = await Usuario.findById(id_usuario)
        let profesor = ''

        if(usuario) {
            const id = usuario.coach.id_usuario

            profesor = await Usuario.findById(id)
                .select('coach -rol -__v -alumno -password -coach')
        }
        
        return profesor
    },

    getAlumnosPorProfesor: async(_id) => {
        const usuario = await Usuario.findById(_id)
        const alumnos = []

        if(usuario) {
            if(usuario.alumnos) {
                for (let index = 0; index < usuario.alumnos.length; index++) {
                    const element = usuario.alumnos[index]['id_alumno'];
                    
                    const alumno = await Usuario.findById(element)
                        .select('-rol -__v -alumno -password -coach -especialidad -experiencia')
                    
                    alumnos.push(alumno)
                }
            }
        }

        return alumnos
    },

    getAlumnosPorProfesorConPlan: async(_id) => {
        const usuario = await Usuario.findById(_id)
        const alumnos = [];
        
        if(usuario) {
            if(usuario.alumnos) {
                for (let i = 0; i < usuario.alumnos.length; i++) {
                    const id_alumno = usuario.alumnos[i]['id_alumno'];

                    const alumno = await Usuario.findById(id_alumno)
                        .select('-rut -rol -__v -alumnos -password -coach -especialidades -experiencia')
                    
                    let planes = await Plan.find({id_usuario: id_alumno, finalizado: false}).select('-_id -id_usuario -fechas._id -ejercicios._id -ejercicios.ejercicios._id -__v')
                    let plan_respuesta = '';

                    if(planes) {
                        for (let j = 0; j < planes.length; j++) {
                            const plan = planes[j];
                            let entrenamiento = [];

                            if(!plan.finalizado) {
                                for (let l = 0; l < plan.ejercicios.length; l++) {
                                    const tipo_entrenamiento_ejercicio = plan.ejercicios[l].tipo_entrenamiento;
                                    const ejercicios = plan.ejercicios[l].ejercicios;
                                    let fechas = [];
                                    
    
                                    for (let k = 0; k < plan.fechas.length; k++) {
                                        const tipo_entrenamiento = plan.fechas[k].tipo_entrenamiento;
                                        const fecha = plan.fechas[k].fecha;
    
                                        if(tipo_entrenamiento === tipo_entrenamiento_ejercicio) {
                                            fechas.push(fecha)
                                        }
                                    }
    
                                    entrenamiento.push({
                                        tipo_entrenamiento: tipo_entrenamiento_ejercicio,
                                        fechas,
                                        cantidad_ejercicios: ejercicios.length,
                                        ejercicios
                                    })
                                }
    
                                plan_respuesta = {
                                    nombre: plan.nombre,
                                    ejercicios: entrenamiento
                                }
                            }
                        }
                    }

                    if(plan_respuesta !== '') {
                        alumnos.push({
                            alumno: alumno,
                            plan: plan_respuesta
                        })
                    } else {
                        alumnos.push({
                            alumno: alumno,
                            plan: null
                        })
                    }
                }
            }  
        }
        
        return alumnos
    },

    updateUsuario: async(_id, data) => {
        if (data.password) data.password = await bcrypt.hash(data.password, 10);
		else delete data.password;

		return Usuario.findOneAndUpdate(
			{ _id: _id },
			{ $set: data },
			{ new: true } // return modified document
		).catch(() => {
			throw new ErrorUpdate();
		});
    },
}

// Cambiar si usuario puede tener mas de un plan.
async function getFechasDePlan(plan) {
    let menor = new Date().setHours(0, 0, 0, 0)
    let mayor = new Date().setHours(0, 0, 0, 0)

    for (let z = 0; z < plan.length; z++) {
        for (let i = 0; i < plan[z].actividad.length; i++) {
            let element_i = plan[z].actividad[i];
            for (let j = 0; j < element_i.entrenamiento.length; j++) {
                let fecha = new Date(element_i.entrenamiento[j].fecha).setHours(0, 0, 0, 0)

                if(moment(mayor).isSameOrAfter(fecha)) {
                    mayor = fecha
                }

                if(moment(menor).isSameOrBefore(fecha)) {
                    menor = fecha
                }
            }
        }
    }

    return {
        menor: menor,
        mayor: mayor
    }
}