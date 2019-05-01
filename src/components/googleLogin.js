import React, { Component } from 'react';
import {GoogleSignin, statusCodes, GoogleSigninButton} from 'react-native-google-signin';
import { Button, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation'

GoogleSignin.configure({ 
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
  webClientId: '<299714124161-io5fs0nrf92eko0vk6kr7dnf8t6k4oam.apps.googleusercontent.com>', 
  offlineAccess: true, 
  hostedDomain: '', 
  forceConsentPrompt: true, 
  accountName: '',
});

class GoogleLogin extends Component {
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
      this.props.navigation.navigate("Home");
    } catch (e) {
      console.error(e);
    }
  };  

  render() {
    return <GoogleSigninButton style={styles.button} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Light} onPress={this.signIn}/>;
  }
}

export default withNavigation(GoogleLogin);


const styles = StyleSheet.create({
    button: {
        height: 48,
        width: 312,
        alignSelf: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})