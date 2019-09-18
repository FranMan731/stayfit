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
import { getAlumnos } from '../utils/coach'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DOMINIO } from '../App'

export default class RecuperarContrasena extends Component {
   state = {
      email: '',
      loading: false
   }


   submit() {
      const {email} = this.state

      Keyboard.dismiss()

      if (email === '') {
         showMessage({
            message: 'Completa todos los campos',
            type: 'danger',
         })
         return false
      }

      this.setState({ loading: true })

      axios.post(`${DOMINIO}/dash/recuperar`, { email }).then(async (response) => {
         const result = response.data

         this.setState({loading: false})

         if (!result.status) {
            showMessage({
               message: result.message,
               type: 'danger',
            })

            return false
         }

         showMessage({
            message: 'Recibiras un correo en tu email, sigue los pasos indicados alli',
            type: 'success',
         })

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   render(){
      const {type} = this.props
      const {email, loading} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#000'}}>
            <Image style={styles.fondo} source={require('./../imgs/escoger/fondo.jpg')}/>

            <Text style={styles.textHeader}>Recuperar contraseña</Text>
            <View style={styles.lineText}/>

            <View style={styles.containerForm}>
               <View style={styles.containerInput}>
                  <TextInput
                     placeholder={'Ingresa tu email'}
                     placeholderTextColor={'#fff'}
                     style={styles.inputText}
                     autoCapitalize={'none'}
                     onChangeText={(text) => this.setState({ email: text })}
                     value={email}
                  />
               </View>

               <TouchableOpacity onPress={() => this.submit()} style={styles.btnForm}>
                  <Text style={styles.btnFormText}>ENVIAR</Text>
                  {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
               </TouchableOpacity>

               <View style={styles.row}>
                  <Text style={{ ...material.body1White }}>Ya tengo una cuenta</Text>
                  <TouchableOpacity onPress={() => Actions.pop()}>
                     <Text style={styles.btnRegistrate}>INICIAR SESION</Text>
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