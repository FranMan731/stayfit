import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'

export default class Alumno extends Component {
   render(){
      const {id, alumno, plan} = this.props

      return(
         <TouchableOpacity onPress={() => Actions.push('perfil_alumno', {id, alumno})} style={styles.row}>
            <Image style={styles.avatar} source={alumno.avatar !== undefined ? {uri: alumno.avatar} : require('./../../imgs/user.png')}/>

            <View style={{flex: 1}}>
               <Text style={styles.nombre}>{ alumno.nombre }</Text>

               {plan !== null &&
               <Text style={styles.texto}>{ plan.nombre }</Text>}

               {plan === null &&
               <Text style={styles.texto}>No tiene un plan asignado</Text>}
            </View>
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
      borderRadius: 25,
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