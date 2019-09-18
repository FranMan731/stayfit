import React, {Component} from 'react'
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, TextInput} from 'react-native'
import { material, systemWeights, materialColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Actions} from 'react-native-router-flux'

export default class Header extends Component {
   state = {
      searchBarVisible: false,
      searchText: ''
   }

   toggleSearchBar() {
      this.setState({ searchBarVisible: !this.state.searchBarVisible}, () => {
         if (this.state.searchBarVisible) {
            this.inputText.focus()
         }
      })
   }

   render(){
      const {headerColor, buttonBack, title, searchBar, onSearch, buttonRight, chat, avatar} = this.props
      const {searchBarVisible, searchText} = this.state

      return(
         <View style={[styles.header, {backgroundColor: headerColor}]}>
            {!searchBarVisible &&
            <View style={styles.row}>
               {buttonBack &&
               <TouchableOpacity onPress={() => Actions.pop()}>
                  <Icon style={styles.btnLeft} size={24} name={'arrow-back'} color={'#fff'}/>
               </TouchableOpacity>}

               {chat &&
               <Image style={styles.avatar} source={{uri: avatar}}/>}

               {title &&
               <Text style={styles.title}>{title}</Text>}

               {searchBar &&
               <TouchableOpacity onPress={() => this.toggleSearchBar()}>
                  <Icon size={24} name={'search'} color={'#fff'}/>
               </TouchableOpacity>}
            </View>}

            {searchBarVisible &&
            <View style={styles.searchBar}>
               <TouchableOpacity onPress={() => this.toggleSearchBar()}>
                  <Icon size={24} name={'arrow-back'} color={'#fff'}/>
               </TouchableOpacity>

               <TextInput
                  ref={(x) => this.inputText = x}
                  style={styles.inputSearchBar}
                  placeholder={'Buscar'}
                  placeholderTextColor={materialColors.whiteSecondary}
                  onChangeText={(value) => this.setState({ searchText: value })}
                  onEndEditing={() => onSearch(searchText)}
               />

               <TouchableOpacity onPress={() => onSearch(searchText)}>
                  <Icon size={24} name={'search'} color={'#fff'}/>
               </TouchableOpacity>
            </View>}

            {buttonRight &&
            buttonRight}
         </View>
      )
   }
}

const styles = StyleSheet.create({
   avatar: {
      width: 26,
      height: 26,
      borderRadius: 50,
      marginRight: 16
   },
   row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
   },
   header: {
      height: 56,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
   },
   btnLeft: {
      marginRight: 16
   },
   title: {
      ...material.titleWhite,
      flex: 1,
   },
   searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   inputSearchBar: {
      ...material.titleWhite,
      marginLeft: 16,
      flex: 1
   }
})