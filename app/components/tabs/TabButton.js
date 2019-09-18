import React, { Component } from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { material, materialColors } from 'react-native-typography'

export default class TabButton extends Component {
   render () {
      const {focused, icon_on, icon_off, label} = this.props

      return (
         <View style={styles.container}>
            {focused &&
            icon_on}

            {!focused &&
            icon_off}

            <Text style={[styles.text, {color: focused ? '#fbc02d' : materialColors.blackTertiary }]}>{label}</Text>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 26,
   },
   text: {
      ...material.caption,
      marginTop: 4
   }
})