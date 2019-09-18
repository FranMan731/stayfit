import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, materialColors, systemWeights } from 'react-native-typography'

export default class Chat extends Component {
   render(){
      const {id, nombre, avatar, last_message, nuevo} = this.props

      return(
         <TouchableOpacity onPress={() => Actions.push('chat', {id, nombre, avatar})} style={styles.row}>
            <Image style={styles.avatar} source={{uri: avatar}}/>

            <View style={{flex: 1}}>
               <View style={styles.rowNombre}>
                  <Text style={styles.nombre}>{ nombre }</Text>

                  {!nuevo &&
                  <View style={styles.dotNotification}/>}
               </View>

               {last_message &&
               <Text style={styles.texto}>{ last_message }</Text>}
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
      marginHorizontal: 16,
      marginVertical: 6,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      borderRadius: 5
   },
   rowNombre: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   dotNotification: {
      width: 6,
      height: 6,
      marginLeft: 5,
      borderRadius: 50,
      backgroundColor: '#28b8f5'
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16
   },
   nombre: {
      ...material.body1,
      marginBottom: 2
   },
   texto: {
      ...material.regular,
      color: materialColors.blackTertiary
   }
})