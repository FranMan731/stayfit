import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity} from 'react-native'
import {Actions, ActionConst} from 'react-native-router-flux'
import { material } from 'react-native-typography'
import SplashScreen from 'react-native-splash-screen'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'

export default class Walkthrough extends Component {
   state = {
      data: [
         {
            text: 'Por eso hemos inaugurado un moderno y completo gimnasio con una infraestructura y máquinas de primer nivel.',
            image: require('./../imgs/walkthrough/fondo_1.jpg')
         },
         {
            text: 'Contamos con un seleccionado staff de profesionales, quienes realizan evaluaciones personalizadas, y te orientarán en el entrenamiento más adecuado.',
            image: require('./../imgs/walkthrough/fondo_2.jpg')
         },
         {
            text: 'Quienes desean clases dirigidas, existe la alternativa de asistir a cualquiera de los programas que se imparten en nuestro club como cardio localizado, spinning, pilates, insanity, baile en pareja, yoga y baile entretenido',
            image: require('./../imgs/walkthrough/fondo_3.jpg')
         },
      ],
      activeSlide: 0
   }

   componentDidMount() {
      SplashScreen.hide()
   }

   renderItem = ({item, index}) => {
      return (
         <View style={styles.containerItem}>
            <Image style={styles.image} source={item.image}/>
            <Text style={styles.text}>{item.text}</Text>

            <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, .9)', 'rgba(40, 184, 245, 1)']} style={styles.gradient}/>
         </View>
      )
   }

   pagination() {
      const { data, activeSlide } = this.state;
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

   render(){
      const {data} = this.state

      return(
         <View>
            <Carousel
               data={data}
               style={{backgroundColor: 'red', zIndex: 5}}
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
         </View>
      )
   }
}

const styles = StyleSheet.create({
   containerItem: {
      width: '100%',
      height: '100%',
      zIndex: 5
   },
   containerPagination: {
      position: 'absolute',
      bottom: 0,
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
      height: 250,
      zIndex: 0
   }
})