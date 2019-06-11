import { firebase } from '../../Firebase'

const config = {
  apiKey: " AIzaSyA_zdS-vlFbRsYiXFBGjBvTmJ-EMjPp_uQ",
  authDomain: "minharep-6c7ba.firebaseapp.com",
  databaseURL: "https://minharep-6c7ba.firebaseio.com",
  storageBucket: "minharep-6c7ba.appspot.com",
  messagingSenderId: "299714124161"
}

class FirebaseSvc {
  constructor() {
  }

  get uid() { // GET USER UID
    return (firebase.auth().currentUser || {}).uid;
  }

  get refFirebase() { // GET FIREBASE REFERENCE
    return firebase.database()
      .ref(`chats/${this.uid}/XSfhxSVNswMgkrJphNgCGFonnAP2`)
  }

  get refFirestore() {
    return firebase.firestore()
      .collection('chats')
      .doc(this.uid)
      .collection('XSfhxSVNswMgkrJphNgCGFonnAP2')
  }

  get timestamp() {
    return new Date().getTime();
  }

  refOn = callback => {
    if (this.refFirestore) {
      this.refFirestore
        .limit(20)
        .onSnapshot(snapshot => callback(this.parse(snapshot)));
    } else {
      alert('No data')
    }
  }


  parse = snapshot => { // PARSE THE FIREBASE DATA
    const { timestamp: numberStamp, text, user } = snapshot.data();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.refFirestore.add(message);
    }
  };

}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;