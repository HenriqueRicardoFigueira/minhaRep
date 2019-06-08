import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Options from '../../components/options';

export default class OptionsPage extends Component {
  render() {
    return <Options/>;
  }
}
