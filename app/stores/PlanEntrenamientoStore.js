import {observable} from 'mobx'

class PlanEntrenamientoStore {
   @observable tipos_entrenamiento = []
   @observable ejercicios = []
   @observable fechas = []

   /*
   tipos_entrenamiento: ['FUERZA', 'NUCLEO']

   ejercicios: [
      { _id: '123', nombre: 'Ejercicio 1', series: 2, repeticiones: 10, tiempo: 30, tipo_entrenamiento: 'FUERZA' }
      { _id: '1234', nombre: 'Ejercicio 2', tipo_entrenamiento: 'NUCLEO' }
   ]

   fechas: [
      { fecha: '2019-03-21', tipo_entrenamiento: 'FUERZA' }
      { fecha: '2019-03-18', tipo_entrenamiento: 'NUCLEO' }
   ]
    */

   addTipoEntrenamiento(value) {
      console.warn(value)
      this.tipos_entrenamiento.push(value)
   }

   removeTipoEntramiento(value) {
      const index = this.tipos_entrenamiento.findIndex(x => x.tipo === value)
      this.tipos_entrenamiento.splice(index, 1)
   }

   resetTipoEntrenamiento() {
      this.tipos_entrenamiento = []
   }

   addEjercicio(value) {
      this.ejercicios.push(value)
   }

   removeEjercicio(id) {
      const index = this.ejercicios.findIndex(x => x._id === id)
      this.ejercicios.splice(index, 1)
   }

   addFecha(value) {
      this.fechas.push(value)
   }

   removeFecha(index) {
      this.fechas.splice(index, 1)
   }

   resetFechas() {
      this.fechas = []
   }
}

export default new PlanEntrenamientoStore()