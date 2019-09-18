import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'

export default class EjercicioRutina extends Component {
   state = {
   }

   render(){
      const {nombre, series, repeticiones, tiempo, touchable, onPress} = this.props

      return(
         <View style={styles.container}>
            {touchable &&
            <TouchableOpacity style={styles.btn} onPress={() => onPress()}>
               <Text>{nombre}</Text>
            </TouchableOpacity>}

            {!touchable &&
            <Text style={styles.input}>{nombre}</Text>}

            <Text style={styles.input}>{series} series</Text>
            <Text style={styles.input}>{repeticiones} repeticiones</Text>
            <Text style={styles.input}>{tiempo} minutos</Text>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   btn: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginVertical: 6,
   },
   container: {
      backgroundColor: '#fff',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#dddddd'
   },
   input: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginVertical: 6,
      color: materialColors.blackPrimary
   }
})