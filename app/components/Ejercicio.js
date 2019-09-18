import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'

export default class Ejercicio extends Component {
   render(){
      const {onPress, imagen, nombre} = this.props

      return(
         <TouchableOpacity onPress={() => onPress()} style={styles.container} activeOpacity={.8}>
            <Image style={styles.imagen} source={{uri: imagen}}/>

            <View style={styles.footer}>
               <Text style={styles.nombre}>{nombre}</Text>
            </View>

            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={styles.gradient}/>
         </TouchableOpacity>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      height: 150,
      justifyContent: 'flex-end'
   },
   nombre: {
      ...material.subheadingWhite,
      color: materialColors.whitePrimary,
      flex: 1
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