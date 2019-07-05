import firebaseSvc from './FirebaseSvc'
import { firebase } from '../../Firebase'
import fb_aux from 'react-native-firebase'
import { Alert, AppState } from 'react-native'

createMessage = async (text, uid, data) => {
  return {
  	text: text,
   	createdAt: firebaseSvc.timestamp,
  	user: {
    	_id: uid,
    	avatar: null,   // aqui tem que passar o avatar do user
    	name: await resolveName(uid)
  	},
    data: data
  }
}

resolveName = async (uid) => {
	name = ''
	await firebase.firestore().collection('users').doc(uid)
	.get()
	.then( data => {
		name = data._data.name
	})

	return name
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
  firebase.notifications().onNotification((notification) => {
    if(notification.data.invite == 'true') {
      invite(notification)
    } else {
      showNotification(notification)
    }
  });
}

createChannel = () => {
  const channel = new fb_aux.notifications.Android.Channel('notification_rep', 'notification_rep', fb_aux.notifications.Android.Priority.Max)
    .setDescription('notification_rep');

  firebase.notifications().android.createChannel(channel)
}

confirma = async (notification, confirm, message) => {
  uid = firebase.auth().currentUser.uid
  userId = notification.data.userId

  uid = 'VQgYIhsbngRYH1wNM9uYJ94rnll1'
  userId = 'XSfhxSVNswMgkrJphNgCGFonnAP2'

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
      { text: 'NÃO', onPress: async () => await confirma(notification, false, await resolveName(firebase.auth().currentUser.uid) + " não aceitou o convite.") },
      { text: 'SIM', onPress: async () => await confirma(notification, true,  await resolveName(firebase.auth().currentUser.uid) + " aceitou o convite.") }
    ]
  )
}

invite = (notification) => {
  if(AppState.currentState == 'active') {
    showDialog(notification)
  } else {
    showNotification(notification)
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

requestPermission()
createChannel()
createHandler()

module.exports = { createMessage, resolveName, invite }