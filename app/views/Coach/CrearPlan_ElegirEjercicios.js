import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import Accordion from 'react-native-collapsible/Accordion'
import CheckboxEjercicio from '../../components/crear-plan/CheckboxEjercicio'
import PlanEntrenamientoStore from '../../stores/PlanEntrenamientoStore'

export default class CrearPlan_ElegirEjercicios extends Component {
   state = {
      activeSections: [],
      ejercicios_checked: []
   }

   renderHeader = (section) => {
      return (
         <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{section.tipo}</Text>
            <Icon name={'chevron-down'} size={24} color={materialColors.blackTertiary}/>
         </View>
      )
   }

   renderContent = (section) => {
      const {ejercicios_checked} = this.state

      const tipo_entrenamiento = PlanEntrenamientoStore.tipos_entrenamiento.find(x => x.tipo === section.tipo)

      return tipo_entrenamiento.ejercicios.map((x, index) => (
         <CheckboxEjercicio
            key={x._id}
            nombre={x.nombre}
            imagen={x.imagen}
            onPress={() => this.selectEjercicio(x, section.tipo)}
            checked={ejercicios_checked.includes(x._id)}
         />
      ))
   }

   selectEjercicio(ejercicio, tipo_entrenamiento) {
      const {ejercicios_checked} = this.state

      if (ejercicios_checked.includes(ejercicio._id)) {
         const index = ejercicios_checked.findIndex(x => x === ejercicio._id)
         ejercicios_checked.splice(index, 1)

         PlanEntrenamientoStore.removeEjercicio(ejercicio._id)
      }
      else {
         ejercicios_checked.push(ejercicio._id)

         PlanEntrenamientoStore.addEjercicio({
            _id: ejercicio._id,
            nombre: ejercicio.nombre,
            tipo_entrenamiento
         })
      }

      this.setState({ ejercicios_checked })
   }

   updateSections = activeSections => {
      this.setState({ activeSections });
   }

   render(){
      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Alumnos'}
               buttonRight={(
                  <TouchableOpacity onPress={() => Actions.push('crear_plan_elegir_fechas', {id: this.props.id})}>
                     <Text style={{...systemWeights.bold, color: '#fbc02d'}}>Siguiente</Text>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <ScrollView contentContainerStyle={styles.scrollview}>
               <Text style={styles.titulo}>Selecciona 1 o varios tipos de entrenamiento</Text>

               <Accordion
                  containerStyle={styles.accordion}
                  sections={PlanEntrenamientoStore.tipos_entrenamiento}
                  activeSections={this.state.activeSections}
                  renderSectionTitle={() => null}
                  renderHeader={this.renderHeader}
                  renderContent={this.renderContent}
                  onChange={this.updateSections}
               />
            </ScrollView>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   headerSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#c0c0c0',
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   headerTitle: {
      flex: 1
   },
   accordion: {
      flex: 1,
   },
   titulo: {
      ...material.subheading,
      color: materialColors.blackPrimary,
      width: '100%',
      margin: 16
   },
   scrollview: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   separator: {
      height: 1,
      backgroundColor: '#dcdcdc',
      marginVertical: 8
   }
})