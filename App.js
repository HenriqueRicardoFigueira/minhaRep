import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import Login from './src/components/login';
import UserRegist from './src/components/UserRegist';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <View>
          <UserRegist/>
        </View>
      </ScrollView>
    );
  }
}
