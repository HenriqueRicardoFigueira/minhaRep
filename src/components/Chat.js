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

    this.state = {
      toUid: 'XSfhxSVNswMgkrJphNgCGFonnAP2', // PARA FINS DE TESTE
      messages: [],
    };

  };

  get user() {
    return {
      name: 'jao',
      email: 'jvzavatin004@gmail.com',
      avatar: '',
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
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

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.user}
      />
    );
  }

}

export default withNavigation(Chat);