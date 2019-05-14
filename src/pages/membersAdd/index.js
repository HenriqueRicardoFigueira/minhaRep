import React, { Component } from 'react';

import MembersAdd from '../../components/MembersAdd';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

// import { Container } from './styles';

export default class MembersAddPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'MembersList');
  }

  render() {
    return <MembersAdd />;
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}
