import {observable} from 'mobx'

class AppStore {
   @observable update_calendario
   @observable update_perfil_alumno
   @observable update_lista_alumnos
   @observable objetivos = []

   setNotification(type, value) {
      this[type] = value
   }

   setObjetivos(value) {
      this.objetivos = value
   }
}

export default new AppStore()