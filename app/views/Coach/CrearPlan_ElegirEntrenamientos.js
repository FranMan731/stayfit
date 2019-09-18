import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import CheckboxEntrenamiento from '../../components/crear-plan/CheckboxEntrenamiento'
import PlanEntrenamientoStore from '../../stores/PlanEntrenamientoStore'
import axios from 'axios'
import { GET_EJERCICIOS_POR_TIPO } from '../../graphql/getEjerciciosPorTipo'
import UsuarioStore from '../../stores/UsuarioStore'
import { showMessage } from 'react-native-flash-message'

export default class CrearPlan_ElegirEntrenamientos extends Component {
   state = {
      checked_funcional: false,
      checked_hiit: false,
      checked_fuerza: false,
      checked_nucleo: false,
      checked_equilibrio: false,
      checked_aerobico: false,
      tipos_entrenamiento: []
   }

   componentDidMount(): void {
      this.getEjercicios()
   }

   componentWillUnmount(): void {
      PlanEntrenamientoStore.resetTipoEntrenamiento()
   }

   getEjercicios() {
      axios.post('', {
         query: GET_EJERCICIOS_POR_TIPO

      }).then((response) => {
         const result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al obtener ejercicios',
               type: 'danger',
            })
            return false;
         }

         const tipos_entrenamiento = result.data.getEjerciciosPorTipo

         this.setState({
            tipos_entrenamiento
         })

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })
      })
   }

   onSelect = (value) => {
      const {tipos_entrenamiento, checked_funcional, checked_aerobico, checked_hiit, checked_fuerza, checked_nucleo, checked_equilibrio} = this.state

      switch (value) {
         case 'FUNCIONAL':
            if (!checked_funcional) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_funcional: !checked_funcional })
            break

         case 'HIIT':
            if (!checked_hiit) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_hiit: !checked_hiit })
            break

         case 'AEROBICO':
            if (!checked_aerobico) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_aerobico: !checked_aerobico })
            break

         case 'FUERZA':
            if (!checked_fuerza) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_fuerza: !checked_fuerza })
            break

         case 'NUCLEO':
            if (!checked_nucleo) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_nucleo: !checked_nucleo })
            break

         case 'EQUILIBRIO':
            if (!checked_equilibrio) {
               PlanEntrenamientoStore.addTipoEntrenamiento(tipos_entrenamiento.find(x => x.tipo === value))
            }
            else {
               PlanEntrenamientoStore.removeTipoEntramiento(value)
            }
            this.setState({ checked_equilibrio: !checked_equilibrio })
            break
      }
   }

   getCantidadEjercicios(tipo) {
      const {tipos_entrenamiento} = this.state

      if (tipos_entrenamiento.length > 0)
         return tipos_entrenamiento.find(x => x.tipo === tipo).ejercicios.length
      else
         return 0
   }

   siguiente() {
      let arr_ejercicios = []

      PlanEntrenamientoStore.tipos_entrenamiento.forEach(x => {
         arr_ejercicios.push({
            tipo_entrenamiento: x,
            ejercicios: x.ejercicios
         })
      })

      Actions.push('crear_plan_elegir_ejercicios', {id: this.props.id})
   }

   render(){
      const {checked_funcional, checked_aerobico, checked_hiit, checked_fuerza, checked_nucleo, checked_equilibrio} = this.state

      return(
         <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Planes de entrenamiento'}
               buttonRight={(
                  <TouchableOpacity onPress={() => this.siguiente()}>
                     <Text style={{...systemWeights.bold, color: '#fbc02d'}}>Siguiente</Text>
                  </TouchableOpacity>
               )}
               buttonBack
            />

            <ScrollView contentContainerStyle={styles.scrollview}>
               <Text style={styles.titulo}>Selecciona 1 o varios tipos de entrenamiento</Text>

               <CheckboxEntrenamiento
                  nombre={'FUNCIONAL'}
                  cantidad_ejercicios={this.getCantidadEjercicios('FUNCIONAL')}
                  imagen={require('./../../imgs/crear_plan/funcional-bg.png')}
                  icono={require('./../../imgs/crear_plan/funcional-icono.png')}
                  onPress={() => this.onSelect('FUNCIONAL')}
                  checked={checked_funcional}
               />
               <CheckboxEntrenamiento
                  nombre={'HIIT'}
                  cantidad_ejercicios={this.getCantidadEjercicios('HIIT')}
                  imagen={require('./../../imgs/crear_plan/hiit-bg.png')}
                  icono={require('./../../imgs/crear_plan/hiit-icono.png')}
                  onPress={() => this.onSelect('HIIT')}
                  checked={checked_hiit}
               />
               <CheckboxEntrenamiento
                  nombre={'FUERZA'}
                  cantidad_ejercicios={this.getCantidadEjercicios('FUERZA')}
                  imagen={require('./../../imgs/crear_plan/fuerza-bg.png')}
                  icono={require('./../../imgs/crear_plan/fuerza-icono.png')}
                  onPress={() => this.onSelect('FUERZA')}
                  checked={checked_fuerza}
               />
               <CheckboxEntrenamiento
                  nombre={'NUCLEO'}
                  cantidad_ejercicios={this.getCantidadEjercicios('NUCLEO')}
                  imagen={require('./../../imgs/crear_plan/nucleo-bg.png')}
                  icono={require('./../../imgs/crear_plan/nucleo-icono.png')}
                  onPress={() => this.onSelect('NUCLEO')}
                  checked={checked_nucleo}
               />
               <CheckboxEntrenamiento
                  nombre={'EQUILIBRIO'}
                  cantidad_ejercicios={this.getCantidadEjercicios('EQUILIBRIO')}
                  imagen={require('./../../imgs/crear_plan/equilibrio-bg.png')}
                  icono={require('./../../imgs/crear_plan/equilibrio-icono.png')}
                  onPress={() => this.onSelect('EQUILIBRIO')}
                  checked={checked_equilibrio}
               />
               <CheckboxEntrenamiento
                  nombre={'AEROBICO'}
                  cantidad_ejercicios={this.getCantidadEjercicios('AEROBICO')}
                  imagen={require('./../../imgs/crear_plan/aerobico-bg.png')}
                  icono={require('./../../imgs/crear_plan/aerobico-icono.png')}
                  onPress={() => this.onSelect('AEROBICO')}
                  checked={checked_aerobico}
               />
            </ScrollView>
         </View>
      )
   }
}

const styles = StyleSheet.create({
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