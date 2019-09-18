import React, {Component} from 'react'
import {
   View,
   Text,
   Image,
   Dimensions,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   SectionList,
   ActivityIndicator
} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TipoEntrenamiento from '../components/TipoEntrenamiento'
import UsuarioStore from '../stores/UsuarioStore'
import axios from 'axios'
import { GET_ALUMNOS_PROFESOR_PLAN } from '../graphql/getAlumnosPorProfesorConPlan'
import { GET_HISTORIAL } from '../graphql/getHistorial'
import { showMessage } from 'react-native-flash-message'

export default class Historial extends Component {
   state = {
      secciones: [],
      loading: false
   }

   componentDidMount() {
      this.getHistorial()
   }

   getHistorial() {
      const {id_alumno} = this.props

      this.setState({ loading: true })

      axios.post('', {
         query: GET_HISTORIAL,
         variables: {
            _id: id_alumno
         }

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al obtener historial',
               type: 'danger',
            })
            return false;
         }

         result = result.data.getHistorial.secciones

         this.setState({
            secciones: result,
            loading: false
         })

      }).catch((error) => {
         this.setState({ loading: false })
         alert(error.message)
      })
   }

   renderItemSection = (item, index, section) => {
      return (
         <View style={styles.containerHistorial}>
            <View style={[styles.row, styles.item]}>
               <Icon style={styles.icon} name={'plus'} size={24}/>
               <View>
                  <Text style={styles.title}>Tipo de actividad</Text>
                  <Text style={styles.value}>{item.nombre}</Text>
               </View>
            </View>

            <View style={styles.line}/>

            <View style={[styles.row, styles.item]}>
               <Icon style={styles.icon} name={'plus'} size={24}/>
               <View>
                  <Text style={styles.title}>Fecha</Text>
                  <Text style={styles.value}>{item.fecha}</Text>
               </View>
            </View>

            <View style={[styles.item, {marginLeft: 54}]}>
               <Text style={styles.title}>Duracion</Text>
               <Text style={styles.value}>{item.tiempo}</Text>
            </View>
         </View>
      )
   }

   render(){
      const {secciones, loading} = this.state

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Historial'}
               buttonBack
            />

            {loading &&
            <ActivityIndicator style={styles.spinner} size={'large'} color={'#28b8f5'}/>}

            <SectionList
               sections={secciones}
               renderItem={({item, index, section}) => this.renderItemSection(item, index, section)}
               renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.section}>{title}</Text>
               )}
               keyExtractor={(item, index) => index}
            />
         </View>
      )
   }
}

const styles = StyleSheet.create({
   item: {
      marginVertical: 8
   },
   line: {
      backgroundColor: '#ebebeb',
      height: 1,
      marginLeft: 54,
      marginRight: 16,
      marginVertical: 4
   },
   icon: {
      marginHorizontal: 16,
   },
   title: {
      ...material.caption,
      color: materialColors.blackTertiary,
   },
   value: {
      color: materialColors.blackPrimary,
   },
   row: {
      flexDirection: 'row',
   },
   containerHistorial: {
      backgroundColor: '#fff',
      borderRadius: 5,
      marginHorizontal: 16,
      marginVertical: 6,
      paddingVertical: 12,
   },
   section: {
      ...material.body1,
      color: materialColors.blackTertiary,
      paddingLeft: 16,
      paddingVertical: 4
   },
   spinner: {
      marginTop: 16
   }
})