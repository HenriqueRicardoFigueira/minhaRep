import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Login from '../../components/login';
import RepCard from '../repCard';
import { firebase } from '../../../Firebase'
import fb_aux from 'react-native-firebase'
import { Alert, AppState } from 'react-native';
import { createMessage, resolveName } from '../../components/message';

export default class LoginPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(exitAlert);
  }

  isLogged = () => {
    if(firebase.auth().currentUser){
      return true
    } else {
      return false
    }
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    if(this.isLogged())
      return (<RepCard />);
    else
      return (<Login />);
  }
}
