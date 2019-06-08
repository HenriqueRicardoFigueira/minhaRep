import React, { Component } from 'react';

import Maps from '../../components/maps';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class MapsPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCard');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <Maps />;
  }
}