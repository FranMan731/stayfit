import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal'

export default class ModalMeses extends Component {
   render(){
      const {onSelectMes, onToggleModal, visible, mesSeleccionado} = this.props

      const mes = mesSeleccionado.format('MMMM')

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
               <Text style={styles.modalText}>Elegir mes</Text>

               <View style={styles.row}>
                  <TouchableOpacity onPress={() => onSelectMes('01')} style={[styles.btnMes, mes === 'Enero' && styles.active]}>
                     <Text style={[styles.btnMesText, mes === 'Enero' && styles.activeText]}>Enero</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onSelectMes('02')} style={[styles.btnMes, mesSeleccionado.format('MMMM') === 'Febrero' && styles.active]}>
                     <Text style={[styles.btnMesText, mes === 'Febrero' && styles.activeText]}>Febrero</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onSelectMes('03')} style={[styles.btnMes, mesSeleccionado.format('MMMM') === 'Marzo' && styles.active]}>
                     <Text style={[styles.btnMesText, mes === 'Marzo' && styles.activeText]}>Marzo</Text>
                  </TouchableOpacity>
               </View>
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
   active: {
      backgroundColor: '#2155a5',
      borderColor: '#2155a5'
   },
   activeText: {
      color: '#fff',
   },
   btnMes: {
      borderWidth: 1,
      borderColor: '#bfbfbf',
      borderRadius: 5,
      paddingHorizontal: 16,
      paddingVertical: 6
   },
   btnMesText: {

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