import Firebase from 'react-native-firebase';

let config = {
    apiKey: " AIzaSyA_zdS-vlFbRsYiXFBGjBvTmJ-EMjPp_uQ",
    authDomain: "minharep-6c7ba.firebaseapp.com",
    databaseURL: "https://minharep-6c7ba.firebaseio.com",
    storageBucket: "minharep-6c7ba.appspot.com",
    messagingSenderId: "299714124161"
}
export const firebase = Firebase.initializeApp(config);