import React, { Component } from 'react';
import { View, Animated, Image, PanResponder, Text } from 'react-native';
import RepCard from '../../components/RepCard';
import { input, styles } from '../../components/styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

// apenas para teste
const Reps = [
  { id: '1', title: 'Camargo Correia', localization: 'Rua das Tipuanas Amarelas, 70', imageLink: 'https://i.pinimg.com/originals/fd/e9/a4/fde9a48af9b22286c716df53e99d0b26.jpg' },
  { id: '2', title: 'República em Preto e Branco', localization: 'Rua São Paulo, 902', imageLink: 'https://i.pinimg.com/originals/58/5e/ba/585ebab40b803e11f92a6b9fb657b809.jpg' },
  { id: '3', title: 'República Diamente Jortão Castro', localization: 'Rua Gerondinos, 839', imageLink: 'https://i.pinimg.com/originals/d5/ee/b7/d5eeb71aaeaa6d8fb801e7981e033ae7.jpg' },
  { id: '4', title: 'Trovão', localization: 'Rua Rafael Brasilio Gerônimo Antes, 73', imageLink: 'http://customerscares.co/wp-content/uploads/2019/03/tiny-house-pinterest-style-tiny-house-awesome-best-old-houses-images-on-small-house-interior-design-pinterest.jpg' },
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

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Home');

    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: styles.screen.width + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -styles.screen.width - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 });
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
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

            <RepCard title={item.title} imageLink={item.imageLink} localization={item.localization}/>

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

            <RepCard title={item.title} imageLink={item.imageLink} localization={item.localization}/>

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