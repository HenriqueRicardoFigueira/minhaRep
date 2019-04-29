import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Login from '../../components/login';

export default class LoginPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(exitAlert);
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <Login />;
  }
}
