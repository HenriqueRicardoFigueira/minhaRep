import React, { Component } from 'react';

import ChatList from '../../components/ChatList';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

export default class ChatListPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCard');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    return <ChatList/>;
  }
}