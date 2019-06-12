import React, { Component } from 'react';
import { Container, Button, Item, Input, Label } from 'native-base';
import { View, Text, ScrollView } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { nameColor, emailColor, passwordColor, ageColor } from '../formValidation';
import { withNavigation } from 'react-navigation';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from './FirebaseSvc'

class Chat extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('chats'); // COLEÇÃO DE DESTINO DAS CONVERSAS
    this.refUsers = firebase.firestore().collection('users');

    this.state = {
      messages: [],

      name: '',
      email: '',
      uid: '',
      repId: '',
      photoURL: '',
      gotUrl: false,
    };

  };

  getUrl = async () => {
    const imageName = this.state.uid;
    const imageRef = firebase.storage().ref('userImages');
    await imageRef.child(imageName).getDownloadURL().then((url) => {
      this.setState({ photoURL: url, gotUrl: true })
    }).catch((error) => {
      reject(error)
    });
    this.editUser();
    console.log(this.state.photoURL)
  }

  get user() {
    this.getUrl();
    if (this.state.gotUrl) {
      return {
        name: this.state.name,
        email: user.email,
        avatar: '',
        id: firebaseSvc.uid,
        _id: firebaseSvc.uid, // need for gifted-chat
      };
    }
  }

  refOn = callback => {
    this.unsubscribe = this.ref
      .onSnapshot(snapshot => callback(this.parse(snapshot)));
  }


  parse = snapshot => { // PARSE THE FIREBASE DATA
    console.log(snapshot);
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
    for (var i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.add(message);
    }
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  componentDidMount = async () => {
    var repId = this.props.navigation.getParam(repId, 'noValue'); // PEGA O REPID DO NAVIGATION
    var user = firebase.auth().currentUser; // PEGA O USUÁRIO
    this.ref = firebase.firestore().collection('chats').doc(user.uid).collection(repId);

    await this.refUsers.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            email: userP.email,
            uid: user.uid,
            repId: repId,
          })
        } else {
          console.log("Não existe usuário");
        }
      })
    this.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
    console.log(firebaseSvc.uid);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
      />
    );
  }

}

export default withNavigation(Chat);