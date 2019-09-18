import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import TabButton from '../../components/tabs/TabButton'
import Alumno from '../../components/calendario_alumnos/Alumno'
import moment from 'moment'
import 'moment/locale/es'
import Modal from 'react-native-modal'
import ModalMeses from '../../components/ModalMeses'
import UsuarioStore from '../../stores/UsuarioStore'

moment.locale('fr', {
   months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
})

export default class CalendarioAlumnos extends Component {
   static navigationOptions = {
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Calendario'}
            focused={focused}
            icon_on={<Icon size={24} name={'calendar'} color={'#fbc02d'}/>}
            icon_off={<Icon size={24} name={'calendar'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      meses: [
         {
            mes: '2019-02',
            alumnos: [
               {
                  _id: '123',
                  nombre: 'Ezequiel Artigas',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               },
               {
                  _id: '1234',
                  nombre: 'Ezequiel Artigas 2',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               },
               {
                  _id: '1233',
                  nombre: 'Ezequiel Artigas 33',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               },
            ]
         },
         {
            mes: '2019-03',
            alumnos: [
               {
                  _id: '123',
                  nombre: 'Ezequiel Artigas',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               }
            ]
         },
         {
            mes: '2019-04',
            alumnos: [
               {
                  _id: '123',
                  nombre: 'Ezequiel Artigas',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               },
               {
                  _id: '1234',
                  nombre: 'Ezequiel Artigas 2',
                  avatar: 'https://images.unsplash.com/photo-1543990200-991577fddc8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=272&q=80',
               },
            ]
         }
      ],
      alumnos: [],
      mes_seleccionado: moment(),
      modalVisible: false
   }

   componentWillMount() {
      this.mostrarAlumnos()
   }

   renderItem = (item) => {
      return (
         <Alumno
            id={item._id}
            alumno={item}
         />
      )
   }

   mostrarAlumnos() {
      const {mes_seleccionado, cantidad_alumnos} = this.state

      const mes = UsuarioStore.planes_mes.find(x => x.mes === mes_seleccionado.format('YYYY-MM'))

      if (mes) {
         this.setState({ alumnos: mes.alumnos })
      }
      else {
         this.setState({ alumnos: [] })
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
         this.mostrarAlumnos()
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
         this.mostrarAlumnos()
      })
   }

   render(){
      const {mes_seleccionado, alumnos, modalVisible} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Calendario alumnos'}
            />

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

            <Text style={styles.cantidad}>{alumnos.length} alumnos</Text>

            <FlatList
               data={alumnos}
               style={{paddingTop: 16}}
               keyExtractor={(item) => item._id}
               renderItem={({item}) => this.renderItem(item)}
               ItemSeparatorComponent={() => <View style={styles.separator}/>}
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

   cantidad: {
      paddingHorizontal: 24,
      paddingVertical: 8,
      backgroundColor: '#d2d2d2',
      color: '#8a8a8a'
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