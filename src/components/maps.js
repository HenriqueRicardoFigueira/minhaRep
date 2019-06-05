import React, { Component } from 'react';
import { styles } from './styles';
import { withNavigation } from 'react-navigation'
import MapView from 'react-native-maps';
import { Dimensions } from "react-native";

//SETANDO CONSTANTES PARA MELHOR VISUALIZAÇÃO DO MAPA

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Maps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      region: null,
      //pegando parametros passados por props com o navigation
      latitude: this.props.navigation.getParam('latitude'),
      longitude: this.props.navigation.getParam('longitude'),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  }

  async componentDidMount() {

    // se a latitude já foi passado pelo props
    if (this.state.latitude != undefined && this.state.longitude != undefined) {
      // cria o objeto region com a lat e long que foi passado
      this.setState({
        region: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }
      })

      return
    }

    // recupera a localização do celular
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => { // função de sucesso
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }
        })
      },
      () => { // função de erro
      },
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    )
  }

  render() {
    const { region } = this.state;

    return (
      <MapView style={styles.map}
        initialRegion={region}
        showsUserLocation
        loadingEnabled
      >
        <MapView.Marker
          coordinate={{
            latitude: this.state.latitude,
            longitude: this.state.longitude
          }}
          tittle={"nozes"}
        />

      </MapView>
    );
  }
}

// propriedades padrão do componente
// mapa sobre o Brasil
Maps.defaultProps = {
  latitudeDelta: 0.0143,
  longitudeDelta: 0.0134,
}

export default withNavigation(Maps);


