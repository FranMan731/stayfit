import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'

export default class Alumno extends Component {
   render(){
      const {alumno} = this.props

      return(
         <TouchableOpacity onPress={() => Actions.push('calendario_detalle', {alumno})} style={styles.row}>
            <Image style={styles.avatar} source={{uri: alumno.avatar}}/>

            <View style={{flex: 1}}>
               <Text style={styles.nombre}>{ alumno.nombre }</Text>
            </View>

            <Icon name={'chevron-right'} size={24} color={'#000'}/>
         </TouchableOpacity>
      )
   }
}

const styles = StyleSheet.create({
   row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 30,
      borderColor: '#28b8f5',
      borderWidth: 2,
      marginRight: 16
   },
   nombre: {
      ...material.body1,
      marginBottom: 2
   },
   texto: {
      ...material.regular
   }
})