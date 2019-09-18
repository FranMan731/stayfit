const React = require('react-native');
const {StyleSheet} = React;

const styles = StyleSheet.create({
   fill: {
      flex: 1,
   },
   content: {
      flex: 1,
   },
   header: {
      top: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      position: 'absolute',
      backgroundColor: '#6200ea'
   },
   backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: null,
      resizeMode: 'cover',
   },
   action: {
      left: -23,
      right: 0,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 40,
      position: 'absolute',
      zIndex: 6
   },
   bar: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      flexDirection: "row",
      justifyContent: 'space-between',
      zIndex: 5
   },
   left: {
      flex: 1,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
   },
   right: {
      flex: 1,
      width: 30,
      justifyContent: 'center',
      alignItems: 'center',
   },
   title: {
      fontFamily: 'CircularStd-Medium',
      fontSize: 20,
      color: '#fff',
   },
   subtitle: {
      fontFamily: 'CircularStd-Book',
      fontSize: 14,
      color: '#FCDB33',
   },
   scrollViewContent: {
      paddingTop: 30,
   },
   row: {
      height: 40,
      margin: 16,
      backgroundColor: '#D3D3D3',
      alignItems: 'center',
      justifyContent: 'center',
   },
   absoluteFill: {
      position: 'absolute',
      width: '100%',
      height: '100%',
   },
});
export default styles;
