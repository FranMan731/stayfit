import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Header from '../../components/Header'
import { Calendar } from 'react-native-calendars'
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from 'moment'
import axios from 'axios'
import { GET_ALUMNOS_PROFESOR_PLAN } from '../../graphql/getAlumnosPorProfesorConPlan'
import UsuarioStore from '../../stores/UsuarioStore'
import { INSERT_CITA } from '../../graphql/insertCita'
import { showMessage } from 'react-native-flash-message'
import { COLORES_ENTRENAMIENTO } from '../../App'

export default class AgendarCita extends Component {
   state = {
      pickerVisible: false,
      date: null,
      hora: null,
      markedDates: {}
   }

   onSelectFecha = (date) => {
      let {markedDates} = this.state

      const _markedDates = {
         [date.dateString]: {
            selected: true,
            marked: true,
            customStyles: {
               container: {
                  backgroundColor: '#28b8f5',
                  borderRadius: 5
               },
               text: {
                  color: '#fff',
               },
            }
         }
      }

      this.setState({
         fecha: date.dateString,
         markedDates: _markedDates
      })
   }

   togglePicker() {
      this.setState({ pickerVisible: !this.state.pickerVisible })
   }

   onSelectPicker = (date) => {
      const time = moment(date).format('HH:mm')

      this.setState({
         hora: time,
         pickerVisible: false
      })
   }

   submit = () => {
      const {fecha, hora} = this.state
      const {id_alumno} = this.props

      axios.post('', {
         query: INSERT_CITA,
         variables: {
            input: {
               id_profesor: UsuarioStore.id,
               id_alumno,
               hora,
               fecha
            }
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al crear cita',
               type: 'danger',
            })
            return false;
         }

         showMessage({
            message: 'Cita creada correctamente',
            type: 'success',
         })

         Actions.pop()

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })
      })
   }

   render(){
      const {pickerVisible, markedDates} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Agendar cita'}
               buttonRight={(
                  <TouchableOpacity onPress={() => this.submit()}>
                     <Text style={{...systemWeights.bold, color: '#fbc02d'}}>Guardar y finalizar</Text>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <Calendar
               // Handler which gets executed on day press. Default = undefined
               onDayPress={(day) => {this.onSelectFecha(day)}}
               // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
               monthFormat={'MMMM'}
               // Handler which gets executed when press arrow icon left. It receive a callback can go back month
               onPressArrowLeft={substractMonth => substractMonth()}
               // Handler which gets executed when press arrow icon left. It receive a callback can go next month
               onPressArrowRight={addMonth => addMonth()}
               markingType={'custom'}
               markedDates={markedDates}
            />

            <Text style={styles.title}>¿En qué horario será la cita?</Text>

            <View style={styles.containerButton}>
               <TouchableOpacity onPress={() => this.togglePicker()} style={styles.btn}>
                  <Text style={styles.btnText}>Seleccionar la hora</Text>
               </TouchableOpacity>
            </View>

            <DateTimePicker
               isVisible={pickerVisible}
               onConfirm={this.onSelectPicker}
               onCancel={() => this.togglePicker()}
               mode="time"
            />
         </View>
      )
   }
}

const styles = StyleSheet.create({
   modalText: {
      ...material.subheading,
      textAlign: 'center',
      marginBottom: 16
   },
   containerButton: {
      flex: 1,
      justifyContent: 'center'
   },
   btn: {
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginHorizontal: 16,
      alignSelf: 'center'
   },
   btnText: {
      ...material.button,
      textAlign: 'center'
   },

   title: {
      ...material.body1,
      paddingHorizontal: 24,
      paddingVertical: 8,
      backgroundColor: '#eaeaea',
      color: '#8a8a8a',
      textAlign: 'center',
   },
})