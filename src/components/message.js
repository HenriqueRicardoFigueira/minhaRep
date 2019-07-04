import firebaseSvc from './FirebaseSvc'
import { firebase } from '../../Firebase'

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

module.exports = { createMessage, resolveName }