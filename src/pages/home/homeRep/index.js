import React, { Component } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { styles } from '../../../components/styles';

import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../../androidBackButton';

class HomeRep extends Component {

  componentWillMount() {
    handleAndroidBackButton(exitAlert);
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }



  render() {
    return (


      <View style={styles.container}>
        <Text> hello  !</Text>
     
        <TouchableOpacity onPress={() => this.props.navigation.navigate('RepForm')} style={styles.button}>
          <Text>Adicionar Republica</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('RepCRUD')} style={styles.button}>
          <Text>Gerenciar Republica</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Anuncio')} style={styles.button}>
          <Text>Anuncio</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default withNavigation(HomeRep);