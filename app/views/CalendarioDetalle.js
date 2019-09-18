import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconFeather from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TabButton from '../components/tabs/TabButton'
import Alumno from '../components/calendario_alumnos/Alumno'
import moment from 'moment'
import 'moment/locale/es'
import Modal from 'react-native-modal'
import ModalMeses from '../components/ModalMeses'
import { TabView, TabBar } from 'react-native-tab-view'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import TipoEntrenamiento from '../components/TipoEntrenamiento'
import { COLORES_ENTRENAMIENTO } from '../App'
import UsuarioStore from '../stores/UsuarioStore'
import axios from 'axios'
import { GET_PLANES_ALUMNO } from '../graphql/getPlanesPorAlumno'

LocaleConfig.locales['es'] = {
   monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
   dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
   dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.']
}

moment.locale('es', {
   months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
   weekdaysShort : 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
})

export default class CalendarioDetalle extends Component {
   static navigationOptions = {
      header: null,
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Calendario'}
            focused={focused}
            icon_on={<IconFeather size={24} name={'calendar'} color={'#fbc02d'}/>}
            icon_off={<IconFeather size={24} name={'calendar'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      meses: [
      ],
      semanas: [
      ],
      mes_seleccionado: moment(),
      modalVisible: false,
      index: 0,
      routes: [
         { key: '1', title: 'Mes' },
         { key: '2', title: 'Semana' },
      ],
      markedDates: {},
      planes_entrenamiento: []
   }

   componentWillMount() {
      this.getPlanes()
   }

   getPlanes() {
      const {alumno} = this.props

      axios.post('', {
         query: GET_PLANES_ALUMNO,
         variables: {
            _id: UsuarioStore.rol === 'PROFESOR' ? alumno._id : UsuarioStore.id
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            alert('Error al obtener planes')
            return false;
         }

         result = result.data.getPlanesPorAlumno

         this.setState({
            meses: result.meses,
            semanas: result.semanas
         }, () => {
            this.mostrarPlanesHoy()
            this.mostrarPlanesEntrenamiento()
         })

      }).catch((error) => {
         alert(error.message)
      })
   }

   mostrarPlanesHoy() {
      let {meses} = this.state

      const dia_hoy = moment()
      const mes = meses.find(x => x.mes === dia_hoy.format('YYYY-MM'))

      if (mes) {
         const arr_planes = []

         mes.planes_entrenamiento.forEach(x => {
            if (x.fechas.includes(dia_hoy.format('YYYY-MM-DD'))) {
               arr_planes.push(x)
            }
         })

         this.setState({ planes_entrenamiento: arr_planes })
      }
   }

   arrayToObject = (array, keyField) =>
      array.reduce((obj, item) => {
         obj[item[keyField]] = item
         return obj
      }, {})

   mostrarPlanesEntrenamiento() {
      let {meses, mes_seleccionado, markedDates} = this.state

      const mes = meses.find(x => x.mes === mes_seleccionado.format('YYYY-MM'))

      if (mes) {
         const arr_planes = []

         mes.planes_entrenamiento.forEach(x => {
            const color_strong = COLORES_ENTRENAMIENTO[x.tipo_entrenamiento.nombre].strong

            x.fechas.forEach(y => {
               arr_planes.push({
                  fecha: y,
                  selected: true,
                  customStyles: {
                     container: {
                        backgroundColor: color_strong,
                        borderRadius: 5
                     },
                     text: {
                        color: '#fff',
                     },
                  }
               })
            })
         })

         markedDates = this.arrayToObject(arr_planes, 'fecha')

         this.setState({
            markedDates
         })
      }
   }

   cambiarMes = (type) => {
      let {mes_seleccionado} = this.state

      if (type === 'next') {
         mes_seleccionado = mes_seleccionado.add(1, 'month')
      }
      else {
         mes_seleccionado = mes_seleccionado.subtract(1, 'month')
      }

      this.setState({ mes_seleccionado }, () => {
         this.mostrarPlanesEntrenamiento()
      })
   }

   toggleModal() {
      this.setState({modalVisible: !this.state.modalVisible});
   }

   onSelectMes(mes) {
      let {mes_seleccionado} = this.state

      const year = moment().format('YYYY')
      const _mes = moment(`${year}-${mes}`)

      this.toggleModal()

      this.setState({ mes_seleccionado: _mes }, () => {
         this.mostrarPlanesEntrenamiento()
      })
   }

   onSelectFecha(day) {
      const {meses} = this.state
      console.warn(day)

      // day.dateString = 2019-03-20
      // le quitamos el '-20' para realizar la busqueda en el json
      const year_month = day.dateString.slice(0, -3)
      const mes = meses.find(x => x.mes === year_month)

      if (mes) {
         for (let plan of mes.planes_entrenamiento) {
            if (plan.fechas.includes(day.dateString)) {
               Actions.push('detalle_rutina', {
                  ejercicios: plan.ejercicios,
                  fecha: moment(day).format('DD [de] MMMM'),
                  tipo_entrenamiento: plan.nombre
               })
               break
            }
         }
      }
   }

   renderItem = (item) => {
      return (
         <TipoEntrenamiento
            key={item._id}
            nombre={item.tipo_entrenamiento.nombre}
            cantidad_ejercicios={item.tipo_entrenamiento.cantidad_ejercicios}
            onPress={() => Actions.push('detalle_rutina', {
               ejercicios: item.ejercicios,
               fecha: moment().format('DD [de] MMMM'),
               tipo_entrenamiento: item.tipo_entrenamiento.nombre
            })}
         />
      )
   }

   firstRoute = () => {
      const {mes_seleccionado, planes_entrenamiento, markedDates} = this.state

      return (
         <ScrollView>
            <View style={styles.row}>
               <TouchableOpacity onPress={() => this.cambiarMes('back')} style={styles.btnArrow}>
                  <Icon name={'chevron-left'} size={24}/>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => this.toggleModal()}>
                  <Text>{mes_seleccionado.format('MMMM YYYY')}</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => this.cambiarMes('next')} style={styles.btnArrow}>
                  <Icon name={'chevron-right'} size={24}/>
               </TouchableOpacity>
            </View>

            <Calendar
               current={mes_seleccionado.format('YYYY-MM-DD')}
               // Handler which gets executed on day press. Default = undefined
               onDayPress={(day) => {this.onSelectFecha(day)}}
               // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
               monthFormat={'MMMM'}
               // Handler which gets executed when visible month changes in calendar. Default = undefined
               onMonthChange={(month) => {console.log('month changed', month)}}
               // Handler which gets executed when press arrow icon left. It receive a callback can go back month
               onPressArrowLeft={substractMonth => this.cambiarMes('back', substractMonth)}
               // Handler which gets executed when press arrow icon left. It receive a callback can go next month
               onPressArrowRight={addMonth => this.cambiarMes('next', addMonth)}
               markingType={'custom'}
               markedDates={markedDates}
               theme={{
                  "stylesheet.calendar.header": {
                     header: {
                        height: 0,
                        opacity: 0
                     }
                  }
               }}
            />

            <Text style={[styles.separadorText, {color: '#28b8f5'}]}>Hoy, {moment().format('MMMM DD')}</Text>

            <FlatList
               data={planes_entrenamiento}
               style={{paddingTop: 16}}
               keyExtractor={(item) => item._id}
               renderItem={({item}) => this.renderItem(item)}
            />
         </ScrollView>
      )
   }

