import React, { Component } from 'react';
import { View, Platform, Image, FlatList, ScrollView } from 'react-native';
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
      users: [],
      isLoading: true
    };
  }
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
    this.unsubscribe = this.refUsers.onSnapshot(this.onCollectionUpdate);
  };
  componentWillUnmount = () => {
    this._isMounted = false;
  }

  onCollectionUpdate = (querySnapshot) => {
    if (this._isMounted) {
      const users = [];
      querySnapshot.forEach(async (usr) => {
        const { name, uid } = usr.data();
        await users.push({
          key: usr.id,
          name,
          uid
        })
      });
      if (this._isMounted) {
        this.setState({
          users,
          isLoading: false
        })
      }
    }
  }

  addMember = async (item) => {
    var user = firebase.auth().currentUser;

    this.refRep.doc(user.uid).collection('members').doc(item.uid).set({
      uid: item.uid,
      name: item.name,
    }).catch((error) => {
      console.error("Error addding user: ", error);
    })
  }

  renderContent = (item) => {
    return (
      <View style={styles.containerList}>
        <Container style={styles.content}>
          <Button style={styles.button} onPress={() => this.addMember(item)}>
            <Text style={styles.buttonText}> Adicionar </Text>
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
          <Text />
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
          </Content>
        </Container>
      </ScrollView>
    );
  }
}

export default withNavigation(MembersList);