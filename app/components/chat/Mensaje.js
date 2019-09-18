import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'

export default class Mensaje extends Component {
   render(){
      const {texto, from} = this.props

      return(
         <View style={[styles.container, from === 'sender' ? styles.sender : styles.receiver]}>
            <View style={[styles.arrow, from === 'sender' ? styles.arrowRight : styles.arrowLeft]}/>
            <Text style={from === 'sender' ? styles.senderText : styles.receiverText}>{texto}</Text>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      borderRadius: 5,
      marginVertical: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginHorizontal: 26
   },
   sender: {
      alignSelf: 'flex-end',
      backgroundColor: '#fff'
   },
   receiver: {
      alignSelf: 'flex-start',
      backgroundColor: '#28b8f5'
   },
   receiverText: {
      ...material.subheading,
      ...systemWeights.light,
      color: '#fff'
   },
   senderText: {
      ...material.subheading,
      ...systemWeights.light,
   },
   arrow: {
      position: 'absolute',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderLeftColor: 'transparent',
   },
   arrowLeft: {
      left: -15,
      borderTopWidth: 25,
      borderRightWidth: 25,
      borderBottomWidth: 25,
      borderLeftWidth: 0,
      borderBottomColor: '#28b8f5',
      transform: [{ rotate: '180deg'}]
   },
   arrowRight: {
      right: -15,
      borderTopWidth: 25,
      borderRightWidth: 0,
      borderBottomWidth: 25,
      borderLeftWidth: 25,
      borderBottomColor: '#fff',
      transform: [{ rotate: '180deg'}]
   },
})