import React, {Component} from 'react'
import {View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import moment from 'moment'
import 'moment/locale/es'
import Modal from 'react-native-modal'
import Ejercicio from '../components/Ejercicio'
import EjercicioRutina from '../components/crear-plan/EjercicioRutina'

moment.locale('fr', {
   months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
})

export default class DetalleRutina extends Component {
   state = {
      modalVisible: false,
      fecha: '10 de Marzo',
      tipo_entrenamiento: 'Fuerza',
      ejercicio: {}
   }

   renderItem = (item) => {
      return (
         <Ejercicio
            id={item._id}
            nombre={item.nombre}
            imagen={item.imagen}
            onPress={() => this.toggleModal(item)}
         />
      )
   }

   toggleModal(item = {}) {
      this.setState({
         modalVisible: !this.state.modalVisible,
         ejercicio: item
      });
   }

   onPressEjercicio(nombre, tiempo, fecha) {
      tiempo = tiempo * 60
      Actions.push('empezar', {
         ejercicio: {
            nombre, tiempo, fecha
         }
      })

      this.toggleModal()
   }

   render(){
      const {ejercicios, fecha, tipo_entrenamiento} = this.props
      const {modalVisible, ejercicio} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Rutina'}
               buttonBack
            />

            <Text style={styles.fecha}>{fecha}</Text>

            <FlatList
               data={ejercicios}
               keyExtractor={(item) => item._id}
               renderItem={({item}) => this.renderItem(item)}
               ItemSeparatorComponent={() => <View style={styles.separator}/>}
            />

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={modalVisible}
               onBackButtonPress={() => this.toggleModal()}
               onBackdropPress={() => this.toggleModal()}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <TouchableOpacity onPress={() => this.toggleModal()} style={styles.btnClose}>
                     <Icon name={'x'} size={24} color={'#000'}/>
                  </TouchableOpacity>

                  <ScrollView style={{paddingTop: 18}}>
                     <EjercicioRutina
                        nombre={ejercicio.nombre}
                        series={ejercicio.series}
                        repeticiones={ejercicio.repeticiones}
                        tiempo={ejercicio.duracion}
                        onPress={() => this.onPressEjercicio(ejercicio.nombre, ejercicio.duracion, fecha)}
                        touchable
                     />
                     <View style={{height: 30}}/>
                  </ScrollView>
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
   tipo_entrenamiento: {
      ...material.subheading,
      color: materialColors.blackSecondary,
      marginLeft: 22
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
      width: '80%'
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

   fecha: {
      paddingHorizontal: 24,
      paddingVertical: 8,
      backgroundColor: '#e2e2e2',
      color: '#8a8a8a'
   },
   btnArrow: {
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   separator: {
      height: 3,
      backgroundColor: '#dcdcdc',
   }
})