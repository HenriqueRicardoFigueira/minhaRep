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
    suitsColor: '#c6dcf4',
    wifiColor: '#c6dcf4',
    partyColor: '#c6dcf4',
    petsColor: '#c6dcf4',
  }

  componentWillMount() {
    if (this.props != null)
      t = this.props.tags
      console.log(t);
      if (t.suits == true)
        this.setState({ suitsColor: '#8002ff' })
      if (t.garage == true)
        this.setState({ garageColor: '#8002ff' })
      if(t.pets == true)
        this.setState({petsColor: '#8002ff' })
      if(t.party == true)
        this.setState({partyColor: '#8002ff' })
      if(t.wifi == true)
        this.setState({wifiColor: '#8002ff' })
      else{
        return;
      }
  }
  // logica usada é quando alguem clicar em um botao ele troca de cor e seta um status true no estado
  // foi feito dessa forma pois tive problemas com setState em objetos
  render() {
    return (


      <Row>
        <Button transparent onPress={() => {
          if (this.state.suitsColor == '#c6dcf4') {
            this.setState({ suitsColor: '#8002ff' });
            EventRegister.emit('changeIcon', 'suits')
          }
          else {
            this.setState({ suitsColor: '#c6dcf4' })
            EventRegister.emit('changeIcon', 'nosuits')
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='bath' color={this.state.suitsColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.garageColor == '#c6dcf4') {
            this.setState({ garageColor: '#8002ff' })
            EventRegister.emit('changeIcon', 'garage')
          }
          else {
            this.setState({ garageColor: '#c6dcf4' })
            EventRegister.emit('changeIcon', 'nogarage')
          }
        }} >
          <FontAwesome size={this.state.iconSize} name='car' color={this.state.garageColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.petsColor == '#c6dcf4') {
            this.setState({ petsColor: '#8002ff' })
            EventRegister.emit('changeIcon', 'pets')
          }
          else {
            this.setState({ petsColor: '#c6dcf4' })
            EventRegister.emit('changeIcon', 'nopets')
          }
        }} >
          <FontAwesome size={this.state.iconSize} name='paw' color={this.state.petsColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.wifiColor == '#c6dcf4') {
            this.setState({ wifiColor: '#8002ff' })
            EventRegister.emit('changeIcon', 'wifi')
          }
          else {
            this.setState({ wifiColor: '#c6dcf4' })
            EventRegister.emit('changeIcon', 'nowifi')
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='wifi' color={this.state.wifiColor} />
        </Button>
        <Button transparent onPress={() => {
          if (this.state.partyColor == '#c6dcf4') {
            this.setState({ partyColor: '#8002ff' })
            EventRegister.emit('changeIcon', 'party')
          }
          else {
            this.setState({ partyColor: '#c6dcf4' })
            EventRegister.emit('changeIcon', 'noparty')
          }
        }}>
          <FontAwesome size={this.state.iconSize} name='music' color={this.state.partyColor} />
        </Button>

      </Row>


    );
  }
}
export default withNavigation(Tags);