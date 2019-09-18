import {observable} from 'mobx'

class UsuarioStore {
   @observable logged
   @observable id
   @observable token
   @observable nombre
   @observable email
   @observable rol
   @observable avatar
   @observable onesignal_id

   /* ALUMNO */
   @observable plan
   @observable objetivo = null
   @observable motivacion = null
   @observable peso = []
   @observable imc = []
   @observable grasa = []
   @observable masa_muscular = []
   @observable estatura
   @observable edad
   @observable sexo
   @observable profesor

   /* COACH */
   @observable alumnos = []
   @observable planes_mes = []
   @observable calificacion = 0

   setPlanes(value) {
      this.planes_mes = value
   }

   setDatosAlumno(alumno) {
      console.warn(alumno)
      this.objetivo = alumno.objetivo
      this.motivacion = alumno.motivacion
      this.peso = alumno.peso.length === 0 ? [''] : alumno.peso
      this.imc = alumno.imc.length === 0 ? [''] : alumno.imc
      this.grasa = alumno.grasa.length === 0 ? [''] : alumno.grasa
      this.masa_muscular = alumno.masa_muscular.length === 0 ? [''] : alumno.masa_muscular
      this.edad = alumno.edad
      this.sexo = alumno.sexo
      this.estatura = alumno.estatura
      this.plan = alumno.plan
   }

   setPlanActual(plan) {
      console.warn(plan)
      this.plan = plan
   }

   terminarPlan(type, id_alumno = null) {
      if (type === 'coach') {
         this.alumnos.find(x => x.alumno._id === id_alumno).plan = null
      }
      else {
         this.plan = null
      }
   }

   setAlumnos(value) {
      this.alumnos = value
   }

   updateAlumno(id, alumno) {
      const index = this.alumnos.findIndex(x => x.alumno._id === id)

      console.warn(this.alumnos)

      if (index !== -1) {
         console.warn('update')
         this.alumnos[index].alumno = alumno
      }

   }

   setPlanAlumno(id, plan) {
      this.alumnos.find(x => x.alumno._id === id).plan = plan
   }

   setProfesor(id) {
      this.profesor = id
   }

   setUsuario(user) {
      this.id = user.id
      this.nombre = user.nombre
      this.email = user.email
      this.token = user.token
      this.rol = user.rol
      this.avatar = user.avatar
      this.calificacion = user.calificacion
   }

   setOnesignalID(val) {
      this.onesignal_id = val
   }

   setLogged(value) {
      this.logged = value
   }

   removeAlumno(id) {
      this.alumnos = this.alumnos.filter(x => x.alumno._id !== id)
   }

   setCalificacion(value) {
      this.calificacion = value
   }

   reset() {
      this.id = null
      this.nombre = null
      this.email = null
      this.token = null
      this.rol = null
      this.avatar = null
      this.objetivos = null
      this.motivacion = null
      this.calificacion = 0
      //this.peso = null
      //this.imc = null
      //this.grasa = null
      //this.masa_muscular = null
      this.avatar = null
      this.profesor = null
   }
}

export default new UsuarioStore()