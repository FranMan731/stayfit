import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, AppState, AsyncStorage} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import { showMessage } from "react-native-flash-message"

export default class Empezar extends Component {
   state = {
      ejercicio: {
         fecha: '',
         nombre: '',
         tiempo: 10
      },
      tiempoActual: '00:00',
      timerStart: false
   }

   interval = null
   paused = false
   currentTimer = 0

   componentWillMount() {
      const {ejercicio} = this.props

      let minutes = parseInt(ejercicio.tiempo / 60, 10)
      let seconds = parseInt(ejercicio.tiempo % 60, 10)

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.setState({ tiempoActual: minutes + ':' + seconds })
   }

   componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange)
   }

   componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange)
      clearInterval(this.interval)
   }

   _handleAppStateChange = async (nextAppState) => {
      const {ejercicio} = this.props

      if (nextAppState === 'active') {
         const current = await AsyncStorage.getItem('current')
         const startedAt = await AsyncStorage.getItem('startedAt')
         const secondsElapsed = Math.round(current / 1000) - Math.round(startedAt / 1000)

         if (secondsElapsed < 0) {
            this.currentTimer = 0
         }
         else {
            this.currentTimer = this.currentTimer - secondsElapsed
         }
      }
      else {
         AsyncStorage.setItem('current', new Date().getTime().toString())
      }
   }

   startTimer() {
      const {ejercicio} = this.props

      this.currentTimer = ejercicio.tiempo

      let minutes
      let seconds

      this.setState({ timerStart: true })

      AsyncStorage.setItem('startedAt', new Date().getTime().toString())

      this.interval = setInterval(() => {
         if (!this.paused) {
            minutes = parseInt(this.currentTimer / 60, 10)
            seconds = parseInt(this.currentTimer % 60, 10)

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.setState({ tiempoActual: minutes+':'+seconds})

            if (--this.currentTimer < 0) {
               this.completado()

               clearInterval(this.interval)

               this.setState({
                  timerStart: false,
                  tiempoActual: '00:00'
               })
            }
         }
      }, 1000);
   }

   pauseTimer() {
      this.paused = true

      this.setState({ paused: true })
   }

   continueTimer() {
      this.paused = false

      this.setState({ paused: false })
   }

   stopTimer() {
      clearInterval(this.interval)

      this.setState({
         timerStart: false,
         tiempoActual: '00:00'
      })

      this.completado()
   }

   completado() {
      Actions.pop()

      showMessage({
         message: 'Ejercicio completado',
         type: 'success',
      })
   }

   render(){
      const {ejercicio} = this.props
      const {tiempoActual, timerStart, paused} = this.state

      return(
         <View style={{flex: 1}}>
            <View style={{position: 'absolute', overflow: 'hidden', justifyContent: 'flex-end', width: Dimensions.get('window').width*2, height: Dimensions.get('window').width*2, borderRadius: 2000, backgroundColor: '#ffc5e1', top: -500, alignSelf: 'center'}}>
               <Image style={{bottom: -100, alignSelf: 'center', width: Dimensions.get('window').width, height: Dimensions.get('window').width}} source={require('./../../imgs/empezar/imagen.png')}/>
            </View>

            <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
               <Icon name={'arrow-back'} size={24} color={'#fff'}/>
            </TouchableOpacity>

            <View style={styles.containerEjercicio}>
               <Image style={styles.icono} resizeMode={'contain'} source={require('./../../imgs/crear_plan/nucleo-icono.png')}/>
               <Text style={styles.textEjercicioBig}>{ejercicio.fecha}</Text>
               <Text style={styles.textEjercicioBig}>{ejercicio.nombre}</Text>
               <Text style={styles.textEjercicioSmall}>{ejercicio.tiempo / 60} minutos</Text>
            </View>

            {!timerStart &&
            <TouchableOpacity onPress={() => this.startTimer()} style={styles.btnEmpezar}>
               <IconFontAwesome name={'running'} size={24} color={'#000'}/>
               <Text style={styles.btnEmpezarText}>EMPEZAR</Text>
            </TouchableOpacity>}

            {timerStart &&
            <View>
               {paused &&
               <TouchableOpacity onPress={() => this.continueTimer()} style={styles.btnEmpezar}>
                  <IconFontAwesome name={'play'} size={24} color={'#000'}/>
                  <Text style={styles.btnEmpezarText}>CONTINUAR</Text>
               </TouchableOpacity>}

               {!paused &&
               <TouchableOpacity onPress={() => this.pauseTimer()} style={styles.btnEmpezar}>
                  <IconFontAwesome name={'pause'} size={24} color={'#000'}/>
                  <Text style={styles.btnEmpezarText}>PAUSAR</Text>
               </TouchableOpacity>}

               <TouchableOpacity onPress={() => this.stopTimer()} style={styles.btnEmpezar}>
                  <IconFontAwesome name={'stop'} size={24} color={'#000'}/>
                  <Text style={styles.btnEmpezarText}>DETENER</Text>
               </TouchableOpacity>
            </View>}

            <View style={styles.containerTiempo}>
               <Icon style={styles.iconoRelog} name={'alarm'} size={44} color={'#e9e9e9'}/>
               <Text style={styles.tituloTiempo}>Tiempo</Text>
               <Text style={styles.tiempo}>{tiempoActual}</Text>
            </View>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   tiempo: {
      ...material.title,
      color: materialColors.blackPrimary
   },
   tituloTiempo: {
      ...material.subheading,
      color: '#28b8f5'
   },
   iconoRelog: {
      position: 'absolute',
      bottom: -10,
      left: 10
   },
   containerTiempo: {
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderRadius: 5,
      width: 200,
      alignSelf: 'center',
      marginTop: 50,
      alignItems: 'center',
      paddingVertical: 16
   },
   textEjercicioBig: {
      ...material.subheadingWhite,
      lineHeight: 20
   },
   textEjercicioSmall: {
      ...material.body2White,
      marginTop: 8
   },
   containerEjercicio: {
      alignItems: 'center'
   },
   icono: {
      width: 40,
      height: 40,
      marginBottom: 8
   },
   btnBack: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
      margin: 16
   },
   imagen: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '100%',
   },
   btnEmpezar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 26,
      alignSelf: 'center',
      backgroundColor: '#fbc02d',
      borderRadius: 50,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginTop: 50
   },
   btnEmpezarText: {
      color: materialColors.blackPrimary,
      textAlign: 'center',
      marginLeft: 8
   },
})