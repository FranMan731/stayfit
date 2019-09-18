/* ESTE ARCHIVO CONTIENE LAS FUNCIONES RELACIONADAS CON ESTE MODELO */

const Usuario = require('../../models/Usuario');
const Plan = require('../../models/Plan');
import email from '../../controllers/email';

const {
	insertUsuario,
	getUsuario,
	getUsuarios,
	getProfesorPorAlumno,
	getAlumnosPorProfesor,
	getAlumnosPorProfesorConPlan,
	updateUsuario
} = require('../../controllers/usuario')
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
	CamposVaciosError,
	EmailNoValidoError,
	NoProfesorError,
	ErrorGet
} = require('../../errors');
const bcrypt = require('bcryptjs');
const { get_user_data, get_user_id } = require('../../controllers/facebook');
const jsonwebtoken = require('jsonwebtoken');
const { addToBlacklist, verificarTokenCambio } = require('../../controllers/blacklist');
const { sendEmail } = require('../../controllers/email');
const validator = require("email-validator");

/*
* recibimos session del context
* session = {id: xxx, email: xxx, etc..}
*/

module.exports = {
	//Sin probar
	fb_login: async (parent, args) => {
		// variable para indicar si el usuario existe o no
		let user_exist = true;

		// obtenemos el id usuario de facebook
		const user_id = await get_user_id(args.access_token);

		// obtenemos datos basicos de la cuenta
		const user_fb = await get_user_data(user_id, args.access_token);

		// buscamos en la BD el usuario segun el email de su cuenta de facebook
		let usuario = await Usuario.findOne({ email: user_fb.email });

		// si no encontramos ningun usuario que tenga ese email, creamos la cuenta
		if (!usuario) {
			// indicamos que la cuenta no existe
			user_exist = false;

			// como contraseña utilizamos su access_token encriptado
			const password = await bcrypt.hash(args.access_token, 10);

			usuario = new Usuario({
				nombre: user_fb.name,
				email: user_fb.email,
				email_verificado: true,
				avatar: user_fb.picture,
				onesignal_id: args.onesignal_id,
				password
			});

			// creamos el usuario
			await usuario.save((err) => {
				if (err) throw new SignupError();
			});
		} else {
			// si ya existe, actualizamos el onesignal id (por las dudas que logueo desde otro celular)
			await usuario.update({ onesignal_id: args.onesignal_id });
		}

		// guardamos datos para el token
		const data = {
			id_usuario: usuario._id,
			rol: usuario.rol
		};

		// generamos json web token
		const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

		// retornamos el id_usuario / token
		return {
			id_usuario: usuario._id,
			email: usuario.email,
			user_exist,
			token
		};
	},

	login: async (parent, args, { session }) => {
		const usuario = await Usuario.findOne({ email: args.email.toLowerCase() });

		// si no encontramos ningun usuario que tenga ese email, mostramos error
		if (!usuario) throw new UserNotFound();

		// verificamos si las contraseñas coinciden
		const is_valid = await bcrypt.compare(args.password, usuario.password);

		// si no coinciden, mostramos error
		if (!is_valid) throw new PasswordError();

		// actualizamos el onesignal id (por las dudas que logueo desde otro celular)
		if (args.onesignal_id) await usuario.update({ onesignal_id: args.onesignal_id });

		// guardamos datos en la cookie
		session.token = {
			id_usuario: usuario._id,
			rol: usuario.rol
		};

		// guardamos datos para el token
		const data = {
			id_usuario: usuario._id,
			rol: usuario.rol
		};

		// generamos json web token
		const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

		if(data.rol === 'ALUMNO') {
			let plan = await Plan.findOne({$and: [{id_usuario: data.id_usuario}, {finalizado: false}]}).select('-__v -_id -id_usuario -ejercicios._id -fechas._id');
			let respuesta_plan = null;
			
			if(plan) {
				respuesta_plan = plan
			}

			return {
				alumno: {
					id_usuario: usuario._id,
					nombre: usuario.nombre,
					edad: usuario.edad,
					estatura: usuario.estatura,
					objetivo: usuario.objetivo,
					observacion: usuario.observacion,
					motivacion: usuario.motivacion,
					nivel: usuario.nivel,
					sexo: usuario.sexo,
					ciudad: usuario.ciudad,
					peso: usuario.peso,
					imc: usuario.imc,
					grasa: usuario.grasa,
					masa_muscular: usuario.masa_muscular
				},
				avatar: usuario.avatar,
				plan: respuesta_plan,
				rol: usuario.rol,
				token
			}
		} else if(usuario.rol === 'PROFESOR'){
			// retornamos el id_usuario y token
			return {
				id_usuario: usuario._id,
				nombre: usuario.nombre,
				avatar: usuario.avatar,
				rol: usuario.rol,
				calificacion: usuario.calificacion,
				token
			};
		} else {
			return {
				id_usuario: usuario._id,
				token
			}
		}
	},

	signupAlumno: async (parent, args) => {
		// Si envia campos vacios
		if(args.email === "" || args.password === "") {
			throw new CamposVaciosError();
		}

		//Verificamos email valido
		if(!validator.validate(args.email)) {
			throw new EmailNoValidoError();
		}

		// verificamos si ya existe el usuario
		if (await Usuario.findOne({ email: args.email.toLowerCase() })) {
			throw new UserExist();
		}

		args.email = args.email.toLowerCase();
		// encriptamos la contraseña, y la guardamos nuevamente reemplazando la anterior
		args.password = await bcrypt.hashSync(args.password, 10);

		const usuario = new Usuario(args);

		// creamos el usuario
		await usuario.save((err) => {
			if (err) throw new SignupError();
		});

		// guardamos datos para el token
		const data = {
			id_usuario: usuario._id,
			nombre: usuario.nombre,
			rol: usuario.rol,
			email: usuario.email
		};

		// generamos token
		const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

		// enviamos el correo de bienvenida
		sendEmail({
			to: args.email,
			from: 'envios@cncs.cl',
			template: 'validacion',
			token: token
		});

		// retornamos el id_usuario / token
		return {
			id_usuario: usuario._id,
			token
		};
	},

	signupCoach: async (parent, { input }) => {
		// Si envia campos vacios
		if(input.email === "" || input.password === "") {
			throw new CamposVaciosError();
		}

		//Verificamos email valido
		if(!validator.validate(input.email)) {
			throw new EmailNoValidoError();
		}
		
		// verificamos si ya existe el usuario
		if (await Usuario.findOne({ email: input.email.toLowerCase() })) {
			throw new UserExist();
		}

		input.email = input.email.toLowerCase();
		// encriptamos la contraseña, y la guardamos nuevamente reemplazando la anterior
		input.password = await bcrypt.hashSync(input.password, 10);
		input.rol = 'PROFESOR';
		
		const usuario = new Usuario(input);

		// creamos el usuario
		await usuario.save((err) => {
			if (err) throw new SignupError();
		});

		// guardamos datos para el token
		const data = {
			id_usuario: usuario._id,
			nombre: usuario.nombre,
			rol: usuario.rol,
			email: usuario.email
		};

		// generamos token
		const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

		// enviamos el correo de bienvenida
		sendEmail({
			to: input.email,
			from: 'envios@cncs.cl',
			template: 'validacion',
			token: token
		});

		// retornamos el id_usuario / token
		return {
			id_usuario: usuario._id,
			token
		};
	},

	logout: async (parent, args, { session, user, req }) => {
		// invalidamos el token
		await addToBlacklist(user, req.headers.authorization);

		// eliminamos la cookie
		session.destroy();

		// reseteamos id de onesgignal
		await Usuario.findOneAndUpdate({ _id: user.id_usuario }, { onesignal_id: '' });

		return true;
	},

	getUsuarios: async (parent, args, { user }) => {
		/*if (!user)
        	throw new AuthError()

      	if (user.rol !== 'ADMIN')
			throw new AdminError()*/

		return  await getUsuarios();
	},

	getUsuario: async(root, { _id }) => {
		let usuario = await getUsuario(_id)
		return usuario
	},

	insertUsuario: async (parent, args, { user }) => {
		var { input } = args

		if (!user)
        	throw new AuthError()

      	if (user.rol !== 'ADMIN')
        	throw new AdminError()

		
		input.email = input.email.toLowerCase();

		return await insertUsuario(input)
	},

	updateUsuario: async (parent, args, { user }) => {
		const { input } = args
		const { _id } = input

		if (!_id) throw new UserNotFound();

		return await updateUsuario(_id, input)
	},

	deleteUsuario: async (parent, args, { user }) => {
		if (!user)
		  throw new AuthError()

		if (user.rol !== 'ADMIN')
		   throw new AdminError()

		await Usuario.findOneAndRemove({ _id: args._id }).catch(() => {
			throw new ErrorDelete();
		});

		return {
			status: true,
			message: "Ha sido eliminado"
		};
	},

	insertAlumno: async (parent, args, { user }) => {
		var { input } = args;
		let repetido = false
		
		if (user.rol !== 'ADMIN')
        	throw new AdminError()
      

		var usuario = await Usuario.findById(input._id);

		if (usuario.rol !== 'PROFESOR') {
			return {
				status: false,
				message: 'El usuario seleccionado debe ser profesor.'
			};
		}

		usuario.alumnos.forEach((item) => {
			if (item == input.alumnos[0]) {
				repetido = true
			}
		});

		if(repetido) {
			return {
				status: false,
				message: 'Alumno ya fue agregado a profesor.'
			};
		}
		
		usuario.alumnos.push(input.alumnos[0]);
		usuario.save((err) => {
			if (err) throw new ErrorUpdate();
		});

		let id_alumno = input.alumnos[0].id_alumno

		let data = {
			coach: {
				id_usuario: input._id
			}
		}
		updateUsuario(id_alumno, data)
		
		return {
			status: true,
			message: 'Alumno agregado.'
		};
	},

	deleteAlumno: (parent, args, { user }) => {
		var { id_alumno } = args;
			
		if (user.rol !== 'ADMIN' && user.rol !== 'PROFESOR')
			throw new AdminError()
		
		return new Promise((resolve, reject) => {
			Usuario.findById(user.id_usuario, (err, usuario) => {
				let eliminado = false

				if (err) throw new ErrorUpdate();

				if (!usuario || usuario == null) throw new ErrorUpdate();

				for (let i = 0; i < usuario.alumnos.length; i++) {
					const element = usuario.alumnos[i]

					if(element.id_alumno == id_alumno) {
						eliminado = true

						usuario.alumnos.pull(element)
					}
				}

				usuario.save((err) => {
					if (err) throw new ErrorUpdate();
				});

				if(eliminado) {
					resolve({
						status: true,
						message: 'Se quitó alumno de la lista del profesor'
					});
				} else {
					resolve({
						status: false,
						message: 'No se ha podido quitar alumno de la lista del profesor'
					});
				}
			});
		});
	},

   	getAlumnos: async (parent, args, { user }) => {
		if (user.rol !== 'ADMIN')
			throw new AdminError()

      	const alumnos = await Usuario.find({rol: 'ALUMNO'})
            .select('-rol -__v -alumno -password -coach -especialidad -experiencia')

      	return alumnos
   	},

	getAlumnosPorProfesor: async(parent, { _id }, { user }) => {
		let alumnos = await getAlumnosPorProfesor(_id)

      	return alumnos
	   },
	   
	getAlumnosPorProfesorConPlan: async(parent, { _id }, { user }) => {
		let alumnos = await getAlumnosPorProfesorConPlan(_id)

      	return alumnos
	},

   	getProfesores: async (parent, args, { user }) => {
      const profesores = await Usuario.find({rol: 'PROFESOR'})
            .select('-rol -__v -password -coach -peso -estatura -edad -nivel')

      return profesores
	},

	getProfesorPorAlumno: async(parent, args, {user}) => {
		let profesor = await getProfesorPorAlumno(args._id)

		return profesor
	},

	contactoEmail: async(parent, { _id, mensaje }, {user}) => {
		const usuario = await Usuario.findById(_id).select('nombre email');

		const enviar = await email.sendEmail({
            to: 'envios@cncs.cl',
            from: 'envios@cncs.cl',
            template: 'contacto',
			nombre: usuario.nombre,
			email: usuario.email,
            mensaje: mensaje
		})
		
		return enviar;
	},

	calificarProfesor: async(parent, { _id, calificacion }, {user}) => {
		const profesor = await Usuario.findById(_id);

  	profesor.cantidad_calificacion = profesor.cantidad_calificacion + 1;
		profesor.total_calificacion = profesor.total_calificacion + calificacion;
		
		profesor.calificacion = profesor.total_calificacion / profesor.cantidad_calificacion;

		await profesor.save((err) => {
			if (err) throw new ErrorInsert();
		});

		return profesor;
	},

	getCalificacion: async(parent, { _id }, {user}) => {
		const calificacion = await Usuario.findById(_id).select('calificacion');

		return {
			calificacion
		};
	}
};