import React, { Component } from 'react';

import MembersList from '../../components/MembersList';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

// import { Container } from './styles';

export default class MembersListPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCRUD');
  }

  render() {
    return <MembersList />;
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}
