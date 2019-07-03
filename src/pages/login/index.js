import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Login from '../../components/login';
import RepCard from '../repCard';
import { firebase } from '../../../Firebase'

export default class LoginPage extends Component {

  componentWillMount() {
    handleAndroidBackButton(exitAlert);
    this.requestPermission()
  }

  componentDidMount() {
    this.createChannel()
    this.createHandler()
  }

  requestPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    try {

      if(enabled)
        return

      await firebase.messaging().requestPermission()
    } catch (err) {
      console.log(err)
    }
  }

  createHandler = () => {

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // do something
    });
  }

  createChannel = () => {
    const channel = new fb_aux.notifications.Android.Channel('notification_rep', 'notification_rep', fb_aux.notifications.Android.Priority.Max)
      .setDescription('notification_rep');

    firebase.notifications().android.createChannel(channel)
  }

  isLogged = () => {
    if(firebase.auth().currentUser){
      return true
    } else {
      return false
    }
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  render() {
    if(this.isLogged())
      return (<RepCard />);
    else
      return (<Login />);
  }
}
