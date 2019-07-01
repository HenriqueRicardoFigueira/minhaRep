import React, { Component } from 'react';
import { Alert, View, Platform, Image, FlatList, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion, Button, Body, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.refUsers = firebase.firestore().collection('users');
    this.refRep = firebase.firestore().collection('republics');

    this.state = {
      isloading: true,
      users: [],
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.unsubscribe = this.refRep.doc(user.uid).collection('members').onSnapshot(this.onCollectionUpdate);
  };

  onCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((usr) => {
      const { name, uid} = usr.data();
      users.push({
        key: usr.id,
        name,
        uid
      });
      this.setState({
        users,
        isLoading: false,
      })
    });
  }

  removeMember(item) {
    var user = firebase.auth().currentUser.uid;

    if(user == item.uid) {
      Alert.alert('Impossível sair da própria república.', '')
      return
    }

    this.refRep.doc(user).collection('members').doc(item.uid).delete().catch((error) => {
      console.error("Error deleting user: ", error);
    });
  }

  renderContent = (item) => {
    return (
      <View style={styles.containerList}>
        <Container style={styles.content}>
          <Button style={styles.button} onPress={() => this.removeMember(item)}>
            <Text style={styles.buttonText}> Remover </Text>
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
              <Title style={styles.buttonText}>Membros</Title>
            </Body>
          </Header>

          <Content padder style={styles.content}>
            <Accordion
              dataArray={this.state.users}
              animation={true}
              expanded={true}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
            ></Accordion>

            <Button style={styles.button} onPress={() => this.props.navigation.navigate("MembersAdd")}>
              <Text style={styles.buttonText}> Adicionar Novo </Text>
            </Button>

          </Content>
        </Container>
      </ScrollView>
    );
  }
}

export default withNavigation(MembersList);