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
      messages: [],

      repId: '',
      name: '',
      photoURL: '',

      isLoaded: false,
    };

  };

  get user() {
    return {
      _id: firebaseSvc.uid,
      name: this.state.name,
      avatar: this.state.photoURL,
    };
  }

  get refFirestore() { // REF DA FIRESTORE
    return firebase.firestore()
      .collection('chats')
      .doc(firebaseSvc.uid)
      .collection(this.state.repId)
  }

  componentDidMount = async () => {
    if (!this.isLoaded) {

      var repId = this.props.navigation.getParam('repId', 'Default');
      this.setState({
        repId: repId,
      })
      this.ref = this.refFirestore;

      var userUid = firebaseSvc.uid;
      await this.refUsers //PUXA OS DADOS DO USUÁRIO
        .doc(userUid)
        .get()
        .then((userData) => {
          if (userData.exists) {
            const userP = userData.data();
            this.setState({
              name: userP.name,
              photoURL: userP.photoURL,
            })
          } else {
            console.log("Não existe usuário");
          }
        })

      this.refOn(message => // PEGAS AS MSGS DA CONVERSA ANTERIOR
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      );
      this.setState(this.state);
      this.isLoaded = true
    }
  }

  componentWillMount = () => {
    this.setState(this.state);
  }

  refOn = async () => {
    var messages = [];
    await this.refFirestore
      .limit(20)
      .onSnapshot(function (querySnapshot) { // PUXA AS MENSAGENS DO BANCO E COLOCAM EM UM ARRAY 
        querySnapshot.forEach(function (doc) {
          console.log('DATA FROM SNAPSHOT', doc);
          const { createdAt, text, user } = doc.data();
          const timestamp = new Date(createdAt);

          const message = {
            _id: doc.id,
            text,
            createdAt: timestamp,
            user,
          };
          messages.push(message);
          console.log('MESSAGES ARRAY', messages);
        });
      });

    console.log('SETSTATE ANTES', this.state.messages);
    this.setState({ // COLOCA O ARRAY EM STATE
      messages,
    })
    this.setState(this.state);
    console.log('SETSTATE DEPOIS', this.state.messages);
  }

  send = messages => { // MANDA AS MENSAGES
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: firebaseSvc.timestamp,
      };
      console.log('SEND FUNC, MESSAGE: ', message)
      this.refFirestore.add(message);
    };
    this.setState(this.state);
  };

  onSend(messages = []) { // ATUALIZA A API
    var arr = this.state.messages.shift();
    this.setState({
      messages: arr,
    })
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    console.log('ONSEND METHOD MESSAGES depois: ', messages)
    this.setState(this.state)
  }

  render() {
    console.log('Mensagens na render()', this.state.messages);
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          isAnimated={true}
          onSend={this.send}
          user={this.user}
        />
      </View>

    );
  }

}

export default withNavigation(Chat);