import React, {Component} from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TipoEntrenamiento from '../components/TipoEntrenamiento'
import UsuarioStore from '../stores/UsuarioStore'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'
import { CONTACTO_EMAIL } from '../graphql/contactoEmail'

export default class Asistencia extends Component {
   state = {
      mensaje: '',
      loading: false
   }

   submit() {
      const {mensaje} = this.state

      if (!mensaje) {
         showMessage({
            message: 'No has ingresado tu mensaje',
            type: 'danger',
         })
         return false
      }

      this.setState({ loading: true })

      axios.post('', {
         query: CONTACTO_EMAIL,
         variables: {
            _id: UsuarioStore.id,
            mensaje
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'No se ha podido enviar el mensaje',
               type: 'danger',
            })
            return false;
         }

         showMessage({
            message: 'Mensaje enviado correctamente',
            type: 'success',
         })

         Actions.pop()

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({ loading: false })
      })
   }

   render(){
      const {loading} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Asistencia ENTRENA CNCS'}
               buttonBack
            />

            <Text style={styles.descripcion}>Envienos un correo si necesita asistencia, tiene una queja o una sugerencia</Text>

            <View style={styles.containerInput}>
               <Text style={[styles.input, styles.inputEmail]}>Email</Text>
               <TextInput
                  style={[styles.input, styles.inputMensaje]}
                  placeholder={'En que te podemos ayudar?'}
                  placeholderTextColor={materialColors.blackTertiary}
                  numberOfLines={8}
                  onChangeText={(val) => this.setState({ mensaje: val })}
               />
            </View>


            <View style={{padding: 16}}>
               <TouchableOpacity onPress={() => this.submit()} style={styles.btnForm}>
                  <Text style={styles.btnFormText}>ENVIAR</Text>
                  {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#000'}/>}
               </TouchableOpacity>
            </View>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   descripcion: {
      color: materialColors.blackSecondary,
      margin: 16
   },
   containerInput: {
      borderWidth: 1,
      borderColor: '#cfcfcf',
      borderRadius: 5,
      backgroundColor: '#fff',
      margin: 16
   },
   inputEmail: {
      borderBottomWidth: 1,
      borderBottomColor: '#cfcfcf',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
   },
   inputMensaje: {
      textAlignVertical: 'top'
   },
   input: {
      borderRadius: 5,
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   btnForm: {
      width: '100%',
      alignSelf: 'center',
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginHorizontal: 16
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },
   spinner: {
      position: 'absolute',
      right: 20,
      width: 12,
      top: 15,
      height: 12
   },
   containerEntrenamientos: {
      marginTop: -20,
   },
   containerNombre: {
      padding: 16,
      paddingBottom: 40,
      zIndex: 5,
      width: 300
   },
   imagen: {
      position: 'absolute',
      width: '100%',
      height: '100%'
   },
   containerHeader: {
      height: 200,
      justifyContent: 'flex-end',
   },
   nombre: {
      ...material.title,
      color: materialColors.whitePrimary,
      lineHeight: 20,
      marginBottom: 5,
      zIndex: 5
   },
   cantidad: {
      ...material.body1White,
      color: materialColors.whitePrimary,
      zIndex: 5
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 200,
      zIndex: 0,
   }
})