import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Header from '../../components/Header'
import Alumno from '../../components/alumnos/Alumno'
import InputSingle from '../../components/InputSingle'
import Modal from 'react-native-modal'
import UsuarioStore from '../../stores/UsuarioStore'
import {observer} from 'mobx-react/native'
import axios from 'axios'
import { INSERT_PLAN } from '../../graphql/insertPlan'
import { showMessage } from 'react-native-flash-message'
import { DELETE_ALUMNO } from '../../graphql/deleteAlumno'

@observer
export default class PerfilAlumno extends Component {
   state = {
      modalVisible: false
   }

   toggleModal() {
      this.setState({modalVisible: !this.state.modalVisible});
   }

   deleteAlumno() {
      axios.post('', {
         query: DELETE_ALUMNO,
         variables: {
            id_alumno: this.props.id
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al eliminar ficha',
               type: 'danger',
            })
            return false;
         }

         showMessage({
            message: 'Ficha eliminado correctamente',
            type: 'success',
         })

         UsuarioStore.removeAlumno(this.props.id)

         Actions.pop()

      }).catch((error) => {
         alert(error.message)
      })
   }

   render(){
      const {id} = this.props
      const alumno = UsuarioStore.alumnos.find(x => x.alumno._id === id).alumno
      const plan = UsuarioStore.alumnos.find(x => x.alumno._id === id).plan

      console.warn(UsuarioStore.alumnos.find(x => x.alumno._id === id))

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Perfil alumno'}
               buttonRight={
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.row}>
                     <Icon size={24} name={'edit'} color={'#fff'}/>
                  </TouchableOpacity>
               }
               buttonBack
            />

            <ScrollView>
               <View style={styles.section}>
                  <View style={styles.containerAvatar}>
                     {alumno.avatar === null &&
                     <Icon size={54} name={'person'} color={materialColors.blackTertiary}/>}

                     {alumno.avatar !== null &&
                     <Image style={styles.avatar} source={{uri: alumno.avatar}}/>}
                  </View>

                  <Text style={styles.nombre}>{ alumno.nombre }</Text>
                  <TouchableOpacity onPress={() => this.toggleModal()}>
                     <Text style={styles.eliminarFicha}>Eliminar ficha</Text>
                  </TouchableOpacity>

                  <View style={styles.separator}/>

                  <Text style={styles.plan}>PLAN DE ENTRENAMIENTO</Text>

                  {plan !== null &&
                  <TouchableOpacity onPress={() => Actions.push('plan_entrenamiento', {plan, id_alumno: alumno._id})} style={[styles.btnPlan, styles.row]}>
                     <Text style={styles.planNombre}>{plan.nombre}</Text>
                     <Icon size={24} name={'arrow-forward'} color={'#fbc02d'}/>
                  </TouchableOpacity>}

                  {plan === null &&
                  <View style={styles.row}>
                     <Text style={{ ...material.body1, color: materialColors.blackSecondary }}>No tiene un plan asignado</Text>
                     <TouchableOpacity onPress={() => Actions.push('crear_plan_elegir_entrenamiento', {id})}>
                        <Text style={styles.btnAsignar}>ASIGNAR PLAN</Text>
                     </TouchableOpacity>
                  </View>}
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Email</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity style={styles.btnValueSection}>
                     <Text style={styles.sectionValue}>{alumno.email}</Text>
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Sexo</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.sexo === undefined &&
                     <Text style={styles.sectionValue}>Toca para seleccionar sexo</Text>}

                     {alumno.sexo !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.sexo}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Edad</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.edad === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar edad</Text>}

                     {alumno.edad !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.edad}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Estatura (cm)</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.estatura === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar estatura</Text>}

                     {alumno.estatura !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.estatura}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Peso inicial (kg)</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.peso[0] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de peso inicial</Text>}

                     {alumno.peso[0] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.peso[0]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>IMC inicial</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.imc[0] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de IMC inicial</Text>}

                     {alumno.imc[0] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.imc[0]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>% de grasa inicial</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.grasa[0] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de grasa inicial</Text>}

                     {alumno.grasa[0] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.grasa[0]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>% de masa muscular inicial</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.masa_muscular[0] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de masa muscular inicial</Text>}

                     {alumno.masa_muscular[0] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.masa_muscular[0]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Peso final (kg)</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.peso[1]=== undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar peso final</Text>}

                     {alumno.peso[1] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.peso[1]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>IMC final</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.imc[1] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar IMC final</Text>}

                     {alumno.imc[1] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.imc[1]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>% de grasa final</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.grasa[1] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de grasa final</Text>}

                     {alumno.grasa[1] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.grasa[1]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>% de masa muscular final</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.masa_muscular[1] === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar % de masa muscular final</Text>}

                     {alumno.masa_muscular[1] !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.masa_muscular[1]}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Objetivos</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.objetivo === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar objetivos</Text>}

                     {alumno.objetivo !== undefined &&
                     alumno.objetivo.map(x => {
                        return (
                           <Text key={x._id}>{x.nombre}</Text>
                        )
                     })}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Motivacion</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.motivacion === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar motivacion</Text>}

                     {alumno.motivacion !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.motivacion}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={styles.sectionInfo}>
                  <Text style={styles.sectionTitle}>Observacioness</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => Actions.push('actualizar_ficha', {id, alumno})} style={styles.btnValueSection}>
                     {alumno.observacion === undefined &&
                     <Text style={styles.sectionValue}>Toca para agregar obervaciones</Text>}

                     {alumno.observacion !== undefined &&
                     <Text style={styles.sectionValue}>{alumno.observacion}</Text>}
                  </TouchableOpacity>
               </View>

               <View style={[styles.row, {marginBottom: 20}]}>
                  <TouchableOpacity onPress={() => Actions.push('agendar_cita', {id_alumno: id})} style={[styles.btn, styles.btnAyuda]}>
                     <Text style={styles.btnAyudaText}>AGENDAR CITA</Text>
                  </TouchableOpacity>

                  {alumno.masa_muscular.length === 2 &&
                  alumno.grasa.length === 2 &&
                  alumno.imc.length === 2 &&
                  alumno.peso.length === 2 &&
                  <TouchableOpacity onPress={() => Actions.push('evaluacion_alumno', {alumno, plan})} style={styles.btnForm}>
                     <Text style={styles.btnFormText}>EVALUAR</Text>
                  </TouchableOpacity>}
               </View>
            </ScrollView>

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={this.state.modalVisible}
               onBackButtonPress={() => this.toggleModal()}
               onBackdropPress={() => this.toggleModal()}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <Text style={styles.modalText}>¿Deseas eliminar esta ficha?</Text>

                  <View style={styles.row}>
                     <TouchableOpacity onPress={() => this.toggleModal()} style={styles.btnModal}>
                        <Text style={styles.btnModalText}>NO</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => this.deleteAlumno()} style={styles.btnModal}>
                        <Text style={styles.btnModalText}>SI</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </Modal>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   btnAyuda: {
      borderWidth: 1,
      borderColor: '#28b8f5'
   },
   btnAyudaText: {
      color: '#28b8f5',
      textAlign: 'center'
   },
   btn: {
      flex: 1,
      alignSelf: 'center',
      borderRadius: 5,
      paddingVertical: 10,
      marginVertical: 6,
      marginHorizontal: 16
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
   },

   btnForm: {
      flex: 1,
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginVertical: 16,
      marginHorizontal: 16
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },

   line: {
      width: '100%',
      height: 1,
      backgroundColor: '#dcdcdc',
      alignSelf: 'center',
      marginVertical: 8
   },
   sectionTitle: {
      ...material.subheading,
   },
   sectionInfo: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc',
      borderTopWidth: 1,
      borderTopColor: '#dcdcdc',
      paddingHorizontal: 20,
      paddingVertical: 14,
      marginVertical: 8
   },
   sectionValue: {
      ...material.body1,
      color: materialColors.blackSecondary
   },
   btnValueSection: {
      paddingVertical: 4
   },

   btnPlan: {
      paddingVertical: 6
   },
   plan: {
      ...material.caption,
      color: materialColors.blackTertiary,
      textAlign: 'center'
   },
   planNombre: {
      ...material.body2,
      color: materialColors.blackSecondary,
      textAlign: 'center',
      marginRight: 5
   },

   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   btnHeader: {
      ...material.button,
      color: '#fbc02d',
      marginLeft: 6
   },
   section: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc',
      paddingHorizontal: 20
   },
   containerAvatar: {
      borderWidth: 1,
      borderColor: materialColors.blackTertiary,
      borderRadius: 50,
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 8,
   },
   avatar: {
      width: 90,
      height: 90,
      borderRadius: 45
   },
   nombre: {
      ...material.subheading,
      ...systemWeights.semibold,
      textAlign: 'center'
   },
   eliminarFicha: {
      ...material.subheading,
      color: materialColors.blackTertiary,
      textAlign: 'center',
      marginBottom: 12
   },
   separator: {
      height: 1,
      backgroundColor: '#dcdcdc',
      marginVertical: 8
   },
   btnAsignar: {
      ...material.body1,
      ...systemWeights.bold,
      padding: 10,
      color: '#fbc02d'
   }
})