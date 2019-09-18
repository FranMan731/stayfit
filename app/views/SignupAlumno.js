import React, {Component} from 'react'
import {View, Text, Image, Keyboard, StyleSheet, TouchableOpacity, TextInput, AsyncStorage, ActivityIndicator} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import { showMessage } from "react-native-flash-message"
import UsuarioStore from '../stores/UsuarioStore'
import { SIGNUP_ALUMNO } from '../graphql/signupAlumno'
import axios from 'axios'

export default class SignupAlumno extends Component {
   state = {
      nombre: '',
      email: '',
      password: '',
      password_confirm: ''
   }

   resetFields() {
      this.setState({
         nombre: '',
         email: '',
         password: '',
         password_confirm: ''
      })
   }

   verifyFields() {
      const {nombre, email, password, password_confirm } = this.state

      if (nombre === '') {
         showMessage({
            message: 'No has ingresado tu nombre',
            type: 'danger',
         })
         return false
      }
      if (email === '') {
         showMessage({
            message: 'No has ingresado tu email',
            type: 'danger',
         })
         return false
      }
      if (password === '') {
         showMessage({
            message: 'No has ingresado tu contraseña',
            type: 'danger',
         })
         return false
      }
      if (password_confirm === '') {
         showMessage({
            message: 'No has ingresado tu verificacion de contraseña',
            type: 'danger',
         })
         return false
      }
   }

   submit() {
      const {nombre, email, password, password_confirm } = this.state

      if (this.verifyFields() === false)
         return false

      if (password !== password_confirm) {
         showMessage({
            message: 'Las contraseñas no coinciden',
            type: 'danger',
         })
         return false
      }

      this.setState({ loading: true })

      axios.post('', {
         query: SIGNUP_ALUMNO,
         variables: {
            nombre,
            email,
            password
         }

      }).then(async (response) => {
         const result = response.data

         this.setState({loading: false})

         if (result.errors) {
            switch (result.errors[0].name) {
               case 'UserExist':
                  showMessage({
                     message: 'El email ya esta en uso',
                     type: 'danger',
                  })
                  this.resetFields()
                  break

               case 'SignupError':
                  showMessage({
                     message: 'Error al crear tu usuario',
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

         // Creamos usuarios para el store
         const user = {
            id: result.data.signupAlumno.id_usuario,
            nombre,
            email,
            rol: 'coach',
            avatar: null,
            token: result.data.signupAlumno.token
         }

         UsuarioStore.setUsuario(user)
         UsuarioStore.setLogged(true)

         AsyncStorage.setItem('user', JSON.stringify(user))
         AsyncStorage.setItem('logged', 'true')

         // Creamos datos_alumno para el store
         const datos_alumno = {
            objetivo: undefined,
            motivacion: undefined,
            peso: [],
            imc: [],
            grasa: [],
            masa_muscular: [],
            edad: undefined,
            sexo: undefined,
            plan: null,
            estatura: undefined
         }

         UsuarioStore.setDatosAlumno(datos_alumno)
         AsyncStorage.setItem('datos_alumno', JSON.stringify(datos_alumno))

         axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`

         Actions.reset('tabs_alumno')

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   render(){
      const {nombre, email, password, password_confirm, loading} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#000'}}>
            <Image style={styles.fondo} source={require('./../imgs/escoger/fondo.jpg')}/>

            <Text style={styles.textHeader}>Ven y entrena con nosotros</Text>
            <View style={styles.lineText}/>

            <View style={styles.containerForm}>
               <View style={styles.containerInput}>
                  <TextInput
                     placeholder={'Nombre'}
                     placeholderTextColor={'#fff'}
                     style={styles.inputText}
                     autoCapitalize={'none'}
                     onChangeText={(text) => this.setState({ nombre: text })}
                     value={nombre}
                  />
                  <View style={[styles.line, {opacity: .5}]}/>
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
                  <View style={[styles.line, {opacity: .5}]}/>
                  <TextInput
                     placeholder={'Confirmar contraseña'}
                     placeholderTextColor={'#fff'}
                     style={styles.inputText}
                     autoCapitalize={'none'}
                     onChangeText={(text) => this.setState({ password_confirm: text })}
                     value={password_confirm}
                     secureTextEntry
                  />
               </View>

               <TouchableOpacity onPress={() => this.submit()} style={styles.btnForm}>
                  <Text style={styles.btnFormText}>REGISTRARSE</Text>
                  {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
               </TouchableOpacity>
            </View>

            <View style={styles.footer}>
               <View style={styles.line}/>

               <View style={styles.row}>
                  <Text style={{ ...material.body1White }}>Si ya tienes una cuenta</Text>
                  <TouchableOpacity onPress={() => Actions.push('login', {type: 'alumno'})}>
                     <Text style={styles.btnRegistrate}>INICIA SESION</Text>
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
      position: 'absolute',
      bottom: 160,
      width: '100%',
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