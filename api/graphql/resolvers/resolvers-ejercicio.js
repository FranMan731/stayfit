const Ejercicio = require('../../models/Ejercicio');
const {
	AuthError,
	AdminError,
	ErrorUpdate,
	ErrorInsert,
	ErrorDelete,
    ErrorGet,
    ElementNotFound
} = require('../../errors');

module.exports = {
    insertEjercicio: async(parent, args, {user}) => {
        var { input } = args;
		if (!user)
         throw new AuthError()

      	if (user.rol !== 'ADMIN')
         throw new AdminError()

		// verificamos si ya existe el ejercicio
		if (await Ejercicio.findOne({ nombre: input.nombre })) return {status: false, message: "Ejercicio ya existe"};


		const ejercicio = new Ejercicio(input);

		await ejercicio.save((err) => {
			if (err) throw new ErrorInsert();
		});

		return ejercicio;
    },

    getEjercicios: async(parent, args, { user }) => {
        const ejercicios = await Ejercicio.find().catch(err => { if(err) throw new ErrorGet })

        return ejercicios
    },

	getEjerciciosPorTipo: async(parent, args, { user }) => {
		const ejercicios_todos = await Ejercicio.find();
		const ejercicios = [];

		let funcional = {
			tipo: 'FUNCIONAL',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let hiit = {
			tipo: 'HIIT',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let fuerza = {
			tipo: 'FUERZA',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let nucleo = {
			tipo: 'NUCLEO',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let equilibrio = {
			tipo: 'EQUILIBRIO',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let aerobico = {
			tipo: 'AEROBICO',
			ejercicios: [],
			cant_ejercicios: 0
		};

		let j = 0, k = 0, m = 0, n = 0, o = 0, p = 0;
		
		for (let i = 0; i < ejercicios_todos.length; i++) {
			let ejercicio = ejercicios_todos[i];

			switch(ejercicio.actividad) {
				case 'FUNCIONAL':
					funcional.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});

					j += 1;
					funcional.cant_ejercicios = j;
					break;
				case 'HIIT':
					hiit.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});
					
					k += 1;
					hiit.cant_ejercicios = k;
					break;
				case 'FUERZA':
					fuerza.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});
					
					m += 1;
					fuerza.cant_ejercicios = m;
					break;
				case 'NUCLEO':
					nucleo.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});
					
					n += 1;
					nucleo.cant_ejercicios = n;
					break;
				case 'EQUILIBRIO':
					equilibrio.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});
					
					o += 1;
					equilibrio.cant_ejercicios = o;
					break;
				case 'AEROBICO':
					aerobico.ejercicios.push({
						_id: ejercicio._id,
						nombre: ejercicio.nombre,
						imagen: ejercicio.imagen
					});
					
					p += 1;
					aerobico.cant_ejercicios = p;
					break;
				default:
					break;
			}
		}

		ejercicios.push(funcional, hiit, fuerza, nucleo, equilibrio, aerobico);

		return ejercicios
	},

    getEjercicio: async(parent, { _id }, {user}) => {
        const ejercicio = await Ejercicio.findById(_id).catch(err => { if(err) throw new ErrorGet })

        return ejercicio
    },

    updateEjercicio: async(parent, args, {user}) => {
        const { input } = args;

		if (!user)
        	throw new AuthError()
      
		if (user.rol !== 'ADMIN')
        	throw new AdminError()
      
		if (!input._id) throw new ElementNotFound();

		const editar = {
			nombre: input.nombre,
			actividad: input.actividad
		}

		return Ejercicio.findOneAndUpdate(
			{ _id: input._id },
			{ $set: editar },
			{ new: true } // return modified document
		).catch(() => {
			throw new ErrorUpdate();
		});
    },

    deleteEjercicio: async(parent, {_id}, {user}) => {
		if (!user)
         throw new AuthError()

      	if (user.rol !== 'ADMIN')
		 throw new AdminError()
		 
        await Ejercicio.findOneAndRemove({_id}).catch(() => {
			throw new ErrorDelete();
		});

		return {
			status: true,
			message: "Ha sido eliminado"
		};
    }
}