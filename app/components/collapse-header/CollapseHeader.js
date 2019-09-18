import React, {Component} from "react";
import {Animated, Dimensions, Platform, Text, TouchableOpacity, View, Image} from "react-native";
import LinearGradient from "react-native-linear-gradient"
import styles from "./styles"
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'

const propTypes = {
   children: PropTypes.node.isRequired,
   title: PropTypes.string,
   titleColor: PropTypes.string,
   subtitle: PropTypes.string,
   leftItem: PropTypes.number,
   leftItemOnScroll: PropTypes.number,
   leftItemPress: PropTypes.func,
   rightItem: PropTypes.number,
   rightItemOnScroll: PropTypes.number,
   rightItemPress: PropTypes.func,
   rightItemOpacity: PropTypes.bool,
   rightItem2: PropTypes.number,
   rightItem2OnScroll: PropTypes.number,
   rightItem2Press: PropTypes.func,
   bottomItem: PropTypes.element,
   bottomItemPress: PropTypes.func,
   toolbarMaxHeight: PropTypes.number,
   toolbarMinHeight: PropTypes.number,
   imageOnPress: PropTypes.func,
   headerColor: PropTypes.string,
   headerColorFade: PropTypes.string,
   borderColor: PropTypes.string,
   borderColorFade: PropTypes.string
}
const defaultProps = {
   leftItem: null,
   leftItemPress: null,
   rightItem: null,
   rightItemPress: null,
   rightItemOpacity: true,
   rightItem2: null,
   rightItem2OnScroll: null,
   rightItem2Press: null,
   bottomItem: null,
   bottomItemPress: null,
   toolbarMaxHeight: 192,      // Dimensions.get('window').height - 24
   toolbarMinHeight: Platform.OS === "ios" ? 64 : 55,
   imageOnPress: null,
   headerColor: 'rgba(98,0,234,1)',
   headerColorFade: 'rgba(98,0,234,0)',
   borderColor: 'rgba(207,216,220,1)',
   borderColorFade: 'rgba(207,216,220,0)'
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
   const paddingToBottom = 1;
   return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
}

class CollapseHeader extends Component {
   nScroll = new Animated.Value(0);
   scroll = new Animated.Value(0);

   componentDidMount() {
      this.nScroll.addListener(Animated.event([
         {value: this.scroll}],
         {useNativeDriver: false}
      ));
   }

