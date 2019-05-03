import React, { Component } from 'react';
import { styles } from './styles';
import { withNavigation } from 'react-navigation'
import MapView from 'react-native-maps';

class Maps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      latitude: props.latitude,
      longitude: props.longitude,
      latitudeDelta: props.latitudeDelta,
      longitudeDelta: props.longitudeDelta,
    }
  }

  render() {
    return (
      <MapView style={styles.map}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }}
      />
    );
  }
}

// propriedades padrão do componente
// mapa sobre o Brasil
Maps.defaultProps = {
  latitude: -15.11455287,
  longitude: -49.48242188,
  latitudeDelta: 45,
  longitudeDelta: 45,
}

export default withNavigation(Maps);