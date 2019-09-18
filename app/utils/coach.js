import axios from 'axios'
import { GET_ALUMNOS_PROFESOR_PLAN } from '../graphql/getAlumnosPorProfesorConPlan'
import UsuarioStore from '../stores/UsuarioStore'
import { GET_PLANES_MES } from '../graphql/getPlanesPorMes'
import { GET_CALIFICACION } from '../graphql/getCalificacion'
import { GET_OBJETIVOS } from '../graphql/getObjetivos'
import AppStore from '../stores/AppStore'

export const getAlumnos = async () => {
   await axios.post('', {
      query: GET_ALUMNOS_PROFESOR_PLAN,
      variables: {
         _id: UsuarioStore.id
      }

   }).then((response) => {
      let result = response.data

      if (result.errors) {
         alert('Error al obtener alumnos')
         return false;
      }

      result = result.data.getAlumnosPorProfesorConPlan

      UsuarioStore.setAlumnos(result)

   }).catch((error) => {
      alert(error.message)
   })
}

export const getObjetivos = async () => {
   await axios.post('', {
      query: GET_OBJETIVOS,

   }).then((response) => {
      let result = response.data

      if (result.errors) {
         alert('Error al obtener objetivos')
         return false;
      }

      result = result.data.getObjetivos

      console.warn('get objetivos', result)

      AppStore.setObjetivos(result)

   }).catch((error) => {
      alert(error.message)
   })
}

export const getCalificacion = async () => {
   await axios.post('', {
      query: GET_CALIFICACION,
      variables: {
         _id: UsuarioStore.id
      }

   }).then((response) => {
      let result = response.data

      if (result.errors) {
         alert('Error al obtener calificacion')
         return false;
      }

      result = result.data.getCalificacion

      UsuarioStore.setCalificacion(result.calificacion.calificacion)

   }).catch((error) => {
      alert(error.message)
   })
}

export const getPlanesPorMes = async () => {
   await axios.post('', {
      query: GET_PLANES_MES,
      variables: {
         _id: UsuarioStore.id
      }

   }).then((response) => {
      let result = response.data

      if (result.errors) {
         alert('Error al obtener planes')
         return false;
      }

      result = result.data.getPlanesPorMes.meses

      console.warn(result)

      UsuarioStore.setPlanes(result)

   }).catch((error) => {
      alert(error.message)
   })
}