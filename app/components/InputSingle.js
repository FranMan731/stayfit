import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'

export default class InputSingle extends Component {
   render(){
      const {titulo, placeholder, radioValues, radioSelected, textarea, value, onChangeText} = this.props

      return(
         <View style={styles.container}>
            <Text style={styles.title}>{titulo}</Text>

            <View style={styles.line}/>

            {!radioValues && !textarea &&
            <TextInput
               placeholder={placeholder}
               placeholderTextColor={materialColors.blackSecondary}
               value={value}
               onChangeText={(value) => onChangeText(value)}
               style={styles.input}
            />}

            {radioValues &&
            <RadioForm
               radio_props={radioValues}
               initial={radioSelected}
               onPress={(value) => onChangeText(value)}
               formHorizontal={true}
               buttonColor={'#fbc02d'}
               selectedButtonColor={'#fbc02d'}
               labelStyle={{marginRight: 20}}
               animation={false}
            />}
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingTop: 16,
      paddingBottom: 8,
      paddingHorizontal: 16,
      marginVertical: 6
   },
   line: {
      width: '100%',
      height: 1,
      backgroundColor: '#dcdcdc',
      alignSelf: 'center',
      marginVertical: 8
   },
   title: {
      ...material.subheading
   },
   input: {
      paddingVertical: 6,
      paddingHorizontal: 0,
      margin: 0
   }
})