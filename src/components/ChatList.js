import React, { Component } from 'react';
import { View, Platform, Image, FlatList, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion, Button, Body, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'
import firebaseSvc from './FirebaseSvc';

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

    console.log('entrou na did da chatlist')

    var userUid = firebaseSvc.uid;
    console.log(userUid)

    await this.refChats.doc(userUid).get().then(function (doc) { // PEGA OS DADOS DO DOCUMENTO

      console.log('entrou na get do did do chatlist')
      if (doc.exists) {
        console.log("Document data:", doc.data());

        var chats = [];
        doc.data().repIds.forEach(repId => { // PASSA O ARRAY DO BANCO PRO STATE
          chats.push({
            key: repId.id,
            repId
          });
        });
        this.setState({
          chats,
        });
        console.log(this.chats);
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
    console.log(this.state.chats);
    console.log('saiu da did da chatlist')
  };

  componentwillMount() {
  }

  repName = (repId) => {
    this.refRep.doc(repId).get().then(function (doc) { // PEGA OS DADOS DO DOCUMENTO
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data().name; // PASSA O ARRAY DO BANCO PRO STATE
      } else {
        console.log("No such document!");
        return null;
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }

  chatNavigate(item) {
    var userUid = firebaseSvc.uid;
    console.log(item);
    this.props.navigation.navigate("ChatList", { repId: item.repId }); // VAI PARA O CHAT LEVANDO O REP ID
  }

  renderContent = (item) => {
    return (
      <View style={styles.containerList}>
        <Container style={styles.content}>
          <Button style={styles.button} onPress={() => this.chatNavigate(item)}>
            <Text style={styles.buttonText}> Ver </Text>
          </Button>
        </Container>
      </View>
    );
  }

  renderHeader = (item) => {
    return (
      <View style={styles.content}>
        <Text style={styles.listText}>
          {item.name}
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
          <Header style={styles.header}>
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