import React, { Component } from 'react';
import {TouchableOpacity , Text} from 'react-native';
import FBSDK, {GraphRequest} from 'react-native-fbsdk';
import {styles} from './styles';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import { bindExpression } from '@babel/types';



class FacebookLogin extends Component {
  constructor(props){
    super(props);
    this.face = this.face.bind(this);
    }

 
  face = async () => (
    FBSDK.LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function (result) {
        try {
          if (result.isCancelled) {
            alert('Login was cancelled');
          } else {
            alert('Login was successful with permissions: '
              + result.grantedPermissions.toString());
              
          }
          
          FBSDK.AccessToken.getCurrentAccessToken()
          .then(
            (data) => {
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                firebase.auth().signInWithCredential(credential);
                console.log(firebase.auth().currentUser);
               
          }); 
        
          
        } catch (error) {
          console.log('Login failed with error: ' + error);
        }
       
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