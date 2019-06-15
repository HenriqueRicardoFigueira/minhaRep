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
    this.refRep = firebase.firestore().collection('republics');
  }

  get uid() { // GET USER UID
    return (firebase.auth().currentUser || {}).uid;
  }

  get email() { // GET USER EMAIL
    return (firebase.auth().currentUser || {}).email;
  }

  get timestamp() {
    return new Date().getTime();
  }

}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;