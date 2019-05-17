import React, { Component } from 'react';

import UserRegistAlt from '../../components/UserRegistAlt';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class UserRegistAltPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Login');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <UserRegistAlt />;
  }
}
