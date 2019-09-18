import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import Accordion from 'react-native-collapsible/Accordion'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import PlanEntrenamientoStore from '../../stores/PlanEntrenamientoStore'
import { COLORES_ENTRENAMIENTO } from '../../App'

LocaleConfig.locales['es'] = {
   monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
   monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
   dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
   dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.']
}

LocaleConfig.defaultLocale = 'es'

export default class CrearPlan_ElegirFechas extends Component {
   state = {
      activeSections: [],
      markedDates: {}
   }

   componentWillUnmount(): void {
      PlanEntrenamientoStore.resetFechas()
   }

   renderHeader = (tipo_entrenamiento) => {
      return (
         <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{tipo_entrenamiento.tipo}</Text>
            <Icon name={'chevron-down'} size={24} color={materialColors.blackTertiary}/>
         </View>
      )
   }

   renderContent = (tipo_entrenamiento) => {
      const {markedDates} = this.state

      return (
         <Calendar
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {this.onSelectFecha(day, tipo_entrenamiento.tipo)}}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMMM'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {console.log('month changed', month)}}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}
            markingType={'custom'}
            markedDates={markedDates}
         />
      )
   }

   arrayToObject = (array, keyField) =>
      array.reduce((obj, item) => {
         obj[item[keyField]] = item
         return obj
      }, {})

   onSelectFecha(day, tipo_entrenamiento) {
      let {markedDates} = this.state
      const index = PlanEntrenamientoStore.fechas.findIndex(x => x.fecha === day.dateString && x.tipo_entrenamiento === tipo_entrenamiento)

      if (index >= 0) {
         PlanEntrenamientoStore.removeFecha(index)
      }
      else {
         PlanEntrenamientoStore.addFecha({
            fecha: day.dateString,
            tipo_entrenamiento: tipo_entrenamiento,
            customStyles: {
               container: {
                  backgroundColor: COLORES_ENTRENAMIENTO[tipo_entrenamiento].strong,
                  borderRadius: 5
               },
               text: {
                  color: '#fff',
               },
            }
         })
      }

      markedDates = this.arrayToObject(PlanEntrenamientoStore.fechas.slice(), 'fecha')

      this.setState({ markedDates })
   }

   updateSections = activeSections => {
      this.setState({ activeSections });
   }

   render(){
      const {} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Alumnos'}
               buttonRight={(
                  <TouchableOpacity onPress={() => Actions.push('crear_plan_asignar_rutina', {id: this.props.id})}>
                     <Text style={{...systemWeights.bold, color: '#fbc02d'}}>Siguiente</Text>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <ScrollView contentContainerStyle={styles.scrollview}>
               <Text style={styles.titulo}>Selecciona los dias de entrenamiento</Text>

               <Accordion
                  containerStyle={styles.accordion}
                  sections={PlanEntrenamientoStore.tipos_entrenamiento.slice()}
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