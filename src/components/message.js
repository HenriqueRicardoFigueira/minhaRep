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

close = async (uid, data) => {
  firebase.firestore().collection('republics').doc(data.admUID).update({
    // apenas estes dois campos são atualizados
    vacancies: data.vacancies-1,
    isAnnounced: data.vacancies-1 == 0 ? false : data.isAnnounced,
    bathroom: data.bathroom,
    bed: data.bed,
    name: data.name,
    bio: data.bio,
    numberHome: data.numberHome,
    street: data.street,
    cep: data.cep,
    city: data.city,
    uf: data.uf,
    latitude: data.latitude,
    longitude: data.longitude,
    tags: data.tags,
    admUID: data.admUID,
    photoURL: data.photoURL,
    gotUrl: data.gotUrl,
    value: data.value
  })

  if(data.vacancies-1 == 0) {
    await firebase.firestore()
      .collection('chats')
      .doc(uid)
      .collection(data.admUID)
      .doc()
      .set(await createMessage('Anunciou da república foi fechado.', uid, {exists: false}))
  }
}

confirma = async (notification, confirm, message) => {
  uid = firebase.auth().currentUser.uid
  userId = notification.data.userId

  await firebase.firestore().collection('republics').doc(userId).get()
    .then(async (data) => {

      data = data.data()
      if(!confirm) {
        // responde com não
        await firebase.firestore()
          .collection('chats')
          .doc(uid)
          .collection(userId)
          .doc()
          .set(await createMessage(message, uid, {exists: false}))

          return
      } else if (data.vacancies == 0) {
        alert('O anuncio já foi fechado. Por favor, contate o admin da rep.')
        return
      }

      // responde com sim
      await firebase.firestore()
        .collection('chats')
        .doc(uid)
        .collection(userId)
        .doc(uid)
        .set(await createMessage(message, uid, {exists: false}))

      // adiciona na república
      await firebase.firestore().collection('republics/' + userId + '/members')
      .doc(userId)
      .set({
        name: await resolveName(uid),
        uid: uid
      })

      if(notification.data.closeAnnounce == 'true') {
        await close(uid, data)
      }
  })
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

// envia uma mensagem com alguns dados a mais
enviaConvite = async (user, repId, close) => {
  await firebase.firestore()
    .collection('chats')
    .doc(user)
    .collection(repId)
    .doc()
    .set(await createMessage('Você foi convidado para a república', user, {exists: true, invite: true, user: await resolveName(user), closeAnnounce: close}))
}

requestPermission()
createChannel()
createHandler()

module.exports = { createMessage, resolveName, invite, enviaConvite }