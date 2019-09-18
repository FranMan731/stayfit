import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'

export default class CheckboxEntrenamiento extends Component {
   state = {
   }

   render(){
      const {onPress, imagen, nombre, icono, cantidad_ejercicios, checked} = this.props

      return(
         <TouchableOpacity onPress={() => onPress()} style={styles.container} activeOpacity={.8}>
            <Image style={styles.imagen} source={imagen}/>

            {checked &&
            <View style={[styles.checkbox, styles.checkedFilled]}>
               <Icon name={'check'} size={18} color={'#fff'}/>
            </View>}

            {!checked &&
            <View style={styles.checkbox}/>}

            <View style={styles.footer}>
               <Image style={styles.icono} source={icono} resizeMode={'contain'}/>
               <Text style={styles.nombre}>{nombre}</Text>
               <Text style={styles.cantidad}>({cantidad_ejercicios} tipos de ejercicios)</Text>
            </View>

            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={styles.gradient}/>
         </TouchableOpacity>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      width: (Dimensions.get('window').width / 2) - 16,
      height: 150,
      justifyContent: 'flex-end',
      borderRadius: 5,
      marginVertical: 8,
      marginHorizontal: 8
   },
   nombre: {
      ...material.subheadingWhite,
      color: materialColors.whitePrimary
   },
   icono: {
      width: 24,
      height: 24
   },
   cantidad: {
      ...material.subheadingWhite,
      color: materialColors.whitePrimary
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: '#28b8f5',
      borderRadius: 50,
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 5,
      alignItems: 'center',
      justifyContent: 'center'
   },
   checkedFilled: {
      backgroundColor: '#28b8f5'
   },
   imagen: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 5
   },
   footer: {
      marginLeft: 12,
      marginBottom: 12,
      zIndex: 5
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 100,
      zIndex: 0,
      borderRadius: 5
   }
})