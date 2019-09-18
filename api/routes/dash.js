const express = require('express');
const { verify_login } = require('./../middlewares/auth');
const Ejercicio = require('../models/Ejercicio');
const Usuario = require('../models/Usuario');
const Plan = require('../models/Plan');
const Objetivo = require('../models/Objetivo');
const { updateUsuario } = require('../controllers/usuario');
const api = express.Router();
const {	getXLSXusuarios, getXLSXejercicios } = require('../controllers/exportar');
const exportar = require('./../controllers/exportar')
const bcrypt = require('bcryptjs');

const { agregarBlacklistRecuperar, verificarTokenCambio } = require('./../controllers/blacklist');

const jsonwebtoken = require('jsonwebtoken');
const { sendEmail } = require('../controllers/email');

//EJERCICIOS
api.post('/ejercicios', async (req, res) => {
	var { nombre, actividad } = req.body;

	// verificamos si ya existe el ejercicio
	if (await Ejercicio.findOne({ nombre: nombre }))
		return res.status(200).send({ status: false, message: 'Ejercicio ya existe' });

	const ejercicio = new Ejercicio({ nombre, actividad });

	await ejercicio.save((err, ejercicio) => {
		if (err) return res.status(200).send({ status: false, message: 'No se pudo crear ejercicio' });

		return res.status(200).send({
			status: true,
			message: 'Se creó el ejercicio',
			id: ejercicio._id
		});
	});
});

api.get('/ejercicios', async (req, res, next) => {
	await Ejercicio.find().exec((err, ejercicios) => {
		if (err)
			return res.status(200).send({ status: false, message: 'Error al obtener ejercicios. Intente luego..' });

		return res.status(200).send({
			status: true,
			ejercicios
		});
	});
});

api.put('/ejercicios/:id', async (req, res, next) => {
	const id = req.params.id;
	const { nombre, actividad } = req.body;
	const editar = {
		nombre: nombre,
		actividad: actividad
	};

	await Ejercicio.findOneAndUpdate(
		{ _id: id },
		{ $set: editar },
		{ new: true } // return modified document
	)
		.then(() => {
			return res.status(200).send({
				status: true,
				message: 'Ejercicio ha sido actualizado'
			});
		})
		.catch(() => {
			return res.status(200).send({
				status: false,
				message: 'No se ha podido actualizar el ejercicio, intente luego.'
			});
		});
});

api.delete('/ejercicios/:id', async (req, res, next) => {
	const id = req.params.id;

	await Ejercicio.findOneAndRemove({ _id: id })
		.then(() => {
			console.log('Se elimino');
			return res.status(200).send({
				status: true,
				message: 'Ejercicio ha sido eliminado'
			});
		})
		.catch(() => {
			console.log('NO Se elimino');
			return res.status(200).send({
				status: false,
				message: 'No se ha podido eliminar el ejercicio, intente luego.'
			});
		});
});

api.get('/ejercicios/exportar', async (req, res, next) => {
	const archivoEjercicio = getXLSXejercicios();

	if(archivoEjercicio) {
		return res.status(200).send({
			status: true,
			archivoEjercicio
		})
	} else {
		return res.status(200).send({
			status: false
		})
	}
});

//USUARIOS
api.get('/usuarios', async (req, res) => {
	await Usuario.find().select('_id nombre email rol coach alumnos').exec(async (err, usuarios) => {
		if (err) return res.status(200).send({ status: false, message: 'Error al obtener usuarios' });

		return res.status(200).send({
			status: true,
			usuarios
		});
	});
});

api.put('/usuarios/:id', async (req, res) => {
	const { id } = req.params;
	const data = req.body;

	await Usuario.findOneAndUpdate(
		{ _id: id },
		{ $set: data },
		{ new: true } // return modified document
	)
		.then(() => {
			return res.status(200).send({
				status: true,
				message: 'El usuario fue editado'
			});
		})
		.catch(() => {
			return res.status(200).send({
				status: false,
				message: 'El usuario no fue editado'
			});
		});
});

