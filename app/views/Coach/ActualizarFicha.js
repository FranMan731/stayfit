import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, materialColors, systemWeights } from 'react-native-typography'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import TabButton from '../../components/tabs/TabButton'
import Header from '../../components/Header'
import InputSingle from '../../components/InputSingle'
import LinearGradient from 'react-native-linear-gradient'
import { UPDATE_USUARIO } from '../../graphql/updateUsuario'
import { showMessage } from "react-native-flash-message"
import UsuarioStore from '../../stores/UsuarioStore'
import axios from 'axios'
import AppStore from '../../stores/AppStore'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ActualizarFicha extends Component {
   state = {
      data: [0, 1, 2, 3],
      activeSlide: 0,
      nombre: '',
      email: '',
      sexo: '',
      edad: null,
      estatura: null,
      peso: [0,0],
      imc: [0,0],
      grasa: [0,0],
      masa_muscular: [0,0],
      objetivos_selected: [],
      motivacion: null,
      observacion: null,
      ubicacionText: null,
      loading: false,
      modalVisible: false
   }

   componentWillMount() {
      const {alumno} = this.props

      console.warn(alumno.estatura)

      const peso = alumno.peso.length === 0 ?
         ['', ''] : alumno.peso.length === 1 ?
            [alumno.peso[0].toString(), ''] : alumno.peso.length === 2 ?
               [alumno.peso[0].toString(), alumno.peso[1].toString()] : []

      const imc = alumno.imc.length === 0 ?
         ['', ''] : alumno.imc.length === 1 ?
            [alumno.imc[0].toString(), ''] : alumno.imc.length === 2 ?
               [alumno.imc[0].toString(), alumno.imc[1].toString()] : []

      const grasa = alumno.grasa.length === 0 ?
         ['', ''] : alumno.grasa.length === 1 ?
            [alumno.grasa[0].toString(), ''] : alumno.grasa.length === 2 ?
               [alumno.grasa[0].toString(), alumno.grasa[1].toString()] : []

      const masa_muscular = alumno.masa_muscular.length === 0 ?
         ['', ''] : alumno.masa_muscular.length === 1 ?
            [alumno.masa_muscular[0].toString(), ''] : alumno.masa_muscular.length === 2 ?
               [alumno.masa_muscular[0].toString(), alumno.masa_muscular[1].toString()] : []

      this.setState({
         nombre: alumno.nombre,
         email: alumno.email,
         sexo: alumno.sexo,
         edad: alumno.edad ? alumno.edad.toString() : null,
         estatura: alumno.estatura ? alumno.estatura.toString() : null,
         peso,
         imc,
         grasa,
         masa_muscular,
         objetivos_selected: alumno.objetivo ? alumno.objetivo : [],
         motivacion: alumno.motivacion,
         observacion: alumno.observacion,
      })
   }

   renderItem = ({item, index}) => {
      const {
         nombre, email, sexo, edad, estatura, peso, imc, observacion,
         grasa, masa_muscular, objetivos_selected, motivacion, ubicacionText
      } = this.state

      switch (item) {
         case 0: return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={styles.containerItem}>
               <Text style={styles.title}>Informacion personal</Text>
               <InputSingle
                  titulo={'Nombre'}
                  placeholder={'Ingrese nombre'}
                  onChangeText={(value) => this.setState({ nombre: value })}
                  value={nombre}
               />
               <InputSingle
                  titulo={'Email'}
                  placeholder={'Ingrese email'}
                  onChangeText={(value) => this.setState({ email: value })}
                  value={email}
               />
               <InputSingle
                  titulo={'Sexo'}
                  radioValues={[
                     {label: 'Masculino', value: 'masculino' },
                     {label: 'Femenino', value: 'femenino' }
                  ]}
                  onChangeText={(value) => this.setState({ sexo: value })}
                  value={sexo}
                  radioSelected={sexo === 'masculino' ? 0 : sexo === 'femenino' ? 1 : -1}
               />
               <InputSingle
                  titulo={'Edad'}
                  placeholder={'Ingrese edad'}
                  onChangeText={(value) => this.setState({ edad: value })}
                  value={edad}
               />

               <View style={{height: 150}}/>
            </KeyboardAwareScrollView>
         )

         case 1: return (
            <KeyboardAwareScrollView style={styles.containerItem} keyboardShouldPersistTaps={'always'}>
               <Text style={styles.title}>Informacion corporal</Text>
               <InputSingle
                  titulo={'Estatura (cm)'}
                  placeholder={'Ingrese estatura'}
                  onChangeText={(value) => this.setState({ estatura: value })}
                  value={estatura}
               />
               <InputSingle
                  titulo={'Peso inicial (kg)'}
                  placeholder={'Ingrese peso'}
                  onChangeText={(value) => {
                     const {peso} = this.state
                     peso[0] = value;
                     this.setState({ peso });
                  }}
                  value={peso[0]}
               />
               <InputSingle
                  titulo={'Peso final (kg)'}
                  placeholder={'Ingrese peso'}
                  onChangeText={(value) => {
                     const {peso} = this.state
                     peso[1] = value;
                     this.setState({ peso });
                  }}
                  value={peso[1]}
               />
               <InputSingle
                  titulo={'IMC inicial'}
                  placeholder={'Ingrese IMC'}
                  onChangeText={(value) => {
                     const {imc} = this.state
                     imc[0] = value;
                     this.setState({ imc });
                  }}
                  value={imc[0]}
               />
               <InputSingle
                  titulo={'IMC final'}
                  placeholder={'Ingrese IMC'}
                  onChangeText={(value) => {
                     const {imc} = this.state
                     imc[1] = value;
                     this.setState({ imc });
                  }}
                  value={imc[1]}
               />
               <InputSingle
                  titulo={'% grasa inicial'}
                  placeholder={'Ingrese % grasa inicial'}
                  onChangeText={(value) => {
                     const {grasa} = this.state
                     grasa[0] = value;
                     this.setState({ grasa });
                  }}
                  value={grasa[0]}
               />
               <InputSingle
                  titulo={'% grasa final'}
                  placeholder={'Ingrese % grasa final'}
                  onChangeText={(value) => {
                     const {grasa} = this.state
                     grasa[1] = value;
                     this.setState({ grasa });
                  }}
                  value={grasa[1]}
               />
               <InputSingle
                  titulo={'% masa muscular inicial'}
                  placeholder={'Ingrese % masa muscular inicial'}
                  onChangeText={(value) => {
                     const {masa_muscular} = this.state
                     masa_muscular[0] = value;
                     this.setState({ masa_muscular });
                  }}
                  value={masa_muscular[0]}
               />
               <InputSingle
                  titulo={'% masa muscular final'}
                  placeholder={'Ingrese % masa muscular final'}
                  onChangeText={(value) => {
                     const {masa_muscular} = this.state
                     masa_muscular[1] = value;
                     this.setState({ masa_muscular });
                  }}
                  value={masa_muscular[1]}
               />

               <View style={{height: 150}}/>
            </KeyboardAwareScrollView>
         )

         case 2: return (
            <KeyboardAwareScrollView style={styles.containerItem} keyboardShouldPersistTaps={'always'}>
               <Text style={styles.title}>Objetivos / Motivacion</Text>

               <View style={styles.container}>
                  <Text style={styles.title}>Objetivos</Text>
                  <View style={styles.line}/>
                  <TouchableOpacity onPress={() => this.toggleModal()}>
                     {objetivos_selected.length === 0 &&
                     <Text>Seleccionar objetivos</Text>}

                     {objetivos_selected.map(x => {
                        return (
                           <Text key={x._id} style={{fontWeight: 'bold'}}>{x.nombre}</Text>
                        )
                     })}
                  </TouchableOpacity>
               </View>

               <InputSingle
                  titulo={'Motivacion'}
                  placeholder={'Ingrese motivacion'}
                  onChangeText={(value) => this.setState({ motivacion: value })}
                  value={motivacion}
               />

               <View style={{width: 100, height: 200}}/>
            </KeyboardAwareScrollView>
         )

         case 3: return (
            <KeyboardAwareScrollView style={styles.containerItem} keyboardShouldPersistTaps={'always'}>
               <Text style={styles.title}>¿Cuales son tus observaciones?</Text>
               <InputSingle
                  titulo={'Observaciones'}
                  placeholder={'Ingrese observaciones'}
                  onChangeText={(value) => this.setState({ observacion: value })}
                  value={observacion}
               />
               <View style={{width: 100, height: 200}}/>
            </KeyboardAwareScrollView>
         )
      }
   }

   pagination() {
      const { data, activeSlide } = this.state

      return (
         <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.containerPagination}
            dotStyle={{
               width: 10,
               height: 10,
               borderRadius: 5,
               marginHorizontal: 8,
               backgroundColor: 'rgba(0,0,0,.5)'
            }}
            inactiveDotStyle={{
               backgroundColor: '#fbc02d'
            }}
            inactiveDotOpacity={1}
            inactiveDotScale={0.8}
         />
      )
   }

   arrayToNumber() {
      const {peso, imc, grasa, masa_muscular} = this.state


      if (peso[1] !== '') {
         peso[1] = +peso[1]
      }
      else {
         peso.splice(1, 1)
      }

      if (peso[0] === '') {
         peso.splice(0, 1)
      }
      else {
         peso[0] = +peso[0]
      }


      if (imc[1] !== '') {
         imc[1] = +imc[1]
      }
      else {
         imc.splice(1, 1)
      }

      if (imc[0] === '') {
         imc.splice(0, 1)
      }
      else {
         imc[0] = +imc[0]
      }


      if (grasa[1] !== '') {
         grasa[1] = +grasa[1]
      }
      else {
         grasa.splice(1, 1)
      }

      if (grasa[0] === '') {
         grasa.splice(0, 1)
      }
      else {
         grasa[0] = +grasa[0]
      }


      if (masa_muscular[1] !== '') {
         masa_muscular[1] = +masa_muscular[1]
      }
      else {
         masa_muscular.splice(1, 1)
      }

      if (masa_muscular[0] === '') {
         masa_muscular.splice(0, 1)
      }
      else {
         masa_muscular[0] = +masa_muscular[0]
      }

      console.warn(peso)
   }

   submit() {
      const {id, alumno} = this.props
      const {
         nombre, email, sexo, edad, estatura, peso, imc, observacion,
         grasa, masa_muscular, objetivos_selected, motivacion, ubicacionText
      } = this.state

      this.setState({ loading: true })

      this.arrayToNumber()

      console.warn(peso, imc, grasa, masa_muscular)

      axios.post('', {
         query: UPDATE_USUARIO,
         variables: {
            input: {
               _id: id,
               objetivo: objetivos_selected,
               nombre, email, sexo, edad: +edad, estatura: +estatura, observacion, motivacion,
               masa_muscular, peso, imc, grasa
            }
         }

      }).then(async (response) => {
         const result = response.data

         this.setState({loading: false})

         if (result.errors) {
            if (result.errors[0].name === 'InternalError') {
               showMessage({
                  message: 'Error al actualizar el usuario',
                  type: 'danger',
               })
            }
            else {
               showMessage({
                  message: 'Error',
                  type: 'danger',
               })
            }
            return false
         }

         UsuarioStore.updateAlumno(id, {
            _id: id,
            avatar: alumno.avatar,
            objetivo: objetivos_selected,
            imc, grasa, masa_muscular, edad,
            nombre, email, sexo, estatura, observacion, motivacion,
            peso,
         })

         Keyboard.dismiss()

         showMessage({
            message: 'Ficha actualizada',
            type: 'success',
         })

         Actions.pop()

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   toggleModal() {
      this.setState({modalVisible: !this.state.modalVisible});
   }

   selectObjetivo = (objetivo, is_selected) => {
      let {objetivos_selected} = this.state

      if (is_selected) {
         const index = objetivos_selected.findIndex(x => x._id === objetivo._id)
         objetivos_selected.splice(index, 1)
      }
      else {
         objetivos_selected.push(objetivo)
      }

      this.setState({ objetivos_selected })
   }

   render(){
      const {data, loading, modalVisible, objetivos_selected} = this.state

      return(
         <View>
            <Header
               headerColor={'#28b8f5'}
               title={'Actualizar ficha'}
               onSearch={(value) => alert('buscar ' + value)}
               buttonRight={
                  <TouchableOpacity onPress={() => this.submit()}>
                     {!loading && <IconMaterial name={'save'} size={24} color={'#fff'}/>}
                     {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
                  </TouchableOpacity>
               }
               buttonBack
            />

            <Carousel
               data={data}
               style={{backgroundColor: 'red'}}
               renderItem={this.renderItem}
               sliderWidth={Dimensions.get('window').width}
               itemWidth={Dimensions.get('window').width}
               inactiveSlideScale={1}
               inactiveSlideOpacity={1}
               onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />

            { this.pagination() }

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={modalVisible}
               onBackButtonPress={() => this.toggleModal()}
               onBackdropPress={() => this.toggleModal()}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}>Cuales son tus objetivos?</Text>

                  {AppStore.objetivos.map(x => {
                     const is_selected = Boolean(objetivos_selected.find(y => y._id === x._id))

                     return (
                        <TouchableOpacity onPress={() => this.selectObjetivo(x, is_selected)}>
                           <Text style={[styles.objetivo, is_selected ? styles.objetivoSelected : null]}>
                              {x.nombre}
                           </Text>
                        </TouchableOpacity>
                     )
                  })}

                  <TouchableOpacity onPress={() => this.toggleModal()} style={[styles.btnForm, {width: '100%', marginBottom: 0}]}>
                     <Text style={styles.btnFormText}>CERRAR</Text>
                  </TouchableOpacity>
               </View>
            </Modal>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   objetivoSelected: {
      backgroundColor: '#fbd991'
   },
   objetivo: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderColor: '#fbc02d',
      marginVertical: 4,
      borderRadius: 5,
      color: materialColors.blackPrimary
   },
   btnForm: {
      width: 300,
      alignSelf: 'center',
      backgroundColor: '#fbc02d',
      borderRadius: 5,
      paddingVertical: 10,
      marginTop: 40,
      marginBottom: 20
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },
   container: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingTop: 16,
      paddingBottom: 8,
      paddingHorizontal: 16,
      marginVertical: 6
   },
   line: {
      width: '100%',
      height: 1,
      backgroundColor: '#dcdcdc',
      alignSelf: 'center',
      marginVertical: 8
   },
   btnClose: {
      position: 'absolute',
      right: 16,
      top: 16,
      zIndex: 5
   },
   modalText: {
      ...material.subheading,
      textAlign: 'center',
      marginBottom: 16
   },
   containerModal: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingVertical: 16,
      width: '80%',
      paddingHorizontal: 16
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
   spinner: {
      width: 12,
      height: 12
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ciudad: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 80,
      marginTop: 50,
      marginHorizontal: 20,
      borderRadius: 5,
      backgroundColor: '#fff'
   },
   btnRemoveCiudad: {
      position: 'absolute',
      right: 10,
      top: 12
   },
   nombreCiudad: {
      ...material.subheading,
      marginLeft: 16
   },
   imagenCiudad: {
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      width: 100,
      height: '100%'
   },
   formCiudad: {
      marginTop: 10,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center'
   },
   imagenCiudadFondo: {
      height: 200,
      position: 'absolute'
   },
   inputCiudad: {
      backgroundColor: '#fff',
      borderRadius: 40,
      borderWidth: 1,
      paddingHorizontal: 26,
      borderColor: '#28b8f5',
      width: '80%',
      zIndex: 5
   },
   btnAgregarCiudad: {
      backgroundColor: '#fbc02d' ,
      borderRadius: 50,
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: -20,
      right: 20,
      zIndex: 5
   },

   title: {
      ...material.subheading,
      marginBottom: 6
   },
   btnRightHeader: {
      ...material.body1,
      ...systemWeights.bold,
      color: '#fbc02d',
      marginRight: 5
   },
   containerItem: {
      width: '100%',
      height: '100%',
      padding: 16
   },
   containerPagination: {
      position: 'absolute',
      bottom: 50,
      width: '100%',
      zIndex: 5,
      backgroundColor: '#fff',
      borderTopColor: '#c9c9c9',
      borderTopWidth: 1
   },
   text: {
      ...material.subheadingWhite,
      textAlign: 'center',
      marginHorizontal: 20,
      position: 'absolute',
      bottom: 70,
      zIndex: 5
   },
   image: {
      width: '100%',
      height: '100%',
      position: 'absolute'
   },
   btnSaltar: {
      position: 'absolute',
      bottom: 25,
      right: 15,
      zIndex: 5
   },
   btnSaltarText: {
      ...material.button,
      color: '#fbc02d',
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 60,
      zIndex: 0
   }
})