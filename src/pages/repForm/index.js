import React, { Component } from 'react';

import RepForm from '../../components/RepForm';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class RepFormPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCard');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <RepForm />;
  }
}