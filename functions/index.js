const functions = require('firebase-functions')
const admin     = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.sendPushNotification = functions.firestore.document('chats/{userId}/{repId}/{messageId}').onCreate(event => {
  const path = event._ref._path
  const userId = path.segments[1]
  const repId = path.segments[2]
  const messageId = path.segments[3]
  const message = event._fieldsProto.text.stringValue
  const userName = event._fieldsProto.user.mapValue.fields.name.stringValue
  var invite = false
  var closeAnnounce = false

  if(event._fieldsProto.data && event._fieldsProto.data.mapValue.fields.exists.booleanValue) {
    invite = event._fieldsProto.data.mapValue.fields.invite.booleanValue
    closeAnnounce = event._fieldsProto.data.mapValue.fields.closeAnnounce.booleanValue
  }

  //get the token of the user receiving the message
  return admin.firestore().collection('users').doc(repId).get().then(snapshot => {
    const token = snapshot._fieldsProto.token.stringValue
    const payload = {
          notification: {
            title: "Mensagem de " + userName,
            body: message
          },
          data: {
            invite: invite.toString(),
            user: userName,
            closeAnnounce: closeAnnounce.toString(),
            userId: userId
          }
        }

    return admin.messaging().sendToDevice(token, payload)
        .then(function(response) {
            console.log("Mensagem enviada com sucesso:", response);
          })
          .catch(function(error) {
            console.log("Erro ao enviar mensagem:", error);
          });
  })
});