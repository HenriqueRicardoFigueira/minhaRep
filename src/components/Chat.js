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
    this.refUsers = firebase.firestore().collection('users'); // COLEÇÃO DOS USERS

    this.state = {
      repId: '', // PARA FINS DE TESTE
      messages: [],

      name:'',
      photoURL: '',
      email: '',
    };

  };

  get user() {
    return {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.photoURL,
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }

  get refFirestore() {
    return firebase.firestore()
      .collection('chats')
      .doc(this.uid)
      .collection(this.state.repId)
  }

  componentDidMount = async () => {
    var repId = this.props.navigation.getParam('repId', 'Default');
    this.setState({
      repId: repId,
    })
    this.ref = this.refFirestore;

    var userUid = firebaseSvc.uid;
    await this.refUsers
      .doc(userUid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            email: userP.email,
            photoURL: userP.photoURL,
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

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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