import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal'

export default class ModalEjercicios extends Component {
   render(){
      const {onToggleModal, visible} = this.props

      return(
         <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            transparent={true}
            isVisible={visible}
            onBackButtonPress={() => onToggleModal()}
            onBackdropPress={() => onToggleModal()}
            style={{alignItems: 'center'}}>
            <View style={styles.containerModal}>

            </View>
         </Modal>
      )
   }
}

const styles = StyleSheet.create({
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },

   modalText: {
      ...material.subheading,
      textAlign: 'center',
      marginBottom: 16
   },
   containerModal: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 16,
      width: '80%'
   },
   btnModal: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginHorizontal: 2,
      flex: 1
   },
   btnModalText: {
      textAlign: 'center'
   }
})