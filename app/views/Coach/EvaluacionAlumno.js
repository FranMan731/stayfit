import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Header from '../../components/Header'
import Alumno from '../../components/alumnos/Alumno'
import TabButton from '../../components/tabs/TabButton'
import { getPorcentaje } from '../../utils/getPorcentaje'

export default class EvaluacionAlumno extends Component {
   state = {

   }

   renderItem = (item) => {
      return (
         <Alumno
            id={item._id}
            alumno={item}
         />
      )
   }

   render(){
      const {alumno, plan} = this.props

      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Alumnos'}
               buttonBack
            />

            <ScrollView>
               <View style={styles.section}>
                  <View style={styles.containerAvatar}>
                     {alumno.avatar === undefined &&
                     <Icon size={54} name={'person'} color={materialColors.blackTertiary}/>}

                     {alumno.avatar !== undefined &&
                     <Image style={styles.avatar} source={{uri: alumno.avatar}}/>}
                  </View>

                  <Text style={styles.nombre}>{ alumno.nombre }</Text>

                  {plan !== null &&
                  <View>
                     <View style={styles.separator}/>

                     <Text style={styles.plan}>PLAN DE ENTRENAMIENTO</Text>
                     <View style={[styles.btnPlan, styles.row]}>
                        <Text style={styles.planNombre}>{plan.nombre}</Text>
                     </View>
                  </View>}
               </View>

               <Text style={styles.estadisticas}>Estadisticas</Text>

               <View style={{backgroundColor: '#fff'}}>
                  <View style={styles.container}>
                     <View style={styles.containerBarra}>
                        <View>
                           <View style={[styles.barra, styles.yellow, {width: getPorcentaje(alumno.peso.slice()[0], 'peso')}]}/>
                           <Text style={styles.barraTextBlack}>Peso inicial (kg)</Text>
                           <Text style={[styles.barraTextBlack, styles.alignRight]}>{alumno.peso.slice()[0]}KG</Text>
                        </View>
                        <View style={styles.lineWhite}/>
                        <View>
                           <View style={[styles.barra, styles.blue, {width: getPorcentaje(alumno.peso.slice()[1], 'peso')}]}/>
                           <Text style={styles.barraTextWhite}>Peso final (kg)</Text>
                           <Text style={[styles.barraTextWhite, styles.alignRight]}>{alumno.peso.slice()[1]}KG</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.container}>
                     <View style={styles.containerBarra}>
                        <View>
                           <View style={[styles.barra, styles.yellow, {width: getPorcentaje(alumno.imc.slice()[0], 'imc')}]}/>
                           <Text style={styles.barraTextBlack}>IMC inicial</Text>
                           <Text style={[styles.barraTextBlack, styles.alignRight]}>{alumno.imc.slice()[0]}</Text>
                        </View>
                        <View style={styles.lineWhite}/>
                        <View>
                           <View style={[styles.barra, styles.blue, {width: getPorcentaje(alumno.imc.slice()[1], 'imc')}]}/>
                           <Text style={styles.barraTextWhite}>IMC final</Text>
                           <Text style={[styles.barraTextWhite, styles.alignRight]}>{alumno.imc.slice()[1]}</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.container}>
                     <View style={styles.containerBarra}>
                        <View>
                           <View style={[styles.barra, styles.yellow, {width: `${alumno.grasa.slice()[0]}%`}]}/>
                           <Text style={styles.barraTextBlack}>% grasa inicial</Text>
                           <Text style={[styles.barraTextBlack, styles.alignRight]}>{alumno.grasa.slice()[0]}%</Text>
                        </View>
                        <View style={styles.lineWhite}/>
                        <View>
                           <View style={[styles.barra, styles.blue, {width: `${alumno.grasa.slice()[1]}%`}]}/>
                           <Text style={styles.barraTextWhite}>% grasa final</Text>
                           <Text style={[styles.barraTextWhite, styles.alignRight]}>{alumno.grasa.slice()[1]}%</Text>
                        </View>
                     </View>
                  </View>

                  <View style={styles.container}>
                     <View style={styles.containerBarra}>
                        <View>
                           <View style={[styles.barra, styles.yellow, {width: `${alumno.masa_muscular.slice()[0]}%`}]}/>
                           <Text style={styles.barraTextBlack}>% masa muscular inicial</Text>
                           <Text style={[styles.barraTextBlack, styles.alignRight]}>{alumno.masa_muscular.slice()[0]}%</Text>
                        </View>
                        <View style={styles.lineWhite}/>
                        <View>
                           <View style={[styles.barra, styles.blue, {width: `${alumno.masa_muscular.slice()[1]}%`}]}/>
                           <Text style={styles.barraTextWhite}>% masa muscular final</Text>
                           <Text style={[styles.barraTextWhite, styles.alignRight]}>{alumno.masa_muscular.slice()[1]}%</Text>
                        </View>
                     </View>
                  </View>
               </View>

               <View style={{height: 20}}/>
            </ScrollView>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   alignRight: {
      right: 0
   },
   container: {
      backgroundColor: '#b2b2b2',
      marginTop: 18,
      marginHorizontal: 16
   },
   containerBarra: {
      borderBottomWidth: 1,
      borderBottomColor: '#fff',
   },
   barra: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 14,
      backgroundColor: 'red'
   },
   lineWhite: {
      height: 1,
      backgroundColor: '#fff'
   },
   yellow: {
      backgroundColor: '#ffbb00',
   },
   blue: {
      backgroundColor: '#0078cd'
   },
   barraTextBlack: {
      position: 'absolute',
      marginTop: 4,
      marginHorizontal: 16,
      color: materialColors.blackPrimary
   },
   barraTextWhite: {
      position: 'absolute',
      marginTop: 4,
      marginHorizontal: 16,
      color: materialColors.whitePrimary
   },
   estadisticas: {
      marginLeft: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc',
   },

   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
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
   avatar: {
      width: 90,
      height: 90,
      borderRadius: 50
   },
   nombre: {
      ...material.subheading,
      ...systemWeights.semibold,
      textAlign: 'center',
      marginBottom: 16
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
   }
})