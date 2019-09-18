import React, {Component} from 'react'
import {View, AsyncStorage, Text, Button} from 'react-native'
import {Actions,} from 'react-native-router-flux'
import axios from 'axios'
import UsuarioStore from '../stores/UsuarioStore'
import { GET_ALUMNOS_PROFESOR_PLAN } from '../graphql/getAlumnosPorProfesorConPlan'
import { getAlumnos, getPlanesPorMes, getCalificacion, getObjetivos } from '../utils/coach'
import { getPlanActual, getProfesorAlumno } from '../utils/alumno'

export default class Splash extends Component {
   async componentWillMount() {
      const logged = await AsyncStorage.getItem('logged')

      await getObjetivos()

      if (logged === 'true') {
         const user = JSON.parse(await AsyncStorage.getItem('user'))

         axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`

         UsuarioStore.setUsuario(user)
         UsuarioStore.setLogged(true)

         if (user.rol === 'PROFESOR') {
            await getAlumnos()
            await getPlanesPorMes()
            await getCalificacion()

            Actions.reset('tabs_coach')
         }
         else {
            const datos_alumno = JSON.parse(await AsyncStorage.getItem('datos_alumno'))
            UsuarioStore.setDatosAlumno(datos_alumno)

            await getProfesorAlumno()
            const plan = await getPlanActual(UsuarioStore.id)

            UsuarioStore.setPlanActual(plan)

            Actions.reset('tabs_alumno')
         }
      }
      else {
         Actions.reset('walkthrough')
      }
   }

   render(){
      return(
         <View/>
      )
   }
}