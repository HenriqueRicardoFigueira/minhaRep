import React, { Component } from 'react';

import { View, Text } from 'react-native';

// import { Container } from './styles';

export default class List extends Component {
  render() {
    return (<View>
        <Text>{this.props.name}</Text>
    </View> 
    );
  }
}
