import React, { Component } from 'react';
import { Alert, View, Platform, Image, FlatList, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion, Button, Body, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'
import firebaseSvc from './FirebaseSvc';
import { resolveName } from './message'

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp*/) {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

class ChatList extends Component {
  constructor(props) {
    super(props);

    this.refUsers = firebase.firestore().collection('users');
    this.refRep = firebase.firestore().collection('republics');
    this.refChats = firebase.firestore().collection('chats');

    this.state = {
      isloading: true,
      chats: [],
    };
  }

  componentDidMount = async () => {
    var chats = [];
    var userUid = firebaseSvc.uid;

    await this.refChats.doc(userUid).get().then(function (doc) { // PEGA OS DADOS DO DOCUMENTO
      if (doc.exists) {
        doc.data().repIds.forEach(async repId => { // PASSA O ARRAY DO BANCO PRO STATE
          chats.push({
            repId,
            repName: await resolveName(repId)
          });
        });
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    this.setState({
      chats,
    });
  };

  componentwillMount() {
  }

  chatNavigate(item) {
    this.props.navigation.navigate("Chat", { repId: item.repId }); // VAI PARA O CHAT LEVANDO O REP ID
  }

  exclude = async (otherUser) => {
    var user = firebase.auth().currentUser.uid
    docs = await firebase.firestore().collection('chats/' + user + '/' + otherUser).get()

    // exclude doc
    docs = docs.docs
    for(var key in docs) {
      await firebase.firestore().collection('chats/' + user + '/' + otherUser).doc(docs[key].id).delete()
    }

    // exclude from repIds
    await firebase.firestore().collection('chats').doc(user)
      .get()
      .then(data => {

        repIds = data._data.repIds
        for(var i = 0; i < repIds.length; i ++) {
          if(repIds[i] == otherUser) {
            repIds.splice(i, 1)
            break
          }
        }

        firebase.firestore().collection('chats').doc(user).update({repIds})
      })

    var i
    var chats = this.state.chats
    for(i = 0; i < chats.length; i ++) {
      if(chats[i].repId == otherUser) {
        break
      }
    }

    chats.splice(i, 1)
    this.setState({chats,})
  }

  confirmExclude = async (item) => {
    otherUser = item.repId

    Alert.alert(
      'Deseja apagar a conversa com ' + await resolveName(otherUser) + ' ?',
      '',
      [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'OK', onPress: () => this.exclude(otherUser) }
      ]
    )
  }

  renderContent = (item) => {
    // diminuindo o botao
    var style = Object.assign({}, styles.button)
    style.width = styles.screen.width*0.4

    return (
      <View style={styles.containerList}>
        <Container style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eff7f9'}}>
          <Button style={style} onPress={() => this.chatNavigate(item)}>
            <Text style={styles.buttonText}> Ver </Text>
          </Button>

          <Button style={style} onPress={() => this.confirmExclude(item)}>
            <Text style={styles.buttonText}> Excluir </Text>
          </Button>
        </Container>
      </View>
    );
  }

  renderHeader = (item) => {
    return (
      <View style={styles.content}>
        <Text style={styles.listText}>
          {item.repName}
        </Text>
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <ScrollView>
        <Container>
          <Header style={styles.header} androidStatusBarColor='#b1cff0'>
            <Body style={styles.body}>
              <Title style={styles.buttonText}>Conversas</Title>
            </Body>
          </Header>

          <Content padder style={styles.content}>
            <Accordion
              dataArray={this.state.chats}
              animation={true}
              expanded={true}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
            ></Accordion>

          </Content>
        </Container>
      </ScrollView>
    );
  }
}

export default withNavigation(ChatList);