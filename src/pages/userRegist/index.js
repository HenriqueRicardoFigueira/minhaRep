import React, { Component } from 'react';

import UserRegist from '../../components/UserRegist';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class UserRegistPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Login');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <UserRegist />;
  }
}
