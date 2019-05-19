import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

// para alterar a cor da borda dinamicamente
var input = (borderColor) => {
  return {
    paddingTop: 10,
    height: 45,
    backgroundColor: '#FFF',
    alignSelf: 'stretch',
    borderColor: borderColor,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 18
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff7f9',
    padding: SCREEN_WIDTH*0.025,
  },
  registerButton:{
    alignSelf: 'center',
    width: SCREEN_WIDTH*0.8, 
    height:SCREEN_HEIGHT*0.07,
    marginBottom: SCREEN_HEIGHT*0.01,
    //paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  fbImg:{
    width: 20,
    height: 20,
    justifyContent: 'flex-start',
    marginRight: 50,
  },
  fbButtonText: {
    color: '#1b2021',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    fontWeight: 'bold',

  },
  fbButton:{
    alignSelf: 'center',
    width: SCREEN_WIDTH*0.715, 
    height: SCREEN_HEIGHT*0.055,
    backgroundColor: '#fff',
    marginBottom: SCREEN_HEIGHT*0.002,
    //paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    flexDirection: 'row'
  },
  floatInput:{
    marginTop: SCREEN_HEIGHT*0.005,
  },
  button: {
    alignSelf: 'center',
    width: SCREEN_WIDTH *0.8, 
    height: SCREEN_HEIGHT*0.050,
    backgroundColor: '#F0803C',
    marginTop: SCREEN_HEIGHT*0.015,
    marginBottom: SCREEN_HEIGHT*0.005,
    //paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  registerText: {
    color: '#1b2021',
    textDecorationLine: 'underline',
    fontSize: 18
  },
  buttonText: {
    color: '#1b2021',
    fontWeight: 'bold',
    fontSize: 20
  },
  image: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    marginBottom:SCREEN_HEIGHT * 0.05
  },

  loginView: {
    paddingTop: SCREEN_HEIGHT * 0.010,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#e6f7ff',
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    width: SCREEN_WIDTH*0.98,
    height: SCREEN_HEIGHT*0.90,
    borderRadius: 20,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  screen: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  viewImage: {
    paddingTop: 5,
    width: SCREEN_WIDTH * 0.97,
  },
  viewText: {
    paddingLeft: 5,
    paddingTop: SCREEN_HEIGHT * 0.58,
    position: 'absolute',
  },
  repTitle: {
    fontSize: 20,
    color: '#ffffff',
  },
  repLocalization: {
    fontSize: 15,
    color: '#ffffff',
  },
  iconView: {
    padding: 7,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.85,
  },
  icon: {
    margin: 1.8,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff944d',
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_WIDTH * 0.17,
  },
  repImage: {
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#8c8c8c',
    width: SCREEN_WIDTH * 0.98 * 0.97,
    height: SCREEN_HEIGHT * 0.90 * 0.80,
  },
  iconViewText: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconText: {
    fontSize: 15
  },
  header: {
    backgroundColor: '#F0803C',
  },
  body: {
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#eff7f9',
    padding: SCREEN_HEIGHT*0.005,
  },
  containerList: {
    height: 55,
    backgroundColor: '#eff7f9',
    //padding: SCREEN_HEIGHT*0.005,
  },
  listText: {
    fontSize: 20,
    padding: 3,
    fontWeight: 'bold',
  },
  listSubText: {
    fontSize: 20,
    padding: 3,
  },
});

module.exports = { input, styles };