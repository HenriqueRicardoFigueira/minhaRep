import React, { Component } from 'react';

import { Button, StyleSheet } from 'react-native';

// import { Container } from './styles';

export default class FacebookLogin extends Component {
  render() {
    return <Button style={styles.button} title="Continue with Facebook"/>;
  }
}


const styles = StyleSheet.create({
    button: {
        height: 45,
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})