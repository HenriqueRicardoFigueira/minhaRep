import React, { Component } from 'react';
import { GoogleSignin, statusCodes, GoogleSigninButton } from 'react-native-google-signin';
import { Button, StyleSheet, Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  webClientId: '<299714124161-io5fs0nrf92eko0vk6kr7dnf8t6k4oam.apps.googleusercontent.com>',
  offlineAccess: true,
  hostedDomain: '',
  forceConsentPrompt: true,
  accountName: '',
});

class GoogleLogin extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');

    this.state = {
      name: '',
      email: '',
      photoURL: '',
    }

  }
  signIn = async () => {
    try {
      // Add any configuration settings here:
      await GoogleSignin.configure();

      const data = await GoogleSignin.signIn();

      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      //console.log(credential)
      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential);
      //console.log(currentUser)
      //console.log(this.ref.doc(this.ref.doc(currentUser.user.uid).get().empty()))
      /*if (this.ref.doc(currentUser.user.uid).get().empty){
        console.log('1')
      }else{
        console.log('2')
      }*/
      await this.ref.doc(currentUser.user.uid).get().then((user) => {
        console.log(user.exists)
        if (user.exists == true && user.data().age != null && user.data().bio != null) {
          this.props.navigation.navigate("RepCard");
        } else {
          this.ref.doc(currentUser.user.uid).set({
            bio: user.data().bio,
            age: user.data().age,
            uid: currentUser.user.uid,
            name: currentUser.additionalUserInfo.profile.given_name,
            email: currentUser.user.email,
            photoURL: currentUser.user.photoURL
          });
          this.props.navigation.navigate("UserRegistAlt");
        }
      }).catch(function(error){
        console.error(error);
        throw error
      });


    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return <GoogleSigninButton style={styles.button} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Light} onPress={this.signIn} />;
  }
}

export default withNavigation(GoogleLogin);


const styles = StyleSheet.create({
  button: {
    width: SCREEN_WIDTH * 0.735,
    height: SCREEN_HEIGHT * 0.065,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_HEIGHT * 0.002,
    justifyContent: 'center',
    alignItems: 'center',
  },
})