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
    padding: 25,
  },
  registerButton:{
    alignSelf: 'center',
    width: 320, 
    height: 50,
    marginBottom: 10,
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
    width: 303, 
    height: 42,
    backgroundColor: '#fff',
    marginBottom: 2,
    //paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    flexDirection: 'row'
  },
  floatInput:{
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    width: 320, 
    height: 50,
    backgroundColor: '#F0803C',
    marginTop: 15,
    marginBottom: 5,
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
    marginBottom: 50
  },

  loginView: {
    paddingTop: 10,
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
});

module.exports = { input, styles };