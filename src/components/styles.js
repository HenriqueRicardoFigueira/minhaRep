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
    marginBottom: 30,
    borderRadius: 10,
    fontSize: 18
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    padding: 10,
  },
  button: {
    height: 45,
    backgroundColor: '#069',
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20
  },
  image: {
    width: 180,
    height: 180,
    justifyContent: 'center'
  },

  loginView: {
    paddingTop: 10
  },
  scroll: {
    flex: 1,
    backgroundColor: '#e6f7ff',
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    width: SCREEN_WIDTH - 50,
    height: SCREEN_HEIGHT - 50,
    borderRadius: 20,
  },
  screen: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  }
});

module.exports = { input, styles };