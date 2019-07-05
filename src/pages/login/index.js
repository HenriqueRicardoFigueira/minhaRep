import React, { Component } from 'react';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Login from '../../components/login';
import RepCard from '../repCard';
import { firebase } from '../../../Firebase'
import fb_aux from 'react-native-firebase'
import { Alert, AppState } from 'react-native';
import { createMessage, resolveName } from '../../components/message';

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

  confirma = async (notification, confirm, message) => {
    uid = firebase.auth().currentUser.uid
    userId = notification.data.userId

    await firebase.firestore()
      .collection('chats')
      .doc(uid)
      .collection(userId)
      .doc()
      .set(await createMessage(message, uid, {exists: false}))

    if (confirm && notification.data.closeAnnounce == 'true') {
      // close announce
    }
  }

  showDialog = async (notification) => {
    Alert.alert(
      notification.data.user + ' enviou um convite.', 'Deseja aceitar ?',
      [
        { text: 'NÃO', onPress: async () => await this.confirma(notification, false, await resolveName(firebase.auth().currentUser.uid) + " não aceitou o convite.") },
        { text: 'SIM', onPress: async () => await this.confirma(notification, true,  await resolveName(firebase.auth().currentUser.uid) + " aceitou o convite.") }
      ]
    )
  }

  invite = (notification) => {
    if(AppState.currentState == 'active') {
      this.showDialog(notification)
    } else {
      this.showNotification(notification)
    }
  }

  showNotification = (notification) => {
    const notificationForeground = new fb_aux.notifications.Notification()
      .setTitle(notification.title)
      .setBody(notification.body)
      .setNotificationId(notification.notificationId)
      .setSound('default')
      .android.setChannelId('notification_rep')
      .android.setPriority(fb_aux.notifications.Android.Priority.Max);

      firebase.notifications().displayNotification(notificationForeground)
  }

  createHandler = () => {

    this.notificationListener = firebase.notifications().onNotification((notification) => {
      if(notification.data.invite == 'true') {
        this.invite(notification)
      } else {
        this.showNotification(notification)
      }
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
