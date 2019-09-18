import React, {Component} from 'react'
import {View, Text, Image, AsyncStorage, StyleSheet, TouchableOpacity, TextInput, Keyboard, ActivityIndicator} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import CollapseHeader from "../components/collapse-header/CollapseHeader"
import CheckBox from 'react-native-check-box'
import { SIGNUP_COACH } from '../graphql/signupCoach'
import { showMessage } from "react-native-flash-message"
import UsuarioStore from '../stores/UsuarioStore'
import axios from 'axios'

export default class SignupCoach extends Component {
   state = {
      nombre: '',
      email: '',
      password: '',
      rut: 0,
      experiencia: '',
      especialidades: [],
      especialidadText: '',
      password_confirm: '',
      isChecked: false
   }

   renderHabilidades() {
      const {especialidades} = this.state

      let arr = []

      especialidades.forEach((x, index) => {
         arr.push(
            <View key={index} style={styles.habilidad}>
               <Text style={styles.especialidadText}>{x}</Text>

               <TouchableOpacity onPress={(x) => this.removeHabilidad(x)} style={styles.btnBorrarHabilidad}>
                  <Icon size={24} name={'x'} color={materialColors.blackTertiary}/>
               </TouchableOpacity>
            </View>
         )
      })

      return arr
   }

   addHabilidad() {
      let {especialidades, especialidadText} = this.state

      if (especialidadText === '') {
         showMessage({
            message: 'Debes escribir una habilidad',
            type: 'danger',
         })

         return
      }
      
      especialidades.push(especialidadText)
      especialidadText = ''

      this.setState({ especialidades, especialidadText })
   }

   removeHabilidad = (habilidad) => {
      let {especialidades} = this.state

      const index = especialidades.findIndex(x => x === habilidad)
      especialidades.splice(index, 1)

      this.setState({ especialidades })
   }