   render() {
      const {children, image, imageOnPress, leftItem, leftItemOnScroll, leftItemPress, rightItem, rightItem2,
            rightItemOnScroll, rightItem2OnScroll, rightItemPress, rightItem2Press, rightItemOpacity, bottomItem, bottomItemPress, title,
            subtitle, titleColor, borderColor, borderColorFade, headerColor, headerColorFade, toolbarMaxHeight, toolbarMinHeight} = this.props;

      const scrollDistance = toolbarMaxHeight - toolbarMinHeight;

      const headerBg = this.scroll.interpolate({
         inputRange: [scrollDistance - 1, scrollDistance],
         outputRange: [headerColorFade, headerColor],
         extrapolate: "clamp"
      });

      const imgScale = this.nScroll.interpolate({
         inputRange: [-25, 0],
         outputRange: [1.1, 1],
         extrapolateRight: "clamp"
      });

      const imgOpacity = this.nScroll.interpolate({
         inputRange: [0, scrollDistance],
         outputRange: [1, 0],
      });

      const titleTranslateY = this.nScroll.interpolate({
         inputRange: [0, scrollDistance/2, scrollDistance],
         outputRange: [scrollDistance, scrollDistance/2, 20],
         extrapolate: 'clamp',
      });

      const titleTranslateX = this.nScroll.interpolate({
         inputRange: [0, scrollDistance/2, scrollDistance],
         outputRange: [0, 9, 18],
         extrapolate: 'clamp',
      });

      const titleScale = this.nScroll.interpolate({
         inputRange: [0, scrollDistance / 2, scrollDistance],
         outputRange: [1, 1, 0.9],
         extrapolate: 'clamp',
      });

      const iconFadeIn = this.nScroll.interpolate({
         inputRange: [0, scrollDistance / 2, scrollDistance],
         outputRange: [0, 0, 1],
         extrapolate: 'clamp',
      });

      const iconFadeOut = this.nScroll.interpolate({
         inputRange: [0, scrollDistance / 2, scrollDistance],
         outputRange: [1, 1, 0],
         extrapolate: 'clamp',
      });

      const borderBottomColor = this.scroll.interpolate({
         inputRange: [scrollDistance-40, scrollDistance],
         outputRange: [borderColorFade, borderColor],
      });

      const AnimatedIcon = Animated.createAnimatedComponent(Icon)

      return (
         <View style={{flex: 1}}>
            {/* NavBar / Button left / right */}
            <Animated.View style={[styles.bar, {height: toolbarMinHeight, backgroundColor: headerBg, borderBottomWidth: 1, borderBottomColor: borderBottomColor}]}>
               {/* Left button */}
               <TouchableOpacity onPress={leftItemPress}>
                  <View style={styles.left}>
                     <AnimatedIcon size={24} name={leftItem} color={'#fff'} style={{position: 'absolute', opacity: (leftItemOnScroll) ? iconFadeOut : 1}}/>

                     {leftItemOnScroll &&
                     <Animated.Image style={{position: 'absolute', opacity: iconFadeIn}} source={leftItemOnScroll}/>}
                  </View>
               </TouchableOpacity>

               {/* Right button  */}
               <Animated.View style={{opacity: (rightItemOpacity) ? iconFadeIn : 1, flexDirection: 'row'}}>
                  <TouchableOpacity onPress={rightItemPress} style={{marginRight: 14}}>
                     <View style={styles.right}>
                        <Animated.Image style={{position: 'absolute', opacity: (rightItemOnScroll) ? iconFadeOut : 1}} source={rightItem}/>

                        {rightItemOnScroll &&
                        <Animated.Image style={{position: 'absolute', opacity: iconFadeIn}} source={rightItemOnScroll}/>}
                     </View>
                  </TouchableOpacity>

                  {rightItem2 &&
                  <TouchableOpacity onPress={rightItem2Press} style={{marginRight: 14}}>
                     <View style={styles.right}>
                        <Animated.Image style={{position: 'absolute', opacity: iconFadeOut}} source={rightItem2}/>
                        <Animated.Image style={{position: 'absolute', opacity: iconFadeIn}} source={rightItem2OnScroll}/>
                     </View>
                  </TouchableOpacity>}
               </Animated.View>
            </Animated.View>

            {/* Title */}
            <Animated.View pointerEvents="none" style={[styles.action, { top: -20, transform: [{scale: titleScale}, {translateY: titleTranslateY}, {translateX: titleTranslateX}] }]}>
               <Text style={[styles.title]}>{title}</Text>
            </Animated.View>

            {/* Subtitle */}
            <Animated.View pointerEvents="none" style={[styles.action, { top: 0, opacity: imgOpacity, transform: [{translateY: titleTranslateY}, {scale: titleScale}, {translateX: titleTranslateX}] }]}>
               <Text style={[styles.subtitle]}>{subtitle}</Text>
            </Animated.View>

            {/* Bottom item */}
            <Animated.View style={{position: 'absolute', top: 15, right: 16, zIndex: 4, opacity: imgOpacity, transform:[{translateY: titleTranslateY}]}}>
               <TouchableOpacity onPress={bottomItemPress}>
                  <View>{bottomItem}</View>
               </TouchableOpacity>
            </Animated.View>

            {/* Content / Background image */}
            <Animated.ScrollView
               keyboardShouldPersistTaps="always"
               scrollEventThrottle={5}
               showsVerticalScrollIndicator={false}
               style={{zIndex: 3}}
               onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {y: this.nScroll}}}],
                  {
                     useNativeDriver: true,
                     listener: event => {
                        if (isCloseToBottom(event.nativeEvent)) {
                           this.props.onEndReached()
                        }
                        // do something special
                     }
                  },
               )}>
               {/* Background image */}
               <Animated.View style={{backgroundColor: headerColor, transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: imgScale}] }}>
                  {/* Container image / gradient */}
                  <Animated.View style={{opacity: imgOpacity}}>
                     <TouchableOpacity onPress={() => imageOnPress()} activeOpacity={1}>
                        <Animated.Image
                           source={image}
                           style={{height: toolbarMaxHeight, width: "100%"}}
                        />
                        {/* Gradient */}
                        <LinearGradient colors={['rgba(40, 184, 245, 0)', 'rgba(40, 184, 245, 1)']} style={{position: 'absolute', bottom: 0, height: '100%', width: "100%"}}/>
                     </TouchableOpacity>
                  </Animated.View>
               </Animated.View>

               {/* Content */}
               <View style={{width: '100%'}}>
                  {children}
               </View>
            </Animated.ScrollView>
         </View>
      )
   }
}

CollapseHeader.propTypes = propTypes;
CollapseHeader.defaultProps = defaultProps;
export default CollapseHeader;