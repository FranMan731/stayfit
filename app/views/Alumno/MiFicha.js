import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, Keyboard, ActivityIndicator, AsyncStorage} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, materialColors, systemWeights } from 'react-native-typography'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/FontAwesome5'
import TabButton from '../../components/tabs/TabButton'
import Header from '../../components/Header'
import InputSingle from '../../components/InputSingle'
import LinearGradient from 'react-native-linear-gradient'
import UsuarioStore from '../../stores/UsuarioStore'
import { UPDATE_USUARIO } from '../../graphql/updateUsuario'
import { showMessage } from "react-native-flash-message"
import axios from 'axios'
import SplashScreen from "react-native-splash-screen"
import Modal from 'react-native-modal'
import { AirbnbRating } from 'react-native-ratings'
import AppStore from '../../stores/AppStore'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class MiFicha extends Component {
   static navigationOptions = {
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Mi ficha'}
            focused={focused}
            icon_on={<Icon size={24} name={'list-alt'} color={'#fbc02d'}/>}
            icon_off={<Icon size={24} name={'list-alt'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      data: [0, 1, 2],
      activeSlide: 0,
      nombre: '',
      email: '',
      sexo: '',
      edad: null,
      estatura: null,
      imc: [0,0],
      grasa: [0,0],
      masa_muscular: [0,0],
      objetivos_selected: [],
      motivacion: null,
      observacion: null
   }

   componentDidMount(): void {
      SplashScreen.hide()
   }

   componentWillMount() {
      this.setState({
         nombre: UsuarioStore.nombre,
         email: UsuarioStore.email,
         sexo: UsuarioStore.sexo,
         edad: UsuarioStore.edad ? UsuarioStore.edad.toString() : null,
         estatura: UsuarioStore.estatura ? UsuarioStore.estatura.toString() : null,
         imc: UsuarioStore.imc,
         grasa: UsuarioStore.grasa,
         masa_muscular: UsuarioStore.masa_muscular,
         //objetivo: UsuarioStore.objetivo,
         objetivos_selected: UsuarioStore.objetivo ? UsuarioStore.objetivo : [],
         motivacion: UsuarioStore.motivacion,
         observacion: UsuarioStore.observacion,
      })
   }

   submit() {
      const {
         nombre, email, sexo, edad, estatura, imc, observacion,
         grasa, masa_muscular, objetivos_selected, motivacion
      } = this.state

      this.setState({ loading: true })

      axios.post('', {
         query: UPDATE_USUARIO,
         variables: {
            input: {
               _id: UsuarioStore.id,
               nombre,
               email,
               sexo,
               edad: +edad,
               estatura: +estatura,
               observacion,
               objetivo: objetivos_selected,
               motivacion
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

         Keyboard.dismiss()

         const usuario = {
            id: UsuarioStore.id,
            nombre,
            email,
            rol: 'ALUMNO',
            avatar: UsuarioStore.avatar,
            token: UsuarioStore.token
         }

         const datos_alumno = {
            objetivo: objetivos_selected,
            motivacion,
            peso: result.data.updateUsuario.peso,
            imc,
            grasa,
            masa_muscular,
            edad,
            sexo,
            estatura,
            plan: UsuarioStore.plan
         }

         UsuarioStore.setDatosAlumno(datos_alumno)
         UsuarioStore.setUsuario(usuario)

         AsyncStorage.setItem('datos_alumno', JSON.stringify(datos_alumno))

         AsyncStorage.setItem('user', JSON.stringify(usuario))

         showMessage({
            message: 'Ficha actualizada',
            type: 'success',
         })

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })

         this.setState({loading: false})
      })
   }

   submitUbicacion() {

   }

   renderItem = ({item, index}) => {
      const {
         nombre, email, sexo, edad, estatura, imc, observacion,
         grasa, masa_muscular, objetivos_selected, motivacion, ubicacionText
      } = this.state

      switch (item) {
         case 0: return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={styles.containerItem}>
               <Text style={styles.title}>Informacion personal</Text>
               <InputSingle
                  titulo={'Nombre'}
                  placeholder={'Ingrese su nombre'}
                  onChangeText={(value) => this.setState({ nombre: value })}
                  value={nombre}
               />
               <InputSingle
                  titulo={'Email'}
                  placeholder={'Ingrese su email'}
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
               <View style={{height: 150}}/>
            </KeyboardAwareScrollView>
         )

         case 1: return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={styles.containerItem}>
               <Text style={styles.title}>Informacion corporal</Text>
               <InputSingle
                  titulo={'Edad'}
                  placeholder={'Ingrese su edad'}
                  onChangeText={(value) => this.setState({ edad: value })}
                  value={edad}
               />
               <InputSingle
                  titulo={'Estatura (cm)'}
                  placeholder={'Ingrese su estatura'}
                  onChangeText={(value) => this.setState({ estatura: value })}
                  value={estatura}
               />
               <View style={{height: 150}}/>
            </KeyboardAwareScrollView>
         )

         case 2: return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} style={styles.containerItem}>
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
                  placeholder={'Ingrese su motivacion'}
                  onChangeText={(value) => this.setState({ motivacion: value })}
                  value={motivacion}
               />
               <View style={{height: 150}}/>
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
               title={'Mi ficha'}
               onSearch={(value) => alert('buscar ' + value)}
               buttonRight={
                  <TouchableOpacity onPress={() => this.submit()}>
                     {!loading &&<Text style={styles.btnRightHeader}>Guardar cambios</Text>}
                     {loading && <ActivityIndicator style={styles.spinner} size={'large'} color={'#fff'}/>}
                  </TouchableOpacity>
               }
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

            <TouchableOpacity onPress={() => Actions.reset('escoger')} style={styles.btnSaltar}>
               <Text style={styles.btnSaltarText}>Saltar</Text>
            </TouchableOpacity>

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
      height: '100%',
      backgroundColor: 'red',
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
      color: '#fbc02d'
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
      zIndex: 5
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