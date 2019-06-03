import React, { Component } from 'react';
import { Button, Text, List, ListItem, Left, Right, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View} from 'react-native';
import { withNavigation } from 'react-navigation';

// import { Container } from './styles';

class Options extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View>
        <ListItem button>
          <Left>
            <Icon active name="airplane"></Icon>
          </Left>
          <Body>
            <Button style={{ backgroundColor: "#FF9501" }} onPress={() => this.props.navigation.navigate('UserProfile')}><Text>Editar perfil</Text></Button>
          </Body>
          <Right> 
            <Icon active name="arrow-forward" />
          </Right>
        </ListItem>
      </View>
    );
  }
}
export default withNavigation(Options)
