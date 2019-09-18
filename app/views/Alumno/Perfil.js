import React, {Component} from 'react'
import {View, Text, Image, AsyncStorage, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Alumno from '../../components/alumnos/Alumno'
import InputSingle from '../../components/InputSingle'
import Modal from 'react-native-modal'
import TabButton from '../../components/tabs/TabButton'
import UsuarioStore from '../../stores/UsuarioStore'
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'
import { LOGOUT } from '../../graphql/logout'
import axios from 'axios'
import {observer} from 'mobx-react/native'
//import ImagePicker from "react-native-image-picker"
import { DOMINIO } from '../../App'
import { showMessage } from 'react-native-flash-message'
import { getPorcentaje } from '../../utils/getPorcentaje'
import AppStore from '../../stores/AppStore'
import ImagePicker from 'react-native-image-crop-picker'
import SplashScreen from "react-native-splash-screen"

@observer
export default class Perfil extends Component {
   static navigationOptions = {
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Perfil'}
            focused={focused}
            icon_on={<Icon size={24} name={'user'} color={'#fbc02d'}/>}
            icon_off={<Icon size={24} name={'user'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      modalVisible: false
   }

   componentDidMount(): void {
      SplashScreen.hide()
   }

   componentWillUpdate() {
      console.warn('will')
      if (AppStore.update_perfil_alumno) {
         console.warn('update perfil')
         this.onNotification()
      }
   }

   async logout() {
      await axios.post('', {
         query: LOGOUT,

      }).then((response) => {
         AsyncStorage.setItem('logged', 'false')
         AsyncStorage.removeItem('user')
         AsyncStorage.removeItem('datos_alumno')

         UsuarioStore.setLogged(false)
         UsuarioStore.reset()

         delete axios.defaults.headers.common["Authorization"]

         Actions.reset('escoger')

      }).catch((error) => {
         alert(error.message)
      })
   }

   toggleModal() {
      this.setState({modalVisible: !this.state.modalVisible});
   }

   openCamera = () => {
      ImagePicker.openCamera({

      }).then(image => {
         console.warn(image);
	 this.toggleModal()
         this.uploadFile(image)
      });
      /*const options = {}

      ImagePicker.launchCamera(options, (response) => {
         if (!response.didCancel) {
            console.warn(response.uri)
         }
      })
*/
   }

   openGallery = () => {
      ImagePicker.openPicker({

      }).then(image => {
         console.warn(image);
	 this.toggleModal()
         this.uploadFile(image)
      });
      /*const options = {}

      ImagePicker.launchImageLibrary(options, (response) => {
         if (!response.didCancel) {
            console.warn(response)
            this.uploadFile(response)
         }
      })*/
   }

   uploadFile(img) {
      this.setState({ uploading: true })

      const formData = new FormData();

      formData.append('type', 'usuario')
      formData.append('file', {
         uri: img.path,
         type: img.mime,
         name: 'file.jpg'
      })

      const config = {
         headers: {
            'content-type': 'multipart/form-data'
         },
         onUploadProgress: progressEvent => {
            let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ progress: percentCompleted })
         }
      }

      axios.post(`${DOMINIO}/upload`, formData, config).then((res) => {
         this.setState({
            uploading: false,
            progress: 0
         })

         const user = {
            id: UsuarioStore.id,
            nombre: UsuarioStore.nombre,
            email: UsuarioStore.email,
            rol: UsuarioStore.rol,
            token: UsuarioStore.token,
            avatar: res.data.url
         }

         UsuarioStore.setUsuario(user)
         AsyncStorage.setItem('user', JSON.stringify(user))

      }).catch(err => {
         showMessage({
            message: err.message,
            type: 'danger',
         })
         this.setState({ progress: 0, uploading: false })
      })
   }

   onNotification = () => {
      AppStore.setNotification('update_perfil_alumno', false)
   }

   render(){
      const {modalVisible, uploading, progress} = this.state

      return(
         <ScrollView style={{flex: 1}}>
            <View style={styles.section}>
               <View style={styles.containerHeader}>
                  <Menu style={styles.containerMenuRight}>
                     <MenuTrigger style={styles.menuTrigger}>
                        <Icon size={24} name={'ellipsis-v'} color={'#fff'}/>
                     </MenuTrigger>
                     <MenuOptions customStyles={{optionsContainer: {borderRadius: 10, width: 150}}}>
                        <MenuOption style={styles.menuItem} onSelect={() => Actions.push('asistencia')}>
                           <Text>Asistencia ENTRENA CNCS</Text>
                        </MenuOption>
                        <MenuOption style={styles.menuItem} onSelect={() => this.logout()}>
                           <Text>Cerrar sesión</Text>
                        </MenuOption>
                     </MenuOptions>
                  </Menu>

                  <View style={styles.containerAvatar}>
                     {uploading && (
                        <View style={styles.containerProgress}>
                           <Text style={styles.progress}>{progress}%</Text>
                        </View>
                     )}

                     <Image source={UsuarioStore.avatar ? {uri: UsuarioStore.avatar} : require('./../../imgs/user.png')} style={styles.avatar}/>
                  </View>

                  <Text style={styles.nombre}>{ UsuarioStore.nombre }</Text>
                  <TouchableOpacity onPress={() => this.toggleModal()}>
                     <Text style={styles.cambiarAvatar}>Cambiar foto de perfil</Text>
                  </TouchableOpacity>
               </View>

               <View style={styles.containerEdadPeso}>
                  <View style={[styles.edadPeso, {borderRightWidth: 1, borderRightColor: '#dcdcdc'}]}>
                     <Text style={styles.edadPesoTitle}>EDAD</Text>
                     <Text style={styles.edadPesoValue}>{UsuarioStore.edad ? UsuarioStore.edad : '-'}</Text>
                  </View>
                  <View style={styles.edadPeso}>
                     <Text style={styles.edadPesoTitle}>PESO</Text>
                     <Text style={styles.edadPesoValue}>{UsuarioStore.peso.slice()[0] ? UsuarioStore.peso.slice()[0] + 'kg' : '-'}</Text>
                  </View>
               </View>

               <View style={styles.separator}/>

               <Text style={styles.plan}>PLAN DE ENTRENAMIENTO</Text>

               {UsuarioStore.plan !== null &&
               <TouchableOpacity onPress={() => Actions.push('plan_entrenamiento', {plan: UsuarioStore.plan, id_alumno: UsuarioStore.id})} style={[styles.btnPlan, styles.row]}>
                  <Text style={styles.planNombre}>{UsuarioStore.plan.nombre}</Text>
                  <Icon size={18} name={'arrow-right'} color={'#fbc02d'}/>
               </TouchableOpacity>}

               {UsuarioStore.plan === null &&
               <View style={styles.row}>
                  <Text style={{ ...material.body1, color: materialColors.blackSecondary }}>No tienes un plan asignado</Text>
               </View>}
            </View>

            <View style={styles.sectionInfo}>
               <Text style={styles.sectionTitle}>Objetivos</Text>
               <View style={styles.line}/>
               <View style={styles.btnValueSection}>
                  {UsuarioStore.objetivo === undefined &&
                  <Text style={styles.sectionValue}>No tienes agregado ningun objetivo</Text>}

                  {UsuarioStore.objetivo !== undefined &&
                  UsuarioStore.objetivo.map(x => {
                        return (
                           <Text key={x._id}>{x.nombre}</Text>
                        )
                  })}
               </View>
            </View>

            <View style={styles.sectionInfo}>
               <Text style={styles.sectionTitle}>Motivacion</Text>
               <View style={styles.line}/>
               <View style={styles.btnValueSection}>
                  {UsuarioStore.motivacion === undefined &&
                  <Text style={styles.sectionValue}>No tienes agregada ninguna motivación</Text>}

                  {UsuarioStore.motivacion !== undefined &&
                  <Text style={styles.sectionValue}>{UsuarioStore.motivacion}</Text>}
               </View>
            </View>

            {UsuarioStore.masa_muscular.length === 2 &&
            UsuarioStore.grasa.length === 2 &&
            UsuarioStore.imc.length === 2 &&
            UsuarioStore.peso.length === 2 &&
            <View style={{backgroundColor: '#fff'}}>
               <Text style={styles.estadisticas}>Estadisticas</Text>

               <View style={styles.container}>
                  <View style={styles.containerBarra}>
                     <View>
                        <View style={[styles.barra, styles.yellow, {width: getPorcentaje(UsuarioStore.peso.slice()[0], 'peso')}]}/>
                        <Text style={styles.barraTextBlack}>Peso inicial (kg)</Text>
                        <Text style={[styles.barraTextBlack, styles.alignRight]}>{UsuarioStore.peso.slice()[0]}KG</Text>
                     </View>
                     <View style={styles.lineWhite}/>
                     <View>
                        <View style={[styles.barra, styles.blue, {width: getPorcentaje(UsuarioStore.peso.slice()[1], 'peso')}]}/>
                        <Text style={styles.barraTextWhite}>Peso final (kg)</Text>
                        <Text style={[styles.barraTextWhite, styles.alignRight]}>{UsuarioStore.peso.slice()[1]}KG</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.container}>
                  <View style={styles.containerBarra}>
                     <View>
                        <View style={[styles.barra, styles.yellow, {width: getPorcentaje(UsuarioStore.imc.slice()[0], 'imc')}]}/>
                        <Text style={styles.barraTextBlack}>IMC inicial</Text>
                        <Text style={[styles.barraTextBlack, styles.alignRight]}>{UsuarioStore.imc.slice()[0]}</Text>
                     </View>
                     <View style={styles.lineWhite}/>
                     <View>
                        <View style={[styles.barra, styles.blue, {width: getPorcentaje(UsuarioStore.imc.slice()[1], 'imc')}]}/>
                        <Text style={styles.barraTextWhite}>IMC final</Text>
                        <Text style={[styles.barraTextWhite, styles.alignRight]}>{UsuarioStore.imc.slice()[1]}</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.container}>
                  <View style={styles.containerBarra}>
                     <View>
                        <View style={[styles.barra, styles.yellow, {width: `${UsuarioStore.grasa.slice()[0]}%`}]}/>
                        <Text style={styles.barraTextBlack}>% grasa inicial</Text>
                        <Text style={[styles.barraTextBlack, styles.alignRight]}>{UsuarioStore.grasa.slice()[0]}%</Text>
                     </View>
                     <View style={styles.lineWhite}/>
                     <View>
                        <View style={[styles.barra, styles.blue, {width: `${UsuarioStore.grasa.slice()[1]}%`}]}/>
                        <Text style={styles.barraTextWhite}>% grasa final</Text>
                        <Text style={[styles.barraTextWhite, styles.alignRight]}>{UsuarioStore.grasa.slice()[1]}%</Text>
                     </View>
                  </View>
               </View>

               <View style={styles.container}>
                  <View style={styles.containerBarra}>
                     <View>
                        <View style={[styles.barra, styles.yellow, {width: `${UsuarioStore.masa_muscular.slice()[0]}%`}]}/>
                        <Text style={styles.barraTextBlack}>% masa muscular inicial</Text>
                        <Text style={[styles.barraTextBlack, styles.alignRight]}>{UsuarioStore.masa_muscular.slice()[0]}%</Text>
                     </View>
                     <View style={styles.lineWhite}/>
                     <View>
                        <View style={[styles.barra, styles.blue, {width: `${UsuarioStore.masa_muscular.slice()[1]}%`}]}/>
                        <Text style={styles.barraTextWhite}>% masa muscular final</Text>
                        <Text style={[styles.barraTextWhite, styles.alignRight]}>{UsuarioStore.masa_muscular.slice()[1]}%</Text>
                     </View>
                  </View>
               </View>
            </View>}

            <Modal
               animationIn="slideInUp"
               animationOut="slideOutDown"
               transparent={true}
               isVisible={modalVisible}
               onBackButtonPress={() => this.toggleModal()}
               onBackdropPress={() => this.toggleModal()}
               style={{alignItems: 'center'}}>
               <View style={styles.containerModal}>
                  <Text style={styles.modalText}>Foto de perfil</Text>

                  <View style={styles.row}>
                     <TouchableOpacity onPress={() => this.openCamera()} style={styles.btnModal}>
                        <Text style={styles.btnModalText}>TOMAR FOTO</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => this.openGallery()} style={styles.btnModal}>
                        <Text style={styles.btnModalText}>ABRIR FOTOTECA</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </Modal>
         </ScrollView>
      )
   }
}

const styles = StyleSheet.create({
   alignRight: {
      right: 0
   },
   containerProgress: {
      width: 100,
      height: 100,
      borderRadius: 100,
      zIndex: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,.5)',
   },
   progress: {
      ...material.title,
      color: materialColors.whitePrimary,
   },
   menuItem: {
      ...material.body1,
      paddingHorizontal: 15,
      paddingVertical: 8
   },
   containerMenuRight: {
      position: 'absolute',
      right: 16,
      top: 16
   },
   menuTrigger: {
      paddingHorizontal: 16,
      paddingVertical: 8
   },
   containerHeader: {
      backgroundColor: '#28b8f5'
   },
   edadPesoTitle: {
      ...material.caption
   },
   edadPesoValue: {
      ...material.subheading
   },
   edadPeso: {
      flex: 1,
      alignItems: 'center',
   },
   containerEdadPeso: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingVertical: 8
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
      ...material.caption,
      textAlign: 'center'
   },

   btnForm: {
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
      textAlign: 'center',
      marginTop: 10
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
      //paddingHorizontal: 20
   },
   containerAvatar: {
      borderWidth: 1,
      borderColor: '#fff',
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
      width: 100,
      height: 100,
      borderRadius: 50,
      position: 'absolute',
   },
   nombre: {
      ...material.subheadingWhite,
      ...systemWeights.semibold,
      textAlign: 'center'
   },
   cambiarAvatar: {
      ...material.subheading,
      color: '#fbc02d',
      textAlign: 'center',
      marginBottom: 12
   },
   separator: {
      height: 1,
      backgroundColor: '#dcdcdc'
   },
   btnAsignar: {
      ...material.body1,
      ...systemWeights.bold,
      padding: 10,
      color: '#fbc02d'
   }
})