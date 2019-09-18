import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'

export default class CheckboxEjercicio extends Component {
   state = {
   }

   render(){
      const {onPress, imagen, nombre, checked} = this.props

      return(
         <TouchableOpacity onPress={() => onPress()} style={styles.container} activeOpacity={.8}>
            <Image style={styles.imagen} source={{uri: imagen}}/>

            <View style={styles.footer}>
               <Text style={styles.nombre}>{nombre}</Text>

               {checked &&
               <View style={[styles.checkbox, styles.checkedFilled]}>
                  <Icon name={'check'} size={18} color={'#000'}/>
               </View>}

               {!checked &&
               <View style={styles.checkbox}/>}
            </View>

            {checked &&
            <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, 1)']} style={styles.gradient}/>}

            {!checked &&
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={styles.gradient}/>}
         </TouchableOpacity>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      height: 150,
      justifyContent: 'flex-end',
      marginBottom: 4
   },
   nombre: {
      ...material.subheadingWhite,
      color: materialColors.whitePrimary,
      flex: 1
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
      borderColor: '#fbc02d',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
   },
   checkedFilled: {
      backgroundColor: '#fbc02d'
   },
   imagen: {
      position: 'absolute',
      width: '100%',
      height: '100%',
   },
   footer: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 5,
      height: 50,
      padding: 16
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 100,
      zIndex: 0,
   }
})