api.delete('/usuarios/:id', async (req, res) => {
	const { id } = req.params;

	await Plan.deleteMany({ id_usuario: id })
		.then(async () => {
			await Usuario.findById(id, (err, usuario) => {
				let eliminado = false;

				if (err) return res.status(200).send({ status: false, message: 'No se pudo eliminar' });

				for (let i = 0; i < usuario.alumnos.length; i++) {
					const element = usuario.alumnos[i];

					if (element.id_alumno == id_alumno) {
						eliminado = true;

						usuario.alumnos.pull(element);
					}
				}

				usuario.save(async (err) => {
					if (err) return res.status(200).send({ status: false, message: 'No se pudo eliminar' });

					await Usuario.findOneAndRemove({ _id: id }).then(() => {
						return res.status(200).send({
							status: true,
							message: 'El usuario fue eliminado.'
						});
					});
				});
			});
		})
		.catch(() => {
			return res.status(200).send({
				status: false,
				message: 'El usuario no fue eliminado.'
			});
		});
});

api.get('/profesor/:id', async (req, res) => {
	const { id } = req.params;

	await Usuario.findById(id).exec(async (err, usuario) => {
		if (err) return res.status(200).send({ status: false, message: 'Error al obtener el usuario' });

		if (usuario) {
			const id_profesor = usuario.coach.id_usuario;
			let profesor = '';

			if (id_profesor) {
				profesor = await Usuario.findById(id_profesor).select('_id nombre');

				if(profesor !== null) {
					return res.status(200).send({
						status: true,
						profesor
					});
				} else {
					return res.status(200).send({
						status: true,
						profesor
					});
				}
			} else {
				return res.status(200).send({
					status: true,
					profesor
				});
			}
		}
	});
});

api.get('/alumnos/:id', async (req, res) => {
	const { id } = req.params;

	await Usuario.findById(id).exec(async (err, usuario) => {
		if (err) return res.status(200).send({ status: false, message: 'Error al obtener el usuario' });

		if (usuario) {
			const alumnos = usuario.alumnos;
			let respuesta = [];
			for (let i = 0; i < alumnos.length; i++) {
				const alumno = alumnos[i];

				const item = await Usuario.findById(alumno.id_alumno).select('_id nombre');

				if(item !== null) {
					respuesta.push({
						_id: item._id,
						nombre: item.nombre
					});
				}
			}

			return res.status(200).send({
				status: true,
				alumnos: respuesta
			});
		}
	});
});

api.delete('/alumnos/:id', async (req, res) => {
	const id = req.params.id;

	await Usuario.findById(id, async (err, usuario) => {
		if (err) return res.status(200).send({ status: false, message: 'No se pudo eliminar el alumno' });

		let id_coach = '';

		console.log(usuario)
		id_coach = usuario.coach.id_usuario;
		usuario.coach = '';

		const profesor = await Usuario.findById(id_coach);
		console.log('PROFESOR VIEJO: ' + profesor);
		for (let i = 0; i < profesor.alumnos.length; i++) {
			const alumno = profesor.alumnos[i];

			if (alumno.id_alumno.toString() === id.toString()) {
				profesor.alumnos.pull(alumno);
			}
		}

		console.log('PROFESOR NUEVO: ' + profesor);
		profesor.save();
		usuario.save();

		console.log('ALUMNO: ' + usuario);
		return res.status(200).send({
			status: true,
			message: 'El usuario fue quitado'
		});
	});
});

api.post('/profesor', async (req, res) => {
	const { id_uno, id_dos } = req.body;

	console.log(req.user);

	const usuario_uno = await Usuario.findById(id_uno);
	const usuario_dos = await Usuario.findById(id_dos);

	let alumno = '';
	let profesor = '';

	let repetido = false;

	if (usuario_uno.rol === 'PROFESOR') {
		alumno = usuario_dos;
		profesor = usuario_uno;
	} else {
		alumno = usuario_uno;
		profesor = usuario_dos;
	}

	console.log(profesor.alumnos);
	profesor.alumnos.forEach((item) => {
		if (item.id_alumno.toString() === alumno._id.toString()) {
			repetido = true;
		}
	});

	if (repetido) {
		return res.status(200).send({
			status: false,
			message: 'Alumno ya fue agregado a profesor.'
		});
	} else {
		const input = {
			id_alumno: alumno._id
		};

		profesor.alumnos.push(input);
		profesor.save((err) => {
			if (err) throw new ErrorUpdate();
		});

		const id_alumno = alumno._id;

		const data = {
			coach: {
				id_usuario: profesor._id
			}
		};

		updateUsuario(id_alumno, data);

		return res.status(200).send({
			status: true,
			message: 'Alumno agregado.'
		});
	}
});

