import React, { Component } from 'react';

import RepEdit from '../../components/RepEdit';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class RepEditPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCard');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <RepEdit />;
  }
}