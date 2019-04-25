import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import RepCard from '../../components/RepCard';
import { input, styles } from '../../components/styles';

export default class RepCardPage extends Component {

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    };
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

      }
    })
  }

  renderReps = () => {
    return Reps.map((item, i) => {
      return (
        <Animated.View
          {...this.PanResponder.panHandlers}
          key={item.id} style={[{ transform: this.position.getTranslateTransform() }, { height: styles.card.height - 70, width: styles.card.width, padding: 10, position: 'absolute' }]}>
          <RepCard title={item.title} />
        </Animated.View>
      )
    }).reverse();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }} >
        </View>

        <View style={{ flex: 1 }} >
          {this.renderReps()}
        </View>

        <View style={{ height: 60 }} >
        </View>
      </View>
    )
  }
}

// apenas para teste
const Reps = [
  { id: '1', title: 'Rep 1' },
  { id: '2', title: 'Rep 2' },
  { id: '3', title: 'Rep 3' },
  { id: '4', title: 'Rep 4' },
]