api.get('/usuarios/exportar', async (req, res, next) => {
	getXLSXusuarios().then((result) => {
		res.send({ filename: result })
	});
})

api.post('/cambiar-password', async(req, res, next) => {
	let { password, token } = req.body;

	const verificar = await verificarTokenCambio(token);

	if(verificar.status) {
		try {
			const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
			console.log(decoded)
			const _id = decoded.id_usuario;
			password = await bcrypt.hashSync(password, 10);
	
			const data = {
				password
			};
	
			await Usuario.findOneAndUpdate(
				{ _id: _id },
				{ $set: data },
				{ new: true } // return modified document
			).then(() => {
				agregarBlacklistRecuperar(token);

				return res.status(200).send({
					status: true,
					message: "Se ha modificado la contraseña."
				})
			}).catch(() => {
				return res.status(200).send({
					status: false,
					message: "No se ha podido modificar la contraseña."
				})
			});
		} catch(err) {
			// err
			console.log(err)
			return res.status(200).send({
				status: false,
				message: "El token que ha enviado es incorrecto, intente luego nuevamente."
			})
		}
	} else {
		return res.status(200).send({
			status: false,
			message: verificar.message
		})
	}
	
})

api.post('/recuperar', async(req, res, next) => {
	const { email } = req.body;

	if(email) {
		const usuario = await Usuario.findOne({email: email})
		if(usuario) {
			// enviamos el correo de bienvenida
			const data = {
				id_usuario: usuario._id,
				email: usuario.email
			} 

			const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn: '15d' });

			const enviar = await sendEmail({
				to: email,
				from: 'envios@cncs.cl',
				template: 'recupero',
				token: token
			})

			if(enviar) {
				return res.status(200).send({
					status: true,
					message: "Se envió un email con el enlace para recuperar la contraseña."
				})
			}
		} else {
			return res.status(200).send({
				status: false,
				message: "Email ingresado no es de un usuario existente."
			})
		}
	} else {
		return res.status(200).send({
			status: false,
			message: "Debe ingresar un email."
		})
	}
})



//Objetivos
api.post('/objetivos', async (req, res) => {
	var { nombre } = req.body;

	// verificamos si ya existe el ejercicio
	if (await Objetivo.findOne({ nombre: nombre }))
		return res.status(200).send({ status: false, message: 'Objetivo ya existe' });

	const objetivo = new Objetivo({ nombre });

	await objetivo.save((err, objetivo) => {
		if (err) return res.status(200).send({ status: false, message: 'No se pudo crear objetivo' });

		return res.status(200).send({
			status: true,
			message: 'Se creó el objetivo',
			id: objetivo._id
		});
	});
});

api.get('/objetivos', async (req, res, next) => {
	await Objetivo.find().exec((err, objetivos) => {
		if (err)
			return res.status(200).send({ status: false, message: 'Error al obtener objetivos. Intente luego..' });

		return res.status(200).send({
			status: true,
			objetivos
		});
	});
});

api.put('/objetivos/:id', async (req, res, next) => {
	const id = req.params.id;
	const { nombre } = req.body;
	const editar = {
		nombre: nombre
	};

	await Objetivo.findOneAndUpdate(
		{ _id: id },
		{ $set: editar },
		{ new: true } // return modified document
	)
		.then(() => {
			return res.status(200).send({
				status: true,
				message: 'Objetivo ha sido actualizado'
			});
		})
		.catch(() => {
			return res.status(200).send({
				status: false,
				message: 'No se ha podido actualizar el objetivo, intente luego.'
			});
		});
});

api.delete('/objetivos/:id', async (req, res, next) => {
	const id = req.params.id;
	
	console.log(id);
	await Objetivo.findOneAndRemove({ _id: id })
		.then(() => {
			console.log('Se elimino');
			return res.status(200).send({
				status: true,
				message: 'Objetivo ha sido eliminado'
			});
		})
		.catch(() => {
			return res.status(200).send({
				status: false,
				message: 'No se ha podido eliminar el objetivo, intente luego.'
			});
		});
});

module.exports = api;
