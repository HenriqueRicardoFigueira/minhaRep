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

  get ref() { // GET FIREBASE REFERENCE
    return firebase.database()
      .ref(`chats/${this.uid}/XSfhxSVNswMgkrJphNgCGFonnAP2`)
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  refOn = callback => {
    console.log(this);
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }


  parse = snapshot => { // PARSE THE FIREBASE DATA
    const { timestamp: numberStamp, text, user } = snapshot.val();
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
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;