import React, {Component} from 'react'
import {
   View,
   Text,
   Image,
   Dimensions,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   AsyncStorage,
   ActivityIndicator
} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TipoEntrenamiento from '../components/TipoEntrenamiento'
import UsuarioStore from '../stores/UsuarioStore'
import { ShareButton } from 'react-native-fbsdk'
import axios from 'axios'
import { showMessage } from 'react-native-flash-message'
import { FINALIZAR_PLAN } from '../graphql/finalizarPlan'
import moment from './CalendarioDetalle'
import EjercicioRutina from './DetalleRutina'
import Modal from 'react-native-modal'
import { Rating, AirbnbRating } from 'react-native-ratings'
import { CALIFICAR_PROFESOR } from '../graphql/calificarProfesor'

export default class PlanEntrenamiento extends Component {
   state = {
      terminar: false,
      modalVisible: false,
      rating: 1,
      loading: false
   }

   terminarPlan() {
      axios.post('', {
         query: FINALIZAR_PLAN,
         variables: {
            _id: UsuarioStore.rol === 'PROFESOR' ? this.props.id_alumno : UsuarioStore.id
         }

      }).then(async (response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al finalizar plan',
               type: 'danger',
            })
            return false;
         }

         this.setState({ terminar: true })

         if (UsuarioStore.rol === 'PROFESOR') {
            UsuarioStore.terminarPlan('coach', this.props.id_alumno)
            Actions.pop()
         }
         else {
            UsuarioStore.terminarPlan('alumno')

            const datos_alumno = JSON.parse(await AsyncStorage.getItem('datos_alumno'))
            datos_alumno.plan = null
            AsyncStorage.setItem('datos_alumno', JSON.stringify(datos_alumno))

            this.toggleModal()
         }

      }).catch((error) => {
         alert(error.message)
      })
   }

   submitCalificacion = () => {
      this.setState({ loading: true })

      axios.post('', {
         query: CALIFICAR_PROFESOR,
         variables: {
            id: UsuarioStore.profesor,
            calificacion: this.state.rating
         }

      }).then(async (response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al guardar calificacion',
               type: 'danger',
            })
            return false;
         }

         this.toggleModal()

      }).catch((error) => {
         alert(error.message)
      })
   }

   shareModel = {
      contentType: 'link',
      contentUrl: 'https://gym-stayfit.herokuapp.com/facebook/android'
   }

   onSelect(ejercicio) {
      const {plan} = this.props

      Actions.push('detalle_rutina', {
         ejercicios: ejercicio.ejercicios,
         fecha: '-',
         tipo_entrenamiento: ''
      })
   }

   toggleModal() {
      this.setState({modalVisible: !this.state.modalVisible});
   }

   ratingCompleted = (rating) => {
      this.setState({ rating })
   }

   render(){
      const {plan, id_alumno} = this.props
      const {terminar, modalVisible, loading} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Plan de entrenamiento'}
               buttonRight={(
                  <TouchableOpacity onPress={() => Actions.push('historial', {id_alumno})}>
                     <Icon name={'clock'} size={24} color={'#fff'}/>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <ScrollView>
               <View style={styles.containerHeader}>
                  <Image style={styles.imagen} source={require('./../imgs/plan_entrenamiento/bg-plan.png')}/>

                  <View style={styles.containerNombre}>
                     <Text style={styles.nombre}>{plan.nombre}</Text>
                     <Text style={styles.cantidad}>{plan.ejercicios.length} tipos de entrenamiento</Text>
                  </View>

                  <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={styles.gradient}/>
               </View>

               <View style={styles.containerEntrenamientos}>
                  {
                     plan.ejercicios.map((x, index) =>{
                        return (
                           <TipoEntrenamiento
                              key={index}
                              nombre={x.tipo_entrenamiento}
                              cantidad_ejercicios={x.ejercicios.length}
                              onPress={() => this.onSelect(x)}
                           />
                        )
                     })
                  }
               </View>

               {terminar && UsuarioStore.rol === 'ALUMNO' &&
               <View style={styles.btnShare}>
                  <ShareButton shareContent={this.shareModel} style={{padding: 20, width: 200, marginHorizontal: 16}}/>
               </View>}

               {!terminar &&
               <TouchableOpacity onPress={() => this.terminarPlan()} style={styles.btnForm}>
                  <Text style={styles.btnFormText}>TERMINAR PLAN DE ENTRENAMIENTO</Text>
               </TouchableOpacity>}
            </ScrollView>

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={modalVisible}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}>Como calificarias al coach?</Text>

                  <AirbnbRating
                     showRating={false}
                     onFinishRating={this.ratingCompleted}
                  />

                  <TouchableOpacity onPress={() => this.submitCalificacion()} style={[styles.btnForm, {width: '100%', marginBottom: 0}]}>
                     <Text style={styles.btnFormText}>GUARDAR</Text>
                     {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
                  </TouchableOpacity>
               </View>
            </Modal>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   btnClose: {
      position: 'absolute',
      right: 16,
      top: 16,
      zIndex: 5
   },
   modalText: {
      ...material.subheading,
      textAlign: 'center',
      marginBottom: 16
   },
   containerModal: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingVertical: 16,
      width: '80%',
      paddingHorizontal: 16
   },
   btnModal: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginHorizontal: 2,
      flex: 1
   },
   btnModalText: {
      textAlign: 'center'
   },
   btnShare: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
   },
   btnForm: {
      width: 300,
      alignSelf: 'center',
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginTop: 40,
      marginBottom: 20
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
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
   },
   spinner: {
      position: 'absolute',
      right: 20,
      width: 12,
      top: 15,
      height: 12
   }
})