   mostrarSemanas() {
      const {semanas, mes_seleccionado} = this.state

      const semana = semanas.find(x => x.mes === mes_seleccionado.format('MM'))

      let planes = []

      if (semana) {
         semana.planes_entrenamiento.forEach(x => {
            const color_strong = COLORES_ENTRENAMIENTO[x.tipo_entrenamiento.nombre].strong

            x.fechas.forEach((y, index) => {
               planes.push(
                  <View style={styles.containerSemana}  key={x._id + index}>
                     <View style={{alignItems: 'center'}}>
                        <Text>{moment(y).format('ddd')}</Text>
                        <Text>{moment(y).format('D')}</Text>
                     </View>

                     <TipoEntrenamiento
                        nombre={x.tipo_entrenamiento.nombre}
                        cantidad_ejercicios={x.tipo_entrenamiento.cantidad_ejercicios}
                        onPress={() => Actions.push('detalle_rutina', {
                           ejercicios: x.ejercicios,
                           fecha: moment(y).format('DD [de] MMMM'),
                           tipo_entrenamiento: x.nombre
                        })}
                     />
                  </View>
               )
            })
         })

         return (
            <View>
               <Text style={styles.semana}>{semana.semana}</Text>
               {planes}
            </View>
         )
      }

      return []
   }