   verifyFields() {
      const {isChecked, nombre, especialidades, email, password, rut, experiencia, } = this.state

      if (!isChecked) {
         showMessage({
            message: 'Debes aceptar los terminos y condiciones',
            type: 'danger',
         })
         return false
      }
      if (nombre === '') {
         showMessage({
            message: 'No has ingresado tu nombre',
            type: 'danger',
         })
         return false
      }
      if (especialidades.length === 0) {
         showMessage({
            message: 'No has ingresado tus especialidades',
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
      if (rut === '') {
         showMessage({
            message: 'No has ingresado tu RUT',
            type: 'danger',
         })
         return false
      }
      if (experiencia === '') {
         showMessage({
            message: 'No has ingresado tu experiencia',
            type: 'danger',
         })
         return false
      }
   }

   submit() {
      const {isChecked, nombre, especialidades, email, password, rut, experiencia, } = this.state

      if (this.verifyFields() === false)
         return false

      this.setState({ loading: true })

      console.warn(nombre, especialidades, email, password, rut, experiencia)

      axios.post('', {
         query: SIGNUP_COACH,
         variables: {
            input: {
               nombre,
               especialidades,
               email,
               password,
               rut,
               experiencia
            }
         }

      }).then(async (response) => {
         const result = response.data

         this.setState({loading: false})

         if (result.errors) {
            if (result.errors[0].name === 'UserExist') {
               showMessage({
                  message: 'El email ya esta en uso',
                  type: 'danger',
               })
            }
            else {
               showMessage({
                  message: 'Error al iniciar sesion',
                  type: 'danger',
               })
            }
            return false
         }

         Keyboard.dismiss()

         // Creamos usuarios para el store
         const user = {
            id: result.data.signupCoach.id_usuario,
            nombre,
            email,
            rol: 'PROFESOR',
            avatar: undefined,
            token: result.data.signupCoach.token
         }

         UsuarioStore.setUsuario(user)
         UsuarioStore.setLogged(true)

         AsyncStorage.setItem('user', JSON.stringify(user))
         AsyncStorage.setItem('logged', 'true')

         axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`

         Actions.reset('tabs_coach')

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   render(){
      const {especialidadText, nombre, especialidades, email, password, rut, experiencia, password_confirm, loading} = this.state

      return(
         <CollapseHeader
            leftItem={'arrow-left'}
            leftItemPress={() => Actions.pop()}
            rightItem={() => null}
            rightItemPress={() => null}
            imageOnPress={() => null}
            title={'Registrarse'}
            subtitle={`Crea tu cuenta como coach`}
            image={require('./../imgs/escoger/fondo.jpg')}
            headerColor={'rgb(40, 184, 245)'}
            headerColorFade={'rgba(98,0,234,0)'}
            borderColor={'transparent'}
            onEndReached={() => null}>
            <View style={[styles.section, {marginTop: 0, paddingBottom: 0 }]}>
               <TextInput
                  placeholder={'Nombre'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={styles.inputText}
                  onChangeText={(text) => this.setState({ nombre: text })}
                  value={nombre}
               />
               <View style={styles.line}/>
               <TextInput
                  placeholder={'Email'}
                  keyboardType={'email-address'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={styles.inputText}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={email}
               />
               <View style={styles.line}/>
               <TextInput
                  placeholder={'Contraseña'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={styles.inputText}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={password}
                  secureTextEntry
               />
               <View style={styles.line}/>
               <TextInput
                  placeholder={'Confirma contraseña'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={styles.inputText}
                  onChangeText={(text) => this.setState({ password_confirm: text })}
                  value={password_confirm}
                  secureTextEntry
               />
               <View style={styles.line}/>
            </View>

            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <View style={styles.row}>
                     <Icon style={styles.sectionIcon} size={24} name={'file-text'}/>
                     <Text style={styles.sectionTitle}>Ingresar rut</Text>
                  </View>
               </View>

               <TextInput
                  placeholder={'Escribir numero'}
                  keyboardType={'numeric'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={styles.inputTextBorder}
                  onChangeText={(text) => this.setState({ rut: text })}
                  value={rut}
               />
            </View>

            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <View style={styles.row}>
                     <Icon style={styles.sectionIcon} size={24} name={'calendar'}/>
                     <Text style={styles.sectionTitle}>Experiencia</Text>
                  </View>

                  <Text style={styles.sectionDescription}>Cuentanos tu experiencia, tu vida profesional</Text>
               </View>

               <TextInput
                  placeholder={'Cuentanos sobre ti'}
                  keyboardType={'numeric'}
                  placeholderTextColor={materialColors.blackTertiary}
                  style={[styles.inputTextBorder, {textAlignVertical: 'top'}]}
                  onChangeText={(text) => this.setState({ experiencia: text })}
                  value={experiencia}
                  numberOfLines={4}
                  multiline
               />
            </View>

            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <View style={styles.row}>
                     <Icon style={styles.sectionIcon} size={24} name={'calendar'}/>
                     <Text style={styles.sectionTitle}>Habilidades</Text>
                  </View>

                  <Text style={styles.sectionDescription}>Agrega todas tus especialidades aqui</Text>
               </View>

               <View style={[styles.row, {marginBottom: 20}]}>
                  <TextInput
                     placeholder={'Agregar mas'}
                     placeholderTextColor={materialColors.blackTertiary}
                     style={styles.inputTextBorder}
                     onChangeText={(text) => this.setState({ especialidadText: text })}
                     value={especialidadText}
                  />

                  <TouchableOpacity onPress={() => this.addHabilidad()} style={styles.btnAgregarHabilidad}>
                     <Icon size={24} name={'plus'} color={'#fbc02d'}/>
                  </TouchableOpacity>
               </View>

               {this.renderHabilidades()}

               <View style={[styles.line, {marginTop: 20}]}/>

               <TouchableOpacity onPress={() => this.submit()} style={styles.btnRegistrame}>
                  <Text style={styles.btnRegistrameText}>REGISTRAME</Text>
                  {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
               </TouchableOpacity>

               <View style={styles.line}/>

               <CheckBox
                  style={{flex: 1, padding: 10}}
                  onClick={()=>{
                     this.setState({
                        isChecked: !this.state.isChecked
                     })
                  }}
                  isChecked={this.state.isChecked}
                  rightText={"Acepta terminos y condiciones"}
                  checkedCheckBoxColor={'#fbc02d'}
                  checkBoxColor={'#fbc02d'}
               />

               <View style={styles.line}/>

               <View style={styles.footer}>
                  <View style={styles.line}/>

                  <View style={[styles.row, {justifyContent: 'center', marginTop: 10}]}>
                     <Text style={{ ...material.body1 }}>Si ya tienes una cuenta</Text>
                     <TouchableOpacity onPress={() => Actions.push('login', {type: 'coach'})}>
                        <Text style={styles.btnRegistrate}>INICIA SESION</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </CollapseHeader>
      )
   }
}

const styles = StyleSheet.create({
   section: {
      marginVertical: 4,
      backgroundColor: '#fff',
      paddingBottom: 10
   },
   sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,.1)',
      marginBottom: 12
   },
   sectionIcon: {
      marginRight: 10,
      color: materialColors.blackPrimary
   },
   sectionTitle: {
      ...material.subheading,
      color: materialColors.blackPrimary
   },
   sectionDescription: {
      ...material.body1,
      marginTop: 6,
      color: materialColors.blackSecondary
   },
   btnAgregarHabilidad: {
      position: 'absolute',
      right: 24
   },
   habilidad: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginVertical: 4
   },
   especialidadText: {
      flex: 1,
      color: materialColors.blackPrimary
   },
   btnBorrarHabilidad: {
      marginRight: 8
   },
   btnRegistrame: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginHorizontal: 16,
      marginVertical: 16
   },
   btnRegistrameText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },

   row: {
      flexDirection: 'row',
      alignItems: 'center'
   },
   rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 20
   },
   header: {
      height: 180,
      backgroundColor: '#000'
   },
   btnLeftHeader: {
      zIndex: 5,
      marginRight: 32
   },
   headerTitle: {
      ...material.titleWhite,
      zIndex: 5
   },
   fondo: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: .7
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: '50%',
      zIndex: 0
   },
   inputText: {
      color: materialColors.blackPrimary,
      height: 56,
      marginLeft: 12
   },
   inputTextBorder: {
      flex: 1,
      color: materialColors.blackPrimary,
      marginHorizontal: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,.1)',
   },
   line: {
      width: '100%',
      height: 1,
      backgroundColor: 'rgba(0,0,0,.1)'
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

   },
   btnRegistrate: {
      ...material.body1,
      ...systemWeights.bold,
      padding: 10,
      color: '#fbc02d'
   },

   spinner: {
      position: 'absolute',
      right: 20,
      width: 12,
      top: 15,
      height: 12
   }
})