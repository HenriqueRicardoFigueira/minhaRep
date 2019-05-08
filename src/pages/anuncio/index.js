import React, { Component } from 'react';

import Anuncio from '../../components/anuncio';
// import { Container } from './styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class AnuncioPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Home');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <Anuncio />;
  }
}
