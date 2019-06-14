import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { Container, Header, Content, Button, Icon, Text, Item, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';
import { EventRegister } from 'react-native-event-listeners'

class Tags extends Component {

  state = {
    iconSize: styles.screen.width * 0.1,
    garageColor: '#c6dcf4',
    garage: false,
    suitsColor: '#c6dcf4',
    suits: false,
    wifiColor: '#c6dcf4',
    wifi: false,
    partyColor: '#c6dcf4',
    party: false,
    petsColor: '#c6dcf4',
    pets: false
  }


  // logica usada é quando alguem clicar em um botao ele troca de cor e seta um status true no estado
  // foi feito dessa forma pois tive problemas com setState em objetos
  render() {
    return (


      <Row>
        <Label>Tags:    </Label>
        <Button transparent onPress={() => {
          if (this.state.suitsColor == '#c6dcf4') {
            this.setState({ suitsColor: '#8002ff', suits: true });
            EventRegister.emit('changeIcon', this.state)
          }
          else {
            this.setState({ suitsColor: '#c6dcf4', suits: false })
            EventRegister.emit('changeIcon', this.state)
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='bath' color={this.state.suitsColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.garageColor == '#c6dcf4') {
            this.setState({ garageColor: '#8002ff', suits: true, garage: true, wifi: false, party: false, pets: false })
            EventRegister.emit('changeIcon', { garage: true })
          }
          else {
            this.setState({ garageColor: '#c6dcf4', garage: false })
            EventRegister.emit('changeIcon', { garage: false })
          }
        }} >
          <FontAwesome size={this.state.iconSize} name='car' color={this.state.garageColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.petsColor == '#c6dcf4') {
            this.setState({ petsColor: '#8002ff', pets: true })
            EventRegister.emit('changeIcon', { pets: true })
          }
          else {
            this.setState({ petsColor: '#c6dcf4', pets: false })
            EventRegister.emit('changeIcon', { pets: false })
          }
        }} >
          <FontAwesome size={this.state.iconSize} name='paw' color={this.state.petsColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.wifiColor == '#c6dcf4') {
            this.setState({ wifiColor: '#8002ff', wifi: true })
            EventRegister.emit('changeIcon', { wifi: true })
          }
          else {
            this.setState({ wifiColor: '#c6dcf4', wifi: false })
            EventRegister.emit('changeIcon', { wifi: false })
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='wifi' color={this.state.wifiColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.partyColor == '#c6dcf4') {
            this.setState({ partyColor: '#8002ff', party: true })
            EventRegister.emit('changeIcon', { party: true })
          }
          else {
            this.setState({ partyColor: '#c6dcf4', party: false })
            EventRegister.emit('changeIcon', {party: false})
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='music' color={this.state.partyColor} />
        </Button>

      </Row>


    );
  }
}
export default withNavigation(Tags);