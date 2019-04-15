import React, { Component } from 'react';
import {TouchableOpacity , Text} from 'react-native';
import FBSDK, {GraphRequest} from 'react-native-fbsdk';
import {styles} from './styles';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';


class FacebookLogin extends Component {

  face = async () => (
    FBSDK.LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          alert('Login was successful with permissions: '
            + result.grantedPermissions.toString());
        }
        
        FBSDK.AccessToken.getCurrentAccessToken()
        .then(
          (data) => {
            /*let req = new GraphRequest('/me', {
              httpMethod: 'GET',
              version: 'v2.5',
              parameters: {
                  'fields': {
                      'string' : 'email,name'
                  }
              }
              }, (err, res) => {
                console.log(err, res);
              });
              console.log(req.parameters.fields);
              */
              const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
              firebase.auth().signInWithCredential(credential);
              console.log(firebase.auth().currentUser);
        }); 
      },
      function(error) {
        console.log('Login failed with error: ' + error);
      }
    )
  );

  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={this.face}>
        <Text style={styles.butonText}> Continue with Facebook </Text>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(FacebookLogin);