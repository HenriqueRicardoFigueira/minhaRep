import React, { Component } from 'react';
import { View, Animated, Image, PanResponder, Text } from 'react-native';
import RepCard from '../../components/RepCard';
import { styles } from '../../components/styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

// apenas para teste
const Reps = [
  { id: '1', title: 'Camargo Correia', localization: 'Rua das Tipuanas Amarelas, 70', imageLink: 'https://i.pinimg.com/originals/fd/e9/a4/fde9a48af9b22286c716df53e99d0b26.jpg', bathroom: 2, bed: 5, users: 4, price: 400, vacancies: 1, latitude: -24.04766912, longitude: -52.3788321 },
  { id: '2', title: 'República em Preto e Branco', localization: 'Rua São Paulo, 902', imageLink: 'https://i.pinimg.com/originals/58/5e/ba/585ebab40b803e11f92a6b9fb657b809.jpg', bathroom: 1, bed: 3, users: 2, price: 430, vacancies: 1, latitude: -24.04400474, longitude: -52.38975406 },
  { id: '3', title: 'República Diamente Jortão Castro', localization: 'Rua Gerondinos, 839', imageLink: 'https://i.pinimg.com/originals/d5/ee/b7/d5eeb71aaeaa6d8fb801e7981e033ae7.jpg', bathroom: 2, bed: 5, users: 3, price: 350, vacancies: 2, latitude: -24.03970338, longitude: -52.38467932 },
  { id: '4', title: 'Trovão', localization: 'Rua Rafael Brasilio Gerônimo Antes, 73', imageLink: 'http://customerscares.co/wp-content/uploads/2019/03/tiny-house-pinterest-style-tiny-house-awesome-best-old-houses-images-on-small-house-interior-design-pinterest.jpg', bathroom: 2, bed: 5, users: 3, price: 350, vacancies: 2, latitude: -24.0437598, longitude: -52.37944365 },
]

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

  removeSim = (gestureState) => {
    Animated.spring(this.position, {
      toValue: { x: styles.screen.width + 100, y: gestureState.dy }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 });
      })
    })
  }

  removeNao = (gestureState) => {
    Animated.spring(this.position, {
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

  componentWillMount() {
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
              this.removeNao(gestureState)
            } else if (gestureState.x0 > regionXminS && gestureState.x0 < regionXmaxS) {  // clicou no botão do SIM
              this.removeSim(gestureState)
            }
          }
        } else {    // não foi clicado, foi movido
          if (gestureState.dx > 120) {
            this.removeSim(gestureState)
          } else if (gestureState.dx < -120) {
            this.removeNao(gestureState)
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

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}