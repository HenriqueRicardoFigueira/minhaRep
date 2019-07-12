import React, { Component } from 'react';
import { Container, Button, Item, Input, Label } from 'native-base';
import { Alert, View, Text, ScrollView } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { nameColor, emailColor, passwordColor, ageColor } from '../formValidation';
import { withNavigation } from 'react-navigation';
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from './FirebaseSvc'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { resolveName, enviaConvite, isAdd } from './message'


class Chat extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('chats'); // COLEÇÃO DE DESTINO DAS CONVERSAS
    this.refUsers = firebase.firestore().collection('users'); // COLEÇÃO DOS USERS
    var repId = props.navigation.getParam('repId', 'Default');

    this.state = {
      messages: [],

      repId: repId,
      name: '',
      photoURL: '',

      isLoaded: false,
    };

    this.plus = false
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

    this.canAdd()
  }

  componentWillMount = () => {
    //this.setState(this.state);
  }

  refOn = async () => {
    var messages = [];
    await this.refFirestore
      .limit(20)
      .orderBy('createdAt')
      .onSnapshot(function (querySnapshot) { // PUXA AS MENSAGENS DO BANCO E COLOCAM EM UM ARRAY 
        querySnapshot.forEach(function (doc) {
          const { createdAt, text, user } = doc.data();
          const timestamp = new Date(createdAt);

          const message = {
            _id: doc.id,
            text,
            createdAt: timestamp,
            user,
          };
          messages.push(message);
        });
      });

    this.setState({ // COLOCA O ARRAY EM STATE
      messages,
    })
  }

  send = messages => { // MANDA AS MENSAGES
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const timestamp = firebaseSvc.timestamp;
      const message = {
        text,
        user,
        createdAt: timestamp
      };

      //this.refFirestore.doc(timestamp).set(message);
      this.refFirestore.add(message);

    };
  };

  onSend(messages = []) { // ATUALIZA A API
    var arr = this.state.messages.shift();
    this.setState({
      messages: arr,
    })
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }


  remove = async () => {
    user = firebase.auth().currentUser.uid

    await firebase.firestore().collection('republics').doc(user).get()
      .then(async (data) => {

        data = data.data()
        firebase.firestore().collection('republics').doc(user).update({
          // apenas estes dois campos são atualizados
          vacancies: data.vacancies-1 > 0 ? data.vacancies-1 : 0,
          isAnnounced: data.vacancies-1 > 0 ? data.isAnnounced : false,
          bathroom: data.bathroom,
          bed: data.bed,
          name: data.name,
          bio: data.bio,
          numberHome: data.numberHome,
          street: data.street,
          cep: data.cep,
          city: data.city,
          uf: data.uf,
          latitude: data.latitude,
          longitude: data.longitude,
          tags: data.tags,
          admUID: data.admUID,
          photoURL: this.state.photoURL.length ? this.state.photoURL : data.photoURL,
          gotUrl: data.gotUrl,
          value: data.value
        })

        if(data.vacancies-1 == 0) {
          Alert.alert('O anuncio foi fechado pois todas as vagas foram preenchidas', '')
        }
      })
  }

  confirmRemoveVacancies = async () => {
    user = firebase.auth().currentUser.uid
    repId = this.state.repId

    Alert.alert(
      'Deseja remover uma vaga do anuncio?',
      'Somente se o usuário aceitar.',
      [
        { text: 'NÃO', style: 'cancel', onPress: async () => await enviaConvite(user, repId, false, true) },
        { text: 'SIM', onPress: async () => await enviaConvite(user, repId, true, true) }
      ]
    )
  }

  add = async () => {
    user = firebase.auth().currentUser.uid
    isInRep = false

    // verifica se user já foi adicionado
    await firebase.firestore().collection('users').doc(this.state.repId).get()
      .then(async (data) => {

        nameUser = data.data().name
        isInRep = await isAdd(user, this.state.repId)
        if(isInRep) {
          Alert.alert('Usuário já cadastrado na república', '')
          return
        }
      })

    if(!isInRep)
      this.confirmRemoveVacancies()
  }

  confirmAdd = async () => {
    Alert.alert(
      'Deseja enviar um convite ao usuário?',
      await resolveName(this.state.repId),
      [
        { text: 'NAO', style: 'cancel' },
        { text: 'SIM', onPress: () => this.add() }
      ]
    )
  }

  // só quem recebeu o match que pode adicionar o outro
  canAdd = async () => {
    user = firebase.auth().currentUser.uid
    resp = false

    await firebase.firestore().collection('chats/' + this.state.repId + '/' + user).doc('minicial')
      .get()
      .then((data) => {
        if(data.exists)
          resp = true
      })

    this.plus = resp
    this.forceUpdate()
  }

  getPlus = () => {
    if(this.plus) {
      return (
        <View style={{paddingTop: styles.screen.height*0.01, paddingLeft: styles.screen.width*0.85}}>
          <FontAwesome name='user-plus' size={35} color='#c6dcf4' onPress={() => this.confirmAdd()} />
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.getPlus()}
        <GiftedChat
          messages={this.state.messages}
          isAnimated={true}
          onSend={this.send}
          user={this.user}
          inverted={false}
        />
      </View>
    );
  }

}

export default withNavigation(Chat);