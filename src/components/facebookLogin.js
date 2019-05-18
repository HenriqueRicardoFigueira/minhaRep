import React, { Component } from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import FBSDK, { GraphRequest } from 'react-native-fbsdk';
import { styles } from './styles';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import { bindExpression } from '@babel/types';

const ref = firebase.firestore().collection('users');

class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.face = this.face.bind(this);
    this.navega = this.navega.bind(this);
    

    this.state = {
      name: '',
      email: '',
      photoURL: '',
    }

  }

  navega = () => {
    user = firebase.auth().currentUser;
    if (user)
      console.log(user);

  }

  face = async () => {
    const { navigation } = this.props;
    this.setState(async (currentUser) => {
      await FBSDK.LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
        async function (result) {
          try {
            if (result.isCancelled) {
              alert('Login was cancelled');
            } else {
              alert('Login was successful with permissions: '
                + result.grantedPermissions.toString());

            }

            await FBSDK.AccessToken.getCurrentAccessToken()
              .then(
                async (data) => {
                  const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                  currentUser = await firebase.auth().signInWithCredential(credential);
                  console.log(ref);
                  console.log(ref.doc(currentUser.user.uid).get())
                  await ref.doc(currentUser.user.uid).get().then((user) => {
                    console.log(user.exists)
                    if (user.exists == true) {
                      navigation.navigate("Home");
                    } else {
                      ref.doc(currentUser.user.uid).set({
                        name: currentUser.additionalUserInfo.profile.first_name,
                        email: currentUser.user.email,
                        photoURL: currentUser.user.photoURL
                      });
                      navigation.navigate("UserRegistAlt");
                    }
                  }).catch(function (error) {
                    console.error(error);
                    throw error
                  });
                });

          } catch (error) {
            console.log('Login failed with error: ' + error);
          }

        }
      )
      /*console.log(currentUser)
      this.ref.doc(user.uid).set({
        name: currentUser.additionalUserInfo.profile.first_name,
        email: currentUser.user.email,
        photoURL: currentUser.user.photoURL
      })*/
    });
    this.navega();
  };

  render() {
    return (
      <TouchableOpacity style={styles.fbButton} onPress={this.face}>
        <Image style={styles.fbImg} source={require('../image/flogo_rgb_hex-brc-site-250.png')} />
        <Text style={styles.fbButtonText}> Continuar com o Facebook </Text>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(FacebookLogin);