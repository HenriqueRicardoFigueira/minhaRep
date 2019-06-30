import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Login from '../../components/login';
import RepCard from '../repCard';
import { firebase } from '../../../Firebase'

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
