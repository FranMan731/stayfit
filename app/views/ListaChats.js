import React, {Component} from 'react'
import {View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, FlatList, Platform} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../components/Header'
import TabButton from '../components/tabs/TabButton'
import Chat from '../components/lista-chats/Chat'
import axios from 'axios'
import { GET_HISTORIAL } from '../graphql/getHistorial'
import { showMessage } from 'react-native-flash-message'
import UsuarioStore from '../stores/UsuarioStore'
import { GET_CHATS } from '../graphql/getChats'
import { Observer, observer } from 'mobx-react/native'
import ChatStore from '../stores/ChatStore'
import Alumno from './Coach/Alumnos'

@observer
export default class ListaChats extends Component {
   static navigationOptions = {
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Mensajes'}
            focused={focused}
            icon_on={<Icon size={24} name={'message-circle'} color={'#fbc02d'}/>}
            icon_off={<Icon size={24} name={'message-circle'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      loading: false
   }

   componentDidMount() {
      this.getChats()
   }

   getChats() {
      this.setState({ loading: true })

      axios.post('', {
         query: GET_CHATS,

      }).then((response) => {
         let result = response.data

         if (result.errors) {
            showMessage({
               message: 'Error al obtener lista de chats',
               type: 'danger',
            })
            return false;
         }

         ChatStore.setChats(result.data.getChats)

         this.setState({ loading: false })

      }).catch((error) => {
         showMessage({
            message: error.message,
            type: 'danger',
         })
         this.setState({ loading: false })
      })
   }

   renderItem = (item) =>
      <Observer>{() =>
         <Chat
            id={item._id}
            last_message={item.last_message}
            nombre={item.usuario.nombre}
            avatar={item.usuario.avatar}
            nuevo={item.nuevo}
         />
      }</Observer>

   render(){
      const {loading} = this.state

      return(
         <View style={styles.container}>
            {loading &&
            <ActivityIndicator style={styles.spinner} size={'large'} color={'#28b8f5'}/>}

{Platform.OS === 'ios' && <View style={{height: 30}}/>}

            {!loading &&
            <FlatList
               data={ChatStore.chats}
               style={styles.lista}
               keyExtractor={(item) => item._id}
               renderItem={({item}) => this.renderItem(item)}
               ListFooterComponent={<View style={{height: 16}}/>}
            />}
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
   lista: {
      width: '100%',
      paddingTop: 6
   },
   separator: {
      backgroundColor: '#e8e8e8',
      height: 1
   },
})