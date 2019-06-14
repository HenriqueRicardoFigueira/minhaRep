const functions = require('firebase-functions')
const admin     = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.sendPushNotification = functions.firestore.document('chats/{userId}/{repId}/{messageId}').onCreate(event => {
  const path = event._ref._path
  const userId = path.segments[1]
  const repId = path.segments[2]
  const messageId = path.segments[3]
  const message = event._fieldsProto.text.stringValue
  const userName = 'nome meu' //event._fieldsProto.user
  console.log('userId: ' + userId)
  console.log('repId: ' + repId)
  console.log('messageId: ' + messageId)
  console.log('message: ' + message)
  console.log(event._fieldsProto.user.mapValue.fields.name.stringValue)

    //get the token of the user receiving the message
      return admin.database().ref("users/" + repId).once('value').then(snap => {
        const token = 'fQN4pyurt1g:APA91bHuembfw3JvtKb-Sa7TBcCH32XrS_GwNnvn9K3dcJ9SdbEYou1n7erkTKdl8K6x2q_wBIFd3V7lI4qDD4uLqpUOAQkAznY6ZOx4c1Vl73sJG60wHisTvZb-loo5nM_R7L3vCoUt'
        //const token = snap.child("token").val();
        console.log("token: ", token);

        //we have everything we need
        //Build the message payload and send the message
        console.log("Construction the notification message.");
        const payload = {
          data: {
            data_type: "direct_message",
            //title: "New Message from " + senderName,
            title: "Mensagem: " + userName,
            message: message,
            message_id: messageId,
          }
        };

        return admin.messaging().sendToDevice(token, payload)
          .then(function(response) {
              console.log("Mensagem enviada com sucesso:", response);
            })
            .catch(function(error) {
              console.log("Erro ao enviar mensagem:", error);
            });
    });
});