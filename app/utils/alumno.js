import axios from 'axios'
import UsuarioStore from '../stores/UsuarioStore'
import { GET_PLAN_ACTUAL } from '../graphql/getPlanActual'
import { GET_PROFESOR_ALUMNO } from '../graphql/getProfesorPorAlumno'

export const getPlanActual = (id_alumno) => {
   return new Promise((resolve, reject) => {
      axios.post('', {
         query: GET_PLAN_ACTUAL,
         variables: {
            _id: id_alumno
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            alert('Error al obtener plan actual')
            return false;
         }

         resolve(result.data.getPlanActual.plan)

      }).catch((error) => {
         alert(error.message)
      })
   })
}

export const getProfesorAlumno = () => {
   return new Promise((resolve, reject) => {
      axios.post('', {
         query: GET_PROFESOR_ALUMNO,
         variables: {
            _id: UsuarioStore.id
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            alert('Error al obtener profesor del alumno')
            return false;
         }

         if (result.data.getProfesorPorAlumno) {
            UsuarioStore.setProfesor(result.data.getProfesorPorAlumno._id)
         }

         resolve()

      }).catch((error) => {
         alert(error.message)
      })
   })
}