import React, { Component } from 'react';

import RepCRUD from '../../components/RepCRUD';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class RepCRUDPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Home');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <RepCRUD />;
  }
}