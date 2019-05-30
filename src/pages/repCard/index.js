import React, { Component } from 'react';
import { View, Animated, PanResponder, Text } from 'react-native';
import RepCard from '../../components/RepCard';
import { firebase } from '../../../Firebase'
import { styles } from '../../components/styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';
import { EventRegister } from 'react-native-event-listeners'

const Reps = [];
const photoURL = '../../image/houseIcon.png'

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  }

  removeSim = (gestureState, speed) => {
    Animated.spring(this.position, {
      tension: speed,
      toValue: { x: styles.screen.width + 100, y: gestureState.dy },
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 });
      })
    })
  }

  removeNao = (gestureState, speed) => {
    Animated.spring(this.position, {
      tension: speed,
      toValue: { x: -styles.screen.width - 100, y: gestureState.dy }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 });
      })
    })
  }

  voltaAnimacao = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 },
      friction: 4
    }).start()
  }

  verificaCliqueFoto = (x0, y0) => {
    regionYmin = Math.floor(styles.screen.height * 0.785)
    regionYmax = Math.floor(styles.screen.height * 0.885)
    regionXmin = Math.floor(styles.screen.width * 0.03125)
    regionXmax = Math.floor(styles.screen.width * 0.98438)

    if (y0*0.922 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if(x0 >= Math.floor(styles.screen.width/2)) {
        EventRegister.emit('changeImage', 1)  // avança a imagem
      } else {
        EventRegister.emit('changeImage', -1) // retrocede a imagem
      }
    }
  }

  async componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Home');

    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        // se a distancia é igual a 0, então clicou
        if (gestureState.dx == 0 && gestureState.dy == 0) {
          // se clicou na região do botão
          regionYmin = Math.floor(styles.screen.height * 0.785)
          regionYmax = Math.floor(styles.screen.height * 0.885)
          if (gestureState.y0 > regionYmin && gestureState.y0 < regionYmax) {
            // recupera a região do botão NÃO e SIM
            regionXminN = Math.floor(styles.screen.width * 0.03125)
            regionXmaxN = Math.floor(styles.screen.width * 0.125)
            regionXminS = Math.floor(styles.screen.width * 0.84375)
            regionXmaxS = Math.floor(styles.screen.width * 0.98438)
            if (gestureState.x0 > regionXminN && gestureState.x0 < regionXmaxN) { // clicou no botão do NÃO
              this.removeNao(gestureState, 10)
            } else if (gestureState.x0 > regionXminS && gestureState.x0 < regionXmaxS) {  // clicou no botão do SIM
              this.removeSim(gestureState, 10)
            }
            // se não clicou no botão, pode ter clicado na foto
          } else {
            this.verificaCliqueFoto(gestureState.x0, gestureState.y0)
          }
        } else {    // não foi clicado, foi movido
          if (gestureState.dx > 120) {
            this.removeSim(gestureState, 12)
          } else if (gestureState.dx < -120) {
            this.removeNao(gestureState, 12)
          } else {
            this.voltaAnimacao()
          }
        }
      }
    })
  }

  renderReps = () => {
    return Reps.map((item, i) => {

      if (i == this.state.currentIndex) {
        return (

          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute' }]}>

            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
            </Animated.View>

            <RepCard rep={item} />

          </Animated.View>
        )
      }
      else if (i == this.state.currentIndex + 1) {
        return (
          <Animated.View
            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }], height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute'
            }]}>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 5, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 5, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
            </Animated.View>

            <RepCard rep={item} />

          </Animated.View>
        )
      } else {
        return null;
      }
    }).reverse()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>

        </View>
        <View style={{ flex: 1 }}>
          {this.renderReps()}
        </View>
        <View style={{ height: 60 }}>

        </View>
      </View>
    );
  }

  async getMembers(id, rep) {
    var membersSnapshot = await firebase.firestore().collection('republics/' + id + '/members').get()
    try {
      rep.members = membersSnapshot._docs
    } catch (err) {
      rep.members = []
    } finally {
      Reps.push(rep)
    }
  }

  async getDados() {
    this.ref = firebase.firestore().collection('republics');
    this.refAnuncio = firebase.firestore().collection('anuncio');
    this.refUser = firebase.auth().currentUser.uid;

    const repData = await this.ref.get()
    try {

      if (!repData._docs) {
        return
      }

      for (var i = 0; i < repData._docs.length; i++) {

        var ref = repData._docs[i]._data
        // se a república não estiver anunciada, continua para a próxima iteração
        if (!ref.isAnnounced) {
          continue
        }

        var rep = {
          id: i,
          title: ref.name,
          localization: ref.street,
          photoURL: ref.photoURL,
          bathroom: ref.bathroom,
          bed: ref.bed,
          members: null,  // este valor será preenchido abaixo
          value: ref.value,
          vacancies: ref.vacancies,
          latitude: ref.latitude,
          longitude: ref.longitude
        }

        // recupera os membros da república
        var id = repData._docs[i]._ref.id
        await this.getMembers(id, rep)
      }

      this.forceUpdate();
    } catch (err) {
      console.log("Err first try: ", err)
    }
  }

  componentDidMount() {
    this.getDados();
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}