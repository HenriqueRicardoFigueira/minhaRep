import React from 'react';
import { View, ScrollView } from 'react-native';
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
