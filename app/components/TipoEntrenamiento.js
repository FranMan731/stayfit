import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import { COLORES_ENTRENAMIENTO } from '../App'

const icono = {
   'FUERZA': require('./../imgs/crear_plan/fuerza-icono.png'),
   'HIIT': require('./../imgs/crear_plan/hiit-icono.png'),
   'FUNCIONAL': require('./../imgs/crear_plan/funcional-icono.png'),
   'NUCLEO': require('./../imgs/crear_plan/nucleo-icono.png'),
   'EQUILIBRIO': require('./../imgs/crear_plan/equilibrio-icono.png'),
   'AEROBICO': require('./../imgs/crear_plan/aerobico-icono.png'),
}

const imagen = {
   'FUERZA': require('./../imgs/crear_plan/fuerza-icono.png'),
   'HIIT': require('./../imgs/crear_plan/hiit-icono.png'),
   'FUNCIONAL': require('./../imgs/crear_plan/funcional-icono.png'),
   'NUCLEO': require('./../imgs/crear_plan/nucleo-icono.png'),
   'EQUILIBRIO': require('./../imgs/crear_plan/equilibrio-icono.png'),
   'AEROBICO': require('./../imgs/crear_plan/aerobico-icono.png'),
}

export default class TipoEntrenamiento extends Component {
   render(){
      const {nombre, cantidad_ejercicios, onPress} = this.props

      const color_strong = COLORES_ENTRENAMIENTO[nombre].strong
      const color_light = COLORES_ENTRENAMIENTO[nombre].light

      return(
         <TouchableOpacity onPress={() => onPress()} style={[styles.container, {borderColor: color_strong, backgroundColor: color_light}]}>
            <Image tintColor={color_strong} source={icono[nombre]} style={styles.icono} resizeMode={'contain'}/>

            <View style={[styles.containerNombre, {borderLeftColor: color_strong}]}>
               <Text style={[styles.nombre, {color: color_strong}]}>{nombre}</Text>
               <Text style={[styles.cantidad, {color: color_strong}]}>{cantidad_ejercicios} tipos de ejercicios</Text>
            </View>
         </TouchableOpacity>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderLeftWidth: 4,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingVertical: 6
   },
   icono: {
      width: 34,
      height: 34,
      marginHorizontal: 16
   },
   containerNombre: {
      borderLeftWidth: 2,
      paddingLeft: 16
   },
   nombre: {
      ...material.subheading,
      ...systemWeights.bold
   }
})