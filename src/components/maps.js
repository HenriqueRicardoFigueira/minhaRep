import React, { Component } from 'react';
import { styles } from './styles';
import { withNavigation } from 'react-navigation'
import {View , Text} from 'react-native';
import MapView from 'react-native-maps';


class Maps extends Component {
  

  render() {

    return (
      <MapView style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
       />
    );
  }
}
export default withNavigation(Maps);