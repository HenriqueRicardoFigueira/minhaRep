import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import Login from './src/components/login';
import UserRegist from './src/components/UserRegist';
import AppContainer from './src/components/routes';
import { createAppContainer } from 'react-navigation';


class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <View>
          <AppContainer/>
        </View>
      </ScrollView>
    );
  }
}export default createAppContainer(App)