   secondRoute = () => {
      const {mes_seleccionado} = this.state

      return (
         <View>
            <View style={styles.row}>
               <TouchableOpacity onPress={() => this.cambiarMes('back')} style={styles.btnArrow}>
                  <Icon name={'chevron-left'} size={24}/>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => this.toggleModal()}>
                  <Text>{mes_seleccionado.format('MMMM YYYY')}</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => this.cambiarMes('next')} style={styles.btnArrow}>
                  <Icon name={'chevron-right'} size={24}/>
               </TouchableOpacity>
            </View>

            <ScrollView>
               {this.mostrarSemanas()}
            </ScrollView>
         </View>
      )
   }

   render(){
      const {alumno} = this.props
      const {mes_seleccionado, modalVisible} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Header
               headerColor={'#28b8f5'}
               title={UsuarioStore.rol === 'PROFESOR' ? alumno.nombre : 'Calendario'}
               buttonRight={(
                  <TouchableOpacity>
                     <Icon name={'refresh'} size={24} color={'#fff'}/>
                  </TouchableOpacity>
               )}
               buttonBack={UsuarioStore.rol === 'PROFESOR'}
            />

            <TabView
               navigationState={this.state}
               renderScene={(route) => {
                  const scenes = {
                     '1': this.firstRoute(),
                     '2': this.secondRoute()
                  };
                  return scenes[route.route.key];
               }}
               onIndexChange={index => this.setState({ index })}
               initialLayout={{ width: Dimensions.get('window').width }}
               renderTabBar={props =>
                  <TabBar
                     {...props}
                     indicatorStyle={{ backgroundColor: '#28b8f5', height: 3 }}
                     style={{ backgroundColor: '#fff', borderBottomColor: '#d5d5d5', borderBottomWidth: 1 }}
                     activeColor={'#28b8f5'}
                     inactiveColor={'#a3a3a3'}
                  />
               }
            />

            <ModalMeses
               visible={modalVisible}
               onToggleModal={() => this.toggleModal()}
               onSelectMes={(value) => this.onSelectMes(value)}
               mesSeleccionado={mes_seleccionado}
            />
         </View>
      )
   }
}

const styles = StyleSheet.create({
   containerSemana: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16
   },
   semana: {
      borderTopWidth: 1,
      borderTopColor: '#d7d7d7',
      borderBottomWidth: 1,
      borderBottomColor: '#d7d7d7',
      paddingVertical: 6,
      paddingHorizontal: 16,
      backgroundColor: '#ebebeb',
      color: materialColors.blackTertiary
   },

   scene: {
      flex: 1,
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

   separadorText: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: '#f4f4f4',
      color: '#8a8a8a',
      textAlign: 'center'
   },
   btnArrow: {
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   separator: {
      height: 1,
      backgroundColor: '#dcdcdc',
      marginVertical: 8
   }
})