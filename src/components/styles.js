import { StyleSheet, Dimensions, Platform } from 'react-native';

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
    padding: SCREEN_HEIGHT*0.03,
  },
  containerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff7f9',
    marginTop: SCREEN_WIDTH*0.10,
  },
  scrollView: {
    flexGrow: 1,
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
    backgroundColor: '#8002ff',
    marginTop: SCREEN_HEIGHT*0.015,
    marginBottom: SCREEN_HEIGHT*0.005,
    //paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  registerText: {
    color: '#465c84',
    textDecorationLine: 'underline',
    fontSize: 18
  },
  buttonText: {
    color: '#fff',
    
    fontSize: 20
  },
  image: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    borderRadius: 30,
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
    backgroundColor: '#fff',
    width: SCREEN_WIDTH*0.98,
    height: SCREEN_HEIGHT*0.85,
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
    paddingLeft: SCREEN_WIDTH * 0.07,
    paddingTop: SCREEN_HEIGHT * 0.55,
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
    backgroundColor: '#eff7f9',
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
  },
  repImage: {
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#8c8c8c',
    width: SCREEN_WIDTH * 0.89,
    height: SCREEN_HEIGHT * 0.70,
  },
  iconViewText: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 15
  },
  header: {
    backgroundColor: '#c6dcf4',
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
  inputStyle:{
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Oswald-Light',
  },
  tags: {
    paddingHorizontal: SCREEN_WIDTH* 0.01
  }
});

module.exports = { input, styles };