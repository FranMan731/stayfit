import React, { Component } from 'react'
import { YellowBox, View, Text } from 'react-native'
import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux'
import FlashMessage from 'react-native-flash-message'
import Splash from './views/Splash'
import Walkthrough from './views/Walkthrough'
import Escoger from './views/Escoger'
import Login from './views/Login'
import SignupCoach from './views/SignupCoach'
import SignupAlumno from './views/SignupAlumno'
import Alumnos from './views/Coach/Alumnos'
import PerfilAlumno from './views/Coach/PerfilAlumno'
import MiFicha from './views/Alumno/MiFicha'
import {observer} from 'mobx-react/native'
import UsuarioStore from './stores/UsuarioStore'
import EvaluacionAlumno from './views/Coach/EvaluacionAlumno'
import ActualizarFicha from './views/Coach/ActualizarFicha'
import CrearPlan_ElegirEntrenamientos from './views/Coach/CrearPlan_ElegirEntrenamientos'
import CrearPlan_ElegirEjercicios from './views/Coach/CrearPlan_ElegirEjercicios'
import CrearPlan_ElegirFechas from './views/Coach/CrearPlan_ElegirFechas'
import CrearPlan_AsignarRutina from './views/Coach/CrearPlan_AsignarRutina'
import CalendarioAlumnos from './views/Coach/CalendarioAlumnos'
import CalendarioDetalle from './views/CalendarioDetalle'
import DetalleRutina from './views/DetalleRutina'
import PlanEntrenamiento from './views/PlanEntrenamiento'
import Historial from './views/Historial'
import MiPerfil from './views/Coach/MiPerfil'
import Asistencia from './views/Asistencia'
import ListaChats from './views/ListaChats'
import Chat from './views/Chat'
import Empezar from './views/Alumno/Empezar'
import Perfil from './views/Alumno/Perfil'
import { MenuProvider } from 'react-native-popup-menu'
import axios from 'axios'
import AgendarCita from './views/Coach/AgendarCita'
import RecuperarContrasena from './views/RecuperarContrasena'
import { getStatusBarHeight } from 'react-native-status-bar-height'

@observer
export default class App extends Component {
   componentWillMount () {
      axios.defaults.baseURL = DOMINIO + '/graphql'
   }

   render () {
      return (
         <MenuProvider>
            <View style={{height: getStatusBarHeight(true)}}/>

            <Router>
               <Scene key={'root'}>
                  <Scene key={'splash'} component={Splash} hideNavBar initial/>
                  <Scene key={'walkthrough'} component={Walkthrough} hideNavBar/>
                  <Scene key={'escoger'} component={Escoger} hideNavBar/>
                  <Scene key={'login'} component={Login} hideNavBar/>
                  <Scene key={'signup_coach'} component={SignupCoach} hideNavBar/>
                  <Scene key={'signup_alumno'} component={SignupAlumno} hideNavBar/>

                  <Scene
                     key={'tabs_coach'}
                     tabBarPosition={'bottom'}
                     tabBarStyle={{backgroundColor: '#fff', borderTopColor: '#cfd8dc', height: 56}}
                     swipeEnabled={false}
                     animationEnabled={false}
                     showLabel={false}
                     hideNavBar
                     lazy           // Cargar escena solo cuando entramos
                     showIcon
                     tabs>
                     <Scene key={'alumnos'} title={'Alumnos'} component={Alumnos} hideNavBar/>
                     <Scene key={'calendario_alumnos'} title={'Calendario'} component={CalendarioAlumnos} hideNavBar/>
                     <Scene key={'mi_perfil'} title={'Mi perfil'} component={MiPerfil} hideNavBar/>
                     <Scene key={'lista_chats'} title={'Mensajes'} component={ListaChats} hideNavBar/>
                  </Scene>

                  <Scene
                     key={'tabs_alumno'}
                     tabBarPosition={'bottom'}
                     tabBarStyle={{backgroundColor: '#fff', borderTopColor: '#cfd8dc', height: 56}}
                     swipeEnabled={false}
                     animationEnabled={false}
                     showLabel={false}
                     hideNavBar
                     lazy           // Cargar escena solo cuando entramos
                     showIcon
                     tabs>
                     <Scene key={'perfil'} component={Perfil} hideNavBar/>
                     <Scene key={'mi_ficha'} component={MiFicha} hideNavBar/>
                     <Scene key={'calendario'} component={CalendarioDetalle} hideNavBar/>
                     <Scene key={'lista_chats'} title={'Mensajes'} component={ListaChats} hideNavBar/>
                  </Scene>

                  <Scene key={'chat'} component={Chat} hideNavBar/>

                  <Scene key={'perfil_alumno'} component={PerfilAlumno} hideNavBar/>
                  <Scene key={'evaluacion_alumno'} component={EvaluacionAlumno} hideNavBar/>
                  <Scene key={'actualizar_ficha'} component={ActualizarFicha} hideNavBar/>
                  <Scene key={'plan_entrenamiento'} component={PlanEntrenamiento} hideNavBar/>
                  <Scene key={'historial'} component={Historial} hideNavBar/>
                  <Scene key={'asistencia'} component={Asistencia} hideNavBar/>
                  <Scene key={'agendar_cita'} component={AgendarCita} hideNavBar/>

                  <Scene key={'calendario_detalle'} component={CalendarioDetalle} hideNavBar/>
                  <Scene key={'detalle_rutina'} component={DetalleRutina} hideNavBar/>
                  <Scene key={'empezar'} component={Empezar} hideNavBar/>

                  <Scene key={'crear_plan_elegir_entrenamiento'} component={CrearPlan_ElegirEntrenamientos} hideNavBar/>
                  <Scene key={'crear_plan_elegir_ejercicios'} component={CrearPlan_ElegirEjercicios} hideNavBar/>
                  <Scene key={'crear_plan_elegir_fechas'} component={CrearPlan_ElegirFechas} hideNavBar/>
                  <Scene key={'crear_plan_asignar_rutina'} component={CrearPlan_AsignarRutina} hideNavBar/>

                  <Scene key={'recuperar_contrasena'} component={RecuperarContrasena} hideNavBar/>
               </Scene>
            </Router>

            <FlashMessage position="bottom" duration={3000} autoHide/>
         </MenuProvider>
      )
   }
}

//export const DOMINIO = 'http://192.168.1.106'
export const DOMINIO = 'http://173.82.168.76:65000'

export const COLORES_ENTRENAMIENTO = {
   'FUNCIONAL': {
      strong: '#005ccd',
      light: '#4ba7ff'
   },
   'HIIT': {
      strong: '#ff509d',
      light: '#ffc8f4'
   },
   'NUCLEO': {
      strong: '#0eb21b',
      light: '#c5ffcd'
   },
   'FUERZA': {
      strong: '#806052',
      light: '#ffd39f'
   },
   'EQUILIBRIO': {
      strong: '#2c7780',
      light: '#2cccff'
   },
   'AEROBICO': {
      strong: '#804856',
      light: '#ff656a'
   },
}
