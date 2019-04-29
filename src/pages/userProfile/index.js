import React, { Component } from 'react';

import UserProfile from '../../components/UserProfile';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

// import { Container } from './styles';

export default class UserProfilePage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Home');
  }

  render() {
    return <UserProfile />;
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}
