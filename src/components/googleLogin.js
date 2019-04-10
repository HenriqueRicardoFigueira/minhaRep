import React, { Component } from 'react';
import {GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Button, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

GoogleSignin.configure({ 
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
  webClientId: '<299714124161-io5fs0nrf92eko0vk6kr7dnf8t6k4oam.apps.googleusercontent.com>', 
  offlineAccess: true, 
  hostedDomain: '', 
  forceConsentPrompt: true, 
  accountName: '',
});

export default class GoogleLogin extends Component {
  signIn = async () => {
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure();
  
      const data = await GoogleSignin.signIn();
  
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential);
  
      console.log(currentUser);
    } catch (e) {
      console.error(e);
    }
  };  

  render() {
    return <Button style={styles.button} title="Continue with Google" onPress={this.signIn}/>;
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