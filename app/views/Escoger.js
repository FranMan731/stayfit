import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'

export default class Escoger extends Component {
   render(){
      return(
         <View style={{flex: 1}}>
            <Image style={styles.fondo} source={require('./../imgs/escoger/fondo.jpg')}/>

            <View style={[styles.row, styles.containerButtons]}>
               <TouchableOpacity onPress={() => Actions.push('login', {type: 'coach'})} style={styles.btn} activeOpacity={.5}>
                  <Text style={styles.btnText}>Ingresar como Coach</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => Actions.push('login', {type: 'alumno'})} style={styles.btn} activeOpacity={.5}>
                  <Text style={styles.btnText}>Ingresar como Alumno</Text>
               </TouchableOpacity>
            </View>

            <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, 1)', 'rgba(40, 184, 245, 1)']} style={styles.gradient}/>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      justifyContent: 'space-around'
   },
   fondo: {
      position: 'absolute',
      width: '100%',
      height: '100%'
   },
   containerButtons: {
      position: 'absolute',
      bottom: 40,
      zIndex: 10,
      width: '100%',
   },
   btn: {
      flex: 1,
      marginHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fbc02d',
      paddingVertical: 12
   },
   btnText: {
      ...material.title,
      ...systemWeights.semibold,
      color: '#fbc02d',
      textAlign: 'center',
      lineHeight: 24
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 250,
      zIndex: 0
   }
})