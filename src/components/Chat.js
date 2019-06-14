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

      name: '',
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
      .doc(firebaseSvc.uid)
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
  }

  refOn() {
    var messages = [];
    console.log('entro no refOn')
    if (this.refFirestore) {
      this.refFirestore
        .limit(20)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log('DATA FROM SNAPSHOT', doc.data());
            const { createdAt, text, user } = doc.data();
            const { key: id } = doc.data().user._id;
            const { key: _id } = doc.data().user._id; //needed for giftedchat
            const timestamp = new Date(createdAt);

            const message = {
              id,
              _id,
              timestamp,
              text,
              user,
            };
            messages.push(message)
            console.log('MESSAGE SNAPSHOT', message);
          });
        });
        this.setState({
          messages,
        })
    } else {
      alert('No data')
    }
  }

  /*
    parse = doc => { // PARSE THE FIREBASE DATA
      console.log('DATA FROM SNAPSHOT', doc.data());
      const { timestamp: numberStamp, text, user } = doc.data();
      const { key: id } = doc;
      const { key: _id } = doc; //needed for giftedchat
      const timestamp = new Date(numberStamp);
  
      const message = {
        id,
        _id,
        timestamp,
        text,
        user,
      };
      console.log('MESSAGE SNAPSHOT', message);
      return message;
    };
  */

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: firebaseSvc.timestamp,
      };
      this.refFirestore.add(message);
    }
  };

  onSend(messages = []) {
    console.log('ONSEND METHOD MESSAGES antes: ', messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    console.log('ONSEND METHOD MESSAGES depois: ', messages)
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