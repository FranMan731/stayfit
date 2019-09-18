import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material, systemWeights, materialColors } from 'react-native-typography'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import Header from '../../components/Header'
import Alumno from '../../components/alumnos/Alumno'
import TabButton from '../../components/tabs/TabButton'
import UsuarioStore from '../../stores/UsuarioStore'
import { getAlumnos } from '../../utils/coach'
import {observer, Observer} from 'mobx-react/native'
import SplashScreen from "react-native-splash-screen"

@observer
export default class Alumnos extends Component {
   static navigationOptions = {
      tabBarIcon: ({focused, tintColor}) => (
         <TabButton
            label={'Alumnos'}
            focused={focused}
            icon_on={<Icon size={24} name={'clipboard'} color={'#fbc02d'}/>}
            icon_off={<Icon size={24} name={'clipboard'} color={materialColors.blackTertiary}/>}
         />
      ),
   }

   state = {
      refreshing: false
   }

   componentDidMount() {
      SplashScreen.hide()
   }

   renderItem = (item) =>
      <Observer>{() =>              // usamos esto para que el FlatList se actualize automaticamente
         <Alumno                    // al modificar el store de Usuario
            id={item.alumno._id}
            alumno={item.alumno}
            plan={item.plan}
         />
      }</Observer>


   async onRefresh() {
      this.setState({ refreshing: true })

      await getAlumnos().then(() => {
         this.setState({ refreshing: false })
      })

   }

   render(){
      return(
         <View style={{flex: 1}}>
            <Header
               headerColor={'#28b8f5'}
               title={'Alumnos'}
               onSearch={(value) => alert('buscar ' + value)}
               searchBar
            />

            {UsuarioStore.alumnos.length === 0 &&
            <Text style={styles.message}>No tienes alumnos asignados</Text>}

            <FlatList
               data={UsuarioStore.alumnos.slice()}
               style={{zIndex: -1}}
               contentContainerStyle={{paddingTop: 16}}
               keyExtractor={(item) => item.alumno._id}
               renderItem={({item}) => this.renderItem(item)}
               ItemSeparatorComponent={() => <View style={styles.separator}/>}
               onRefresh={() => getAlumnos()}
               refreshing={this.state.refreshing}
            />
         </View>
      )
   }
}

const styles = StyleSheet.create({
   message: {
      marginTop: 16,
      textAlign: 'center'
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