const Plan = require('../../models/Plan');
const Ejercicio = require('../../models/Ejercicio');
const Usuario = require('../../models/Usuario');

const moment = require('moment');

const { getAlumnosPorProfesor } = require('../../controllers/usuario');
const {
	AuthError,
	AdminError,
	ErrorUpdate,
	ErrorInsert,
	ErrorDelete,
	ElementNotFound,
	UserNotFound,
	NotAlumn
} = require('../../errors');
const { sendNotification } = require('./../../controllers/onesignal');

module.exports = {
	insertPlan: async (parent, args, { user }) => {
		var { input } = args;
		if (!user) throw new AuthError();

		if (user.rol === 'ALUMNO') throw new AdminError();

		const usuario = await Usuario.findOne({ _id: input.id_usuario });
		if (!usuario) throw new NotAlumn();

		let plan = new Plan(input);

		
		for (let i = 0; i < plan.ejercicios.length; i++) {
			let ejercicios = plan.ejercicios[i].ejercicios;
			
			for (let j = 0; j < ejercicios.length; j++) {
				let ejercicio = ejercicios[j];
				let imagen_ejercicio = await Ejercicio.findById(ejercicio.id_ejercicio)

				plan.ejercicios[i].ejercicios[j].imagen = imagen_ejercicio.imagen;
			}
		}
			
		await plan.save((err) => {
			if (err) throw new ErrorInsert();

			sendNotification({
				app_id: process.env.ONESIGNAL_ID,
				content_available: true,
				include_player_ids: [ usuario.onesignal_id ],
				headings: {
					en: `Plan`
				},
				contents: {
					en: `Se le creó un nuevo plan.`
				},
				subtitle: {
					en: 'StayFit'
				}
			});
		});
		
		return plan;
	},

	getPlanes: async (parent, args, { user }) => {
		return Plan.find();
	},

	getPlanesPorAlumno: async (parent, { _id }, { user }) => {
		const id_alumno = _id;
		let meses = [];
		let semanas = [];

		let resultado_meses_final = [];
		let resultado_semanas_final = [];

		const planes = await Plan.find({ id_usuario: id_alumno });
		const alumno = await Usuario.findOne({ _id: id_alumno });

		if (planes) {
			if (alumno) {
				//Recorro todos los planes
				for (let i = 0; i < planes.length; i++) {
					const plan = planes[i];

					for (let k = 0; k < plan.fechas.length; k++) {
						const fecha = plan.fechas[k];

						meses.push(moment(fecha.fecha).format('YYYY-MM'));
						semanas.push(moment(fecha.fecha).week());
					}
				}

				//Quito lo repetidos
				let x = (datos) => datos.filter((v, i) => datos.indexOf(v) === i);
				const resultado_meses = x(meses);
				const resultado_semanas = x(semanas);

				for (let i = 0; i < planes.length; i++) {
					const plan = planes[i];

					for (let j = 0; j < resultado_meses.length; j++) {
						const mes = resultado_meses[j];
						let planes_entrenamiento = [];

						for (let k = 0; k < plan.ejercicios.length; k++) {
							const datos_ejercicios = plan.ejercicios[k];
							let fechas = [];

							for (let l = 0; l < plan.fechas.length; l++) {
								const datos_fechas = plan.fechas[l];

								if (moment(datos_fechas.fecha).format('YYYY-MM') === mes) {
									if (datos_fechas.tipo_entrenamiento === datos_ejercicios.tipo_entrenamiento) {
										fechas.push(datos_fechas.fecha);
									}
								}
							}

							if (fechas.length > 0) {
								planes_entrenamiento.push({
									_id: plan._id,
									fechas,
									tipo_entrenamiento: {
										nombre: datos_ejercicios.tipo_entrenamiento,
										cantidad_ejercicios: datos_ejercicios.ejercicios.length
									},
									ejercicios: datos_ejercicios.ejercicios
								});
							}
						}

						resultado_meses_final.push({
							mes,
							planes_entrenamiento
						});
					}

					for (let j = 0; j < resultado_semanas.length; j++) {
						const semana = resultado_semanas[j];
						let planes_entrenamiento = [];

						for (let k = 0; k < plan.ejercicios.length; k++) {
							const datos_ejercicios = plan.ejercicios[k];
							let fechas = [];

							for (let l = 0; l < plan.fechas.length; l++) {
								const datos_fechas = plan.fechas[l];

								if (semana === moment(datos_fechas.fecha).week()) {
									if (datos_ejercicios.tipo_entrenamiento === datos_fechas.tipo_entrenamiento) {
										fechas.push(datos_fechas.fecha);
									}
								}
							}

							if (fechas.length > 0) {
								planes_entrenamiento.push({
									_id: plan._id,
									fechas,
									tipo_entrenamiento: {
										nombre: datos_ejercicios.tipo_entrenamiento,
										cantidad_ejercicios: datos_ejercicios.ejercicios.length
									},
									ejercicios: datos_ejercicios.ejercicios
								});
							}
						}

						let startWeek = moment().week(semana).startOf('week');
						let endWeek = moment().week(semana).endOf('week');

						let semanaString =
							moment(startWeek).format('DD') +
							' al ' +
							moment(endWeek).format('DD') +
							' de ' +
							moment(endWeek).locale('es').format('MMMM');

						resultado_semanas_final.push({
							mes: moment(endWeek).format('MM'),
							semana: semanaString,
							planes_entrenamiento
						});
					}
				}
			}
		}

		return {
			meses: resultado_meses_final,
			semanas: resultado_semanas_final
		};
	},

	getPlanesPorMes: async (parent, args, { user }) => {
		const id_profesor = args._id;
		let fechas = [];
		let meses = [];
		let datos = [];
		let resultado = [];

		const alumnos = await getAlumnosPorProfesor(id_profesor);

		if (alumnos) {
			for (let i = 0; i < alumnos.length; i++) {
				const alumno = alumnos[i];

				datos.push({
					_id: alumno._id,
					nombre: alumno.nombre,
					avatar: alumno.avatar,
					fechas: []
				});

				let planes = await Plan.find({ id_usuario: alumno._id });

				if (planes) {
					for (let j = 0; j < planes.length; j++) {
						const plan = planes[j];

						for (let z = 0; z < plan.fechas.length; z++) {
							const fecha = plan.fechas[z].fecha;

							meses.push(moment(fecha).format('YYYY-MM'));
							datos[i].fechas.push(moment(fecha).format('YYYY-MM'));
						}
					}
				}
			}

			let x = (datos) => datos.filter((v, i) => datos.indexOf(v) === i);
			const resultado_meses = x(meses);
			let resultado_datos = null;

			for (let i = 0; i < resultado_meses.length; i++) {
				const mes = resultado_meses[i];
				let alumnos = [];

				for (let j = 0; j < datos.length; j++) {
					const dato = datos[j];
					resultado_datos = x(dato.fechas);

					for (let k = 0; k < resultado_datos.length; k++) {
						const result = resultado_datos[k];

						if (result === mes) {
							alumnos.push({
								_id: dato._id,
								nombre: dato.nombre,
								avatar: dato.avatar
							});
						}
					}
				}

				resultado.push({
					mes,
					alumnos
				});
			}
		}

		return {
			meses: resultado
		};
	},

	getPlanActual: async (parent, args, { user }) => {
		const plan = await Plan.findOne({id_usuario: args._id});
		let respuesta_plan = null;
			
		if(plan) {
			respuesta_plan = plan
		}

		return {
			plan: respuesta_plan
		}
	},

	getPlan: async (parent, { _id }, { user }) => {
		const plan = await Plan.findById(_id);

		if (plan) {
			let ejercicios = plan.ejercicios;
			let fechas = plan.fechas;
			let entrenamiento = [];
			let respuesta = null;

			if (!plan.finalizado) {
				for (let i = 0; i < ejercicios.length; i++) {
					const ejercicio_entrenamiento = ejercicios[i].tipo_entrenamiento;
					let fechas_respuesta = [];

					for (let j = 0; j < fechas.length; j++) {
						const fecha_entrenamiento = fechas[j].tipo_entrenamiento;

						if (fecha_entrenamiento === ejercicio_entrenamiento) {
							fechas_respuesta.push(fechas[j].fecha);
						}
					}

					entrenamiento.push({
						tipo_entrenamiento: ejercicio_entrenamiento,
						fechas: fechas_respuesta,
						cantidad_ejercicios: ejercicios[i].ejercicios.length,
						ejercicios: ejercicios[i].ejercicios
					});
				}

				respuesta = {
					nombre: plan.nombre,
					entrenamiento
				};
			}
			return {
				plan: respuesta
			};
		} else {
			return {
				plan: null
			};
		}
	},

	getHistorial: async (parent, { _id }, { user }) => {
		const planes = await Plan.find({ id_usuario: _id }).catch((err) => {
			throw new UserNotFound();
		});
		let respuesta = [];
		let respuesta_final = [];
		let fechas = [];

		if (planes) {
			for (let j = 0; j < planes.length; j++) {
				const plan_fechas = planes[j].fechas;
				const ejercicios = planes[j].ejercicios;

				for (let x = 0; x < plan_fechas.length; x++) {
					const fecha = plan_fechas[x].fecha;
					const tipo = plan_fechas[x].tipo_entrenamiento;

					//La fecha de HOY es despues a la de fecha?
					if (moment().isAfter(fecha)) {
						let mes = moment(fecha).format('MM');
						let año = moment(fecha).format('YYYY');
						let duracion = [];
						let total = 0;

						fechas.push(año + '-' + mes);

						for (let i = 0; i < ejercicios.length; i++) {
							for (let l = 0; l < ejercicios[i].ejercicios.length; l++) {
								const ejercicio = ejercicios[i].ejercicios[l];

								duracion.push(ejercicio.duracion);
							}

							total = duracion.reduce((partial_sum, a) => partial_sum + a);
						}

						respuesta.push({
							fecha: fecha,
							tipo,
							duracion: total
						});
					}
				}
			}

			if (fechas) {
				let y = (fechas) => fechas.filter((v, i) => fechas.indexOf(v) === i);
				let result_fechas = y(fechas);

				for (let j = 0; j < result_fechas.length; j++) {
					const mesString = moment(result_fechas[j]).locale('es').format('MMMM');
					const añoString = moment(result_fechas[j]).format('YYYY');
					const fecha = moment(result_fechas[j]).format('YYYY-MM');
					let data = [];

					for (let i = 0; i < respuesta.length; i++) {
						const fechaRutina = moment(respuesta[i].fecha).format('YYYY-MM');

						if (fecha === fechaRutina) {
							let diaString = moment(respuesta[i].fecha).locale('es').format('dddd');
							let dia = moment(respuesta[i].fecha).locale('es').format('DD');

							data.push({
								nombre: respuesta[i].tipo,
								fecha: diaString + ', ' + dia + ' de ' + mesString,
								tiempo: respuesta[i].duracion
							});
						}
					}

					respuesta_final.push({
						title: mesString + ' ' + añoString,
						data
					});
				}
			}
		}

		return {
			secciones: respuesta_final
		};
	},

	updatePlan: async (parent, args, { user }) => {
		const { input } = args;

		if (!user) throw new AuthError();

		if (user.rol === 'ALUMNO') throw new AdminError();

		if (!input._id) throw new ElementNotFound();

		return Plan.findOneAndUpdate(
			{ _id: input._id },
			{ $set: input },
			{ new: true } // return modified document
		).catch(() => {
			throw new ErrorUpdate();
		});
	},

	deletePlan: async (parent, { _id }, { user }) => {
		if (!user) throw new AuthError();

		if (user.rol === 'ALUMNO') throw new AdminError();

		await Plan.findOneAndRemove({ _id }).catch(() => {
			throw new ErrorDelete();
		});

		return {
			status: true,
			message: 'Ha sido eliminado'
		};
	},

	finalizarPlan: async (parent, { _id }, { user }) => {
		const id = user.id_usuario;
		const plan = await Plan.findOne({ id_usuario: _id }).catch(() => {
			throw new ErrorDelete();
		});



		if (plan) {
			if (plan.id_usuario == id || user.rol === 'PROFESOR' || user.rol === 'ADMIN') {
				const res = await Plan.deleteOne({ _id: plan._id });

				if (res.deletedCount > 0) {
					const usuario = await Usuario.findById(_id);

					if (usuario) {
						usuario.peso = [];
						usuario.imc = [];
						usuario.grasa = [];
						usuario.masa_muscular = [];

						usuario.save((err) => {
							if (err)
								return {
									status: false,
									message: 'Plan finalizado, pero no se pudo actualizar usuario.'
								};
						});

						console.log(usuario);
						if (user.rol === 'PROFESOR' || user.rol === 'ADMIN') {
							sendNotification({
								app_id: process.env.ONESIGNAL_ID,
								content_available: true,
								include_player_ids: [ usuario.onesignal_id ],
								headings: {
									en: `Plan`
								},
								contents: {
									en: `El plan fue finalizado.`
								},
								subtitle: {
									en: 'StayFit'
								}
							});
						}

						return {
							status: true,
							message: 'Plan finalizado.'
						};
					}
				} else {
					return {
						status: false,
						message: 'No se pudo finalizar el plan.'
					};
				}
			} else {
				return {
					status: false,
					message: 'No tiene permisos para finalizar el plan.'
				};
			}
		} else {
			return {
				status: false,
				message: 'Plan no existe.'
			};
		}
	}
};
