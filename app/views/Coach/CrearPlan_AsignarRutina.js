import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import Accordion from 'react-native-collapsible/Accordion'
import CheckboxEjercicio from '../../components/crear-plan/CheckboxEjercicio'
import PlanEntrenamientoStore from '../../stores/PlanEntrenamientoStore'
import EjercicioRutina from '../../components/crear-plan/EjercicioRutina'
import Modal from 'react-native-modal'
import axios from 'axios'
import UsuarioStore from '../../stores/UsuarioStore'
import { INSERT_PLAN } from '../../graphql/insertPlan'
import { showMessage } from 'react-native-flash-message'
import { getPlanActual } from '../../utils/alumno'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class CrearPlan_AsignarRutina extends Component {
   state = {
      sections: [],
      activeSections: [],
      modalVisible: false,
      nombre_plan: '',
      ejercicio_temp: {
         _id: '',
         nombre: 'Seleccion un ejercicio',
         series: 0,
         repeticiones: 0,
         tiempo: 0
      },
      input_series: '',
      input_repeticiones: '',
      input_tiempo: '',
      tipo_entrenamiento: ''
   }

   componentWillMount() {
      const {sections} = this.state

      PlanEntrenamientoStore.tipos_entrenamiento.forEach(x => {
         const _ejercicios = PlanEntrenamientoStore.ejercicios.filter(y => x.tipo === y.tipo_entrenamiento)

         sections.push({
            tipo_entrenamiento: x.tipo,
            ejercicios: _ejercicios,
         })
      })

      console.warn(sections)

      this.setState({ sections })
   }

   renderHeader = (section) => {
      return (
         <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{section.tipo_entrenamiento}</Text>
            <Icon name={'chevron-down'} size={24} color={materialColors.blackTertiary}/>
         </View>
      )
   }

   renderContent = (section) => {
      const {ejercicio_temp} = this.state

      const arr_ejercicios = section.ejercicios.map((x, index) => {
         return (
            <View key={index} style={{backgroundColor: '#fff', paddingVertical: 8}}>
               <Text style={[styles.input, styles.btnNombreEjercicio]}>{x.nombre}</Text>

               <TextInput
                  style={styles.input}
                  placeholder={'Series'}
                  placeholderTextColor={materialColors.blackTertiary}
                  onChangeText={(value) => this.onChangeText(x, 'series', value)}
               />
               <TextInput
                  style={styles.input}
                  placeholder={'Repeticiones'}
                  placeholderTextColor={materialColors.blackTertiary}
                  onChangeText={(value) => this.onChangeText(x, 'repeticiones', value)}
               />
               <TextInput
                  style={styles.input}
                  placeholder={'Tiempo de entrenamiento'}
                  placeholderTextColor={materialColors.blackTertiary}
                  onChangeText={(value) => this.onChangeText(x, 'tiempo', value)}
               />
            </View>
         )
      })

      //console.warn(section.ejercicios)

      return (
         <View style={{marginBottom: 8}}>
            {arr_ejercicios}
         </View>
      )
   }

   addEjercicio(tipo_entrenamiento) {
      const {ejercicio_temp, sections} = this.state

      const ejercicio = {
         id_ejercicio: ejercicio_temp._id,
         nombre: ejercicio_temp.nombre,
         series: ejercicio_temp.series,
         repeticiones: ejercicio_temp.repeticiones,
         duracion: ejercicio_temp.tiempo,
         tipo_entrenamiento
      }

      const index = sections.findIndex(x => x.tipo_entrenamiento === tipo_entrenamiento)
      sections[index].ejercicios.push(ejercicio)

      this.setState({
         sections,
         ejercicio_temp: {
            _id: '',
            nombre: 'Seleccion un ejercicio',
            series: 0,
            repeticiones: 0,
            tiempo: 0
         },
         input_series: '',
         input_repeticiones: '',
         input_tiempo: '',
      })
   }

   onChangeText = (ejercicio, type, value) => {
      const {sections} = this.state

      const index_entrenamiento = sections.findIndex(x => x.tipo_entrenamiento === ejercicio.tipo_entrenamiento)
      const index_ejercicio = sections[index_entrenamiento].ejercicios.findIndex(x => x._id === ejercicio._id)

      switch (type) {
         case 'series':
            sections[index_entrenamiento].ejercicios[index_ejercicio].series = value
            break

         case 'repeticiones':
            sections[index_entrenamiento].ejercicios[index_ejercicio].repeticiones = value
            break

         case 'tiempo':
            sections[index_entrenamiento].ejercicios[index_ejercicio].duracion = value
            break
      }
      console.warn(sections)

      this.setState({ sections })
   }

   updateSections = activeSections => {
      this.setState({ activeSections });
   }

   toggleModal(tipo_entrenamiento) {
      this.setState({
         modalVisible: !this.state.modalVisible,
         tipo_entrenamiento
      });
   }

   selectEjercicio(ejercicio) {
      const {ejercicio_temp} = this.state

      ejercicio_temp._id = ejercicio._id
      ejercicio_temp.nombre = ejercicio.nombre

      this.toggleModal()

      console.warn(PlanEntrenamientoStore.ejercicios)

      this.setState({ ejercicio_temp })
   }

   normalize() {
      return new Promise((resolve, reject) => {
         let {sections} = this.state

         sections = sections.map(x => {
            x.ejercicios = x.ejercicios.map(y => {
               y.id_ejercicio = y._id
               y.series = parseInt(y.series)
               y.repeticiones = parseInt(y.repeticiones)
               y.duracion = parseInt(y.duracion)
               delete y.tipo_entrenamiento
               delete y._id
               return y
            })

            return x
         })

         const fechas = PlanEntrenamientoStore.fechas.map(x => {
            delete x.customStyles
            return x
         })

         resolve({
            sections, fechas
         })
      })
   }

   submit() {
      this.normalize().then(({ sections, fechas }) => {
         const {nombre_plan} = this.state

         if (nombre_plan === '') {
            showMessage({
               message: 'Debes ingresar un nombre al plan',
               type: 'danger',
            })

            return false
         }

         console.warn({
            id_usuario: this.props.id,
            nombre: nombre_plan,
            ejercicios: sections,
            fechas: fechas
         })

         axios.post('', {
            query: INSERT_PLAN,
            variables: {
               input: {
                  id_usuario: this.props.id,
                  nombre: nombre_plan,
                  ejercicios: sections,
                  fechas: fechas
               }
            }

         }).then(async (response) => {
            let result = response.data

            if (result.errors) {
               showMessage({
                  message: 'Error al crear plan',
                  type: 'danger',
               })
               return false;
            }

            showMessage({
               message: 'Plan creado correctamente',
               type: 'success',
            })

            /*setTimeout(()=> {
               Actions.refresh({
                  refresh: Math.random(),
                  plan: {
                     "nombre": nombre_plan,
                     "entrenamiento": [
                        {
                           "tipo_entrenamiento": "HIIT",
                           "fechas": [
                              "2019-05-18",
                              "2019-05-19"
                           ],
                           "cantidad_ejercicios": 1,
                           "ejercicios": [
                              {
                                 "id_ejercicio": "5ca7c41dc4e7b10017206ba3",
                                 "nombre": "Ejercicio 1",
                                 "series": 10,
                                 "repeticiones": 40,
                                 "duracion": 30
                              }
                           ]
                        }
                     ]
                  }
               })
            }, 500)*/

            const plan = await getPlanActual(this.props.id)

            console.warn('plan', plan)

            UsuarioStore.setPlanAlumno(this.props.id, plan)

            Actions.popTo('perfil_alumno')

         }).catch((error) => {
            alert(error.message)
         })
      }).catch(e => {
         console.warn(e.message)
      })
   }

   render(){
      const {sections} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Alumnos'}
               buttonRight={(
                  <TouchableOpacity onPress={() => this.submit()}>
                     <Text style={{...systemWeights.bold, color: '#fbc02d'}}>Guardar y finalizar</Text>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <KeyboardAwareScrollView>
               <View style={styles.containerNombre}>
                  <Text style={styles.nombrePlan}>Nombre del plan de entrenamiento</Text>
                  <TextInput
                     style={styles.input}
                     placeholder={'Ingrese nombre'}
                     placeholderTextColor={materialColors.blackTertiary}
                     onChangeText={(val) => this.setState({ nombre_plan: val })}
                  />
               </View>

               <Accordion
                  containerStyle={styles.accordion}
                  sections={sections}
                  activeSections={this.state.activeSections}
                  renderSectionTitle={() => null}
                  renderHeader={this.renderHeader}
                  renderContent={this.renderContent}
                  onChange={this.updateSections}
               />
            </KeyboardAwareScrollView>

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={this.state.modalVisible}
               onBackButtonPress={() => this.toggleModal()}
               onBackdropPress={() => this.toggleModal()}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <Text style={styles.modalText}>Seleccione un ejercicio</Text>
                  {
                     PlanEntrenamientoStore.ejercicios.filter((x) => x.tipo_entrenamiento === this.state.tipo_entrenamiento).map((y) => (
                        <TouchableOpacity key={y._id + Date.now()} onPress={() => this.selectEjercicio(y)}>
                           <Text>{y.nombre}</Text>
                        </TouchableOpacity>
                     ))
                  }
               </View>
            </Modal>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   btnAgregar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 16,
   },
   btnAgregarText: {
      color: '#fbc02d',
      marginRight: 6
   },
   containerNombre: {
      backgroundColor: '#fff',
      marginBottom: 8,
      borderBottomColor: '#d4d4d4',
      borderBottomWidth: 1
   },
   nombrePlan: {
      borderBottomWidth: 1,
      borderBottomColor: '#d4d4d4',
      padding: 16,
      color: materialColors.blackPrimary
   },
   input: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#d4d4d4',
      paddingHorizontal: 16,
      paddingVertical: 4,
      marginHorizontal: 16,
      marginVertical: 8,
   },
   btnNombreEjercicio: {
      paddingVertical: 10,
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