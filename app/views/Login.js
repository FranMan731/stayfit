import React, {Component} from 'react'
import {
   View,
   Text,
   Image,
   ActivityIndicator,
   StyleSheet,
   TouchableOpacity,
   TextInput,
   Keyboard,
   AsyncStorage,
   Dimensions
} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { showMessage } from "react-native-flash-message"
import { LOGIN } from '../graphql/login'
import UsuarioStore from './../stores/UsuarioStore'
import { getAlumnos, getCalificacion } from '../utils/coach'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getProfesorAlumno } from '../utils/alumno'

export default class Login extends Component {
   state = {
      texto_coach: 'Se parte de nuestro equipo de profesionales',
      texto_alumno: 'Ven y entrena con nosotros',
      email: '',
      password: '',
      loading: false
   }

   onPressSignup() {
      const {type} = this.props

      if (type === 'coach') {
         Actions.push('signup_coach')
      }
      else {
         Actions.push('signup_alumno')
      }
   }

   login() {
      const {email, password} = this.state

      Keyboard.dismiss()

      if (password === '' || email === '') {
         showMessage({
            message: 'Completa todos los campos',
            type: 'danger',
         })
         return false
      }

      this.setState({ loading: true })

      axios.post('', {
         query: LOGIN,
         variables: {
            email,
            password,
            onesignal_id: UsuarioStore.onesignal_id
         }

      }).then(async (response) => {
         const result = response.data

         this.setState({loading: false})

         if (result.errors) {
            switch (result.errors[0].name) {
               case 'PasswordError':
                  showMessage({
                     message: 'Verifica tu contraseña',
                     type: 'danger',
                  })
                  break

               case 'UserNotFound':
                  showMessage({
                     message: 'El email no esta registrado',
                     type: 'danger',
                  })
                  break

               default:
                  showMessage({
                     message: 'Error',
                     type: 'danger',
                  })
                  break
            }

            return false
         }

         Keyboard.dismiss()

         // Creamos usuario para el store
         const user = {
            id: result.data.login.rol === 'PROFESOR' ? result.data.login.id_usuario : result.data.login.alumno.id_usuario,
            nombre: result.data.login.rol === 'PROFESOR' ? result.data.login.nombre : result.data.login.alumno.nombre,
            email,
            rol: result.data.login.rol,
            avatar: result.data.login.avatar,
            puntuacion: result.data.login.calificacion,
            token: result.data.login.token
         }

         UsuarioStore.setUsuario(user)
         UsuarioStore.setLogged(true)

         AsyncStorage.setItem('user', JSON.stringify(user))
         AsyncStorage.setItem('logged', 'true')

         axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`

         if (user.rol === 'PROFESOR') {
            await getAlumnos()
            await getCalificacion()
            Actions.reset('tabs_coach')
         }
         else {
            // Creamos usuarios para el store
            const datos_alumno = {
               objetivo: result.data.login.alumno.objetivo,
               motivacion: result.data.login.alumno.motivacion,
               peso: result.data.login.alumno.peso,
               imc: result.data.login.alumno.imc,
               grasa: result.data.login.alumno.grasa,
               masa_muscular: result.data.login.alumno.masa_muscular,
               edad: result.data.login.alumno.edad,
               sexo: result.data.login.alumno.sexo,
               plan: result.data.login.plan,
               estatura: result.data.login.alumno.estatura
            }

            UsuarioStore.setDatosAlumno(datos_alumno)
            AsyncStorage.setItem('datos_alumno', JSON.stringify(datos_alumno))

            await getProfesorAlumno()

            Actions.reset('tabs_alumno')
         }

      }).catch((error) => {
         console.warn(error)

         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   render(){
      const {type} = this.props
      const {email, password, texto_coach, texto_alumno, loading} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#000'}}>
            <Image style={styles.fondo} source={require('./../imgs/escoger/fondo.jpg')}/>

            <Text style={styles.textHeader}>{type === 'coach' ? texto_coach : texto_alumno}</Text>
            <View style={styles.lineText}/>

            <View style={styles.containerForm}>
               <View style={styles.containerInput}>
                  <TextInput
                     placeholder={'Email'}
                     placeholderTextColor={'#fff'}
                     style={styles.inputText}
                     autoCapitalize={'none'}
                     onChangeText={(text) => this.setState({ email: text })}
                     value={email}
                  />
                  <View style={[styles.line, {opacity: .5}]}/>
                  <TextInput
                     placeholder={'Contraseña'}
                     placeholderTextColor={'#fff'}
                     style={styles.inputText}
                     autoCapitalize={'none'}
                     onChangeText={(text) => this.setState({ password: text })}
                     value={password}
                     secureTextEntry
                  />
               </View>

               <TouchableOpacity onPress={() => this.login()} style={styles.btnForm}>
                  <Text style={styles.btnFormText}>INICIAR SESION</Text>
                  {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
               </TouchableOpacity>

               <View style={styles.row}>
                  <Text style={{ ...material.body1White }}>Olvidaste tu contraseña?</Text>
                  <TouchableOpacity onPress={() => Actions.push('recuperar_contrasena')}>
                     <Text style={styles.btnRegistrate}>RECUPERAR</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.footer}>
               <View style={styles.line}/>

               <View style={styles.row}>
                  <Text style={{ ...material.body1White }}>Si aún no tienes una cuenta</Text>
                  <TouchableOpacity onPress={() => this.onPressSignup()}>
                     <Text style={styles.btnRegistrate}>REGISTRATE</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, 1)', 'rgba(40, 184, 245, 1)']} style={styles.gradient}/>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   fondo: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: .7
   },
   textHeader: {
      ...systemWeights.semibold,
      color: '#fff',
      fontSize: 18,
      width: 250,
      textAlign: 'center',
      marginBottom: 5,
      marginTop: 30,
      alignSelf: 'center'
   },
   lineText: {
      backgroundColor: '#fff',
      height: 2,
      width: 50,
      alignSelf: 'center'
   },
   containerForm: {
      marginTop: 80,
      zIndex: 5,
      paddingHorizontal: 20
   },
   containerInput: {
      backgroundColor: 'rgba(40, 184, 245, .5)',
      borderRadius: 10,
      marginBottom: 20
   },
   inputText: {
      color: '#fff',
      height: 56
   },
   line: {
      width: '100%',
      height: 1,
      backgroundColor: '#fff'
   },
   btnForm: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: 5,
   },
   btnRegistrate: {
      ...material.body1,
      ...systemWeights.bold,
      padding: 10,
      color: '#fbc02d'
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 250,
      zIndex: 0
   },
   spinner: {
      position: 'absolute',
      right: 20,
      width: 12,
      top: 15,
      height: 12
   }
})