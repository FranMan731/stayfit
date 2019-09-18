import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import TabButton from '../../components/tabs/TabButton'
import UsuarioStore from '../../stores/UsuarioStore'
import {observer} from 'mobx-react/native'
import { LOGOUT } from '../../graphql/logout'
import { showMessage } from "react-native-flash-message"
import axios from 'axios'
//import ImagePicker from 'react-native-image-picker'
import Modal from 'react-native-modal'
import { DOMINIO } from '../../App'
import fetch from './../../utils/fetch'
import { Rating } from 'react-native-ratings'
import ImagePicker from 'react-native-image-crop-picker'

@observer
export default class MiPerfil extends Component {
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
      modalVisible: false,
      uploading: false,
      progress: 0
   }

   async logout() {
      await axios.post('', {
         query: LOGOUT,

      }).then((response) => {
         AsyncStorage.setItem('logged', 'false')
         AsyncStorage.removeItem('user')

         UsuarioStore.setLogged(false)
         UsuarioStore.reset()

         delete axios.defaults.headers.common["Authorization"]

         Actions.reset('escoger')

      }).catch((error) => {
         alert(error.message)
      })
   }

   toggleModal() {
      this.setState({ modalVisible: !this.state.modalVisible })
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
      })*/
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

   render(){
      const {modalVisible, uploading, progress} = this.state

      return(
         <View style={{flex: 1}}>
            <View style={styles.containerHeader}>
               <Image style={styles.imagen} source={require('./../../imgs/plan_entrenamiento/bg-plan.png')}/>
               <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, 1)']} style={styles.gradient}/>
            </View>

            <View style={styles.containerInfo}>
               <View style={styles.containerInfoContent}>
                  <View style={styles.containerAvatar}>
                     {uploading && (
                        <View style={styles.containerProgress}>
                           <Text style={styles.progress}>{progress}%</Text>
                        </View>
                     )}

                     <Image source={UsuarioStore.avatar ? {uri: UsuarioStore.avatar} : require('./../../imgs/user.png')} style={styles.avatar}/>
                  </View>

                  <Text style={styles.nombre}>{UsuarioStore.nombre}</Text>
                  <Text style={styles.rol}>Coach</Text>

                  <Rating
                     showRating={false}
                     onFinishRating={this.ratingCompleted}
                     startingValue={UsuarioStore.calificacion}
                     imageSize={15}
                     style={{marginVertical: 8}}
                     readonly
                  />

                  <TouchableOpacity onPress={() => this.toggleModal()} style={styles.btnAvatar}>
                     <Text style={styles.btnAvatarText}>Cambiar foto de perfil</Text>
                  </TouchableOpacity>

                  <View style={styles.line}/>

                  <View style={styles.row}>
                     {
                        UsuarioStore.alumnos.map((x, i) => {
                           return (
                              <Image
                                 key={i}
                                 source={x.avatar ? {uri: x.avatar} : require('./../../imgs/user.png')}
                                 style={styles.alumnoAvatar}
                              />
                           )
                        })
                     }
                  </View>

                  <Text style={styles.cantidadAlumnos}>
                     {UsuarioStore.alumnos.length}
                     {UsuarioStore.alumnos.length > 1 ? ' alumnos' : ' alumno'}
                  </Text>
               </View>
            </View>

            <View style={styles.containerButtons}>
               <TouchableOpacity onPress={() => Actions.push('asistencia')} style={[styles.btn, styles.btnAyuda]}>
                  <Text style={styles.btnAyudaText}>Asistencia ENTRENA CNCS</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => this.logout()} style={[styles.btn, styles.btnYellow]}>
                  <Text style={styles.btnFormText}>CERRAR SESIÓN</Text>
               </TouchableOpacity>
            </View>

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
         </View>
      )
   }
}

const styles = StyleSheet.create({
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

   containerButtons: {
      position: 'absolute',
      bottom: 10,
      width: '100%',
   },
   row: {
      flexDirection: 'row',
      marginVertical: 8
   },
   alumnoAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#fff',
      marginLeft: -10
   },
   btnAvatar: {
      paddingVertical: 6
   },
   line: {
      width: 300,
      height: 1,
      backgroundColor: '#eaeaea',
      marginVertical: 8
   },
   btnAvatarText: {
      color: '#fbc02d',
      textAlign: 'center',
      ...systemWeights.semibold
   },
   nombre: {
      ...material.subheading,
      textAlign: 'center'
   },
   rol: {
      textAlign: 'center'
   },
   containerInfo: {
      alignItems: 'center',
      justifyContent: 'center',
      top: -180,
      backgroundColor: '#fff',
      marginHorizontal: 16,
      borderRadius: 5,
      height: 240
   },
   containerInfoContent: {
      top: -40,
      alignItems: 'center',
      justifyContent: 'center',
   },
   containerAvatar: {
      width: 120,
      height: 120,
      borderWidth: 1,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 60
   },
   avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      position: 'absolute',
   },
   btnYellow: {
      backgroundColor: '#fbc02d',
   },
   btnAyuda: {
      borderWidth: 1,
      borderColor: '#28b8f5'
   },
   btnAyudaText: {
      color: '#28b8f5',
      textAlign: 'center'
   },
   btn: {
      width: 300,
      alignSelf: 'center',
      borderRadius: 5,
      paddingVertical: 10,
      marginVertical: 6
   },

   imagen: {
      position: 'absolute',
      width: '100%',
      height: '100%'
   },
   containerHeader: {
      height: 300,
      justifyContent: 'flex-end',
   },
   gradient: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      height: 200,
      zIndex: 0,
   },
   btnFormText: {
      color: materialColors.blackPrimary,
      textAlign: 'center'
   },
})