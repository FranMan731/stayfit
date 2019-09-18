import React, {Component} from 'react'
import {
   View,
   Text,
   Image,
   Dimensions,
   StyleSheet,
   TouchableOpacity,
   FlatList,
   TextInput,
   ActivityIndicator,
   AppState, AsyncStorage, KeyboardAvoidingView, Platform
} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TabButton from '../components/tabs/TabButton'
import Mensaje from '../components/chat/Mensaje'
import axios from 'axios'
import { GET_CHATS } from '../graphql/getChats'
import { showMessage } from 'react-native-flash-message'
import ChatStore from '../stores/ChatStore'
import { GET_MENSAJES_CHAT } from '../graphql/getMensajesChat'
import SocketIOClient from 'socket.io-client'
import UsuarioStore from '../stores/UsuarioStore'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { DOMINIO } from '../App'

export default class Chat extends Component {
   state = {
      mensajes: [],
      texto: '',
      loading: true
   }

   renderItem = (item) => {
      return (
         <Mensaje
            texto={item.texto}
            from={item.from}
         />
      )
   }

   componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange)

      this.initWS()
      this.getMessages()
      ChatStore.removeDot(this.props.id)
   }

   componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange)

      this.socket.emit('desconectar')
   }

   _handleAppStateChange = async (nextAppState) => {
      const {} = this.props

      if (nextAppState === 'background') {
         this.socket.emit('desconectar')
      }
      else {
         this.initWS()
      }
   }

   initWS() {
      this.socket = SocketIOClient.connect(`${DOMINIO}/chat`)

      this.socket.on('connect', () => {
         console.warn('Conectado')

         this.socket.emit('online', UsuarioStore.id, function(resp) {
            console.warn(resp)
         })
      })

      this.socket.on('mensajePrivado', (res) => {
         let {mensajes} = this.state

         mensajes.unshift({
            _id: res._id,
            from: 'receiver',
            texto: res.texto
         })

         ChatStore.setLastMessage(this.props.id, res.texto)

         this.setState({ mensajes })
      })
   }

   getMessages() {
      this.setState({ loading: true })

      axios.post('', {
         query: GET_MENSAJES_CHAT,
         variables: {
            _id: this.props.id
         }
      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al obtener mensajes del chat',
               type: 'danger',
            })
            return false;
         }

         this.setState({
            mensajes: result.data.getMensajesChat.reverse(),
            loading: false
         })

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })
         this.setState({ loading: false })
      })
   }

   sendMessage() {
      const {texto} = this.state

      const data = {
         id_sender: UsuarioStore.id,
         id_receiver: this.props.id,
         texto
      }

      this.socket.emit('mensajeNuevo', data, (res) => {
         switch (res.status) {
            case 'sended':
               this.onMessageSend(res.id_mensaje)
               break

            case 'committed':
               this.onMessageSend(res.id_mensaje)
               break

            case 'missed':
               alert('Mensaje no se pudo enviar')
               break
         }
      })
   }

   onMessageSend(id_mensaje) {
      let {texto, mensajes} = this.state

      ChatStore.setLastMessage(this.props.id, texto)

      mensajes.unshift({
         _id: id_mensaje,
         from: 'sender',
         texto: texto
      })

      this.setState({
         texto: '',
         mensajes
      })
   }

   render(){
      const {nombre, avatar} = this.props
      const {mensajes, loading, texto} = this.state

      const app = (
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={nombre}
               avatar={avatar}
               chat
               buttonBack
            />

            {loading &&
            <ActivityIndicator style={styles.spinner} size={'large'} color={'#28b8f5'}/>}

            <FlatList
               ref={x => this.flatList = x}
               data={mensajes}
               style={styles.lista}
               keyExtractor={(item) => item._id}
               renderItem={({item}) => this.renderItem(item)}
               onChange={() => alert('a')}
               inverted
            />

            <View style={styles.containerInput}>
               <TextInput
                  style={styles.input}
                  placeholder={'Escribe algo'}
                  value={texto}
                  onSubmitEditing={() => this.sendMessage()}
                  onChangeText={(val) => this.setState({ texto: val })}
                  blurOnSubmit={false}
               />

               <TouchableOpacity onPress={() => this.sendMessage()} style={styles.btnSend}>
                  <Icon name={'send'} size={24}/>
               </TouchableOpacity>
            </View>
         </View>
      )

      if (Platform.OS === 'ios') {
         return(
            <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
               {app}
            </KeyboardAvoidingView>
         )
      }
      else {
         return(
            <View style={{flex: 1}}>
               {app}
            </View>
         )
      }
   }
}

const styles = StyleSheet.create({
   containerInput: {
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#dbdbdb',
      paddingVertical: 8,
      paddingHorizontal: 16
   },
   input: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 40,
      paddingRight: 48
   },
   btnSend: {
      position: 'absolute',
      right: 25,
      padding: 10,
   },
   separator: {
      backgroundColor: '#e8e8e8',
      height: 1
   },
   lista: {
      height: 200
   },
   spinner: {
      marginTop: 16
   }
})