import React, { Component } from 'react';
import { View, Platform, Image, FlatList, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion, Button, Body, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'
const cnlg = require('cnlg')

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.refUsers = firebase.firestore().collection('users');
    this.refRep = firebase.firestore().collection('republics');

    this.state = {
      isLoading: true,
      nameSearch: '',
    };

    this.usersBackup = []
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

        this.usersBackup = users
        this.setState({
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

  searchByName = (nameSearch) => {
    this.users = this.usersBackup.map(item => {
      if(item && item.name.toLowerCase().startsWith(nameSearch.toLowerCase())) {
        return item;
      } else {
        return undefined
      }
    })
  }

  search = () => {
    if (this.state.nameSearch == '')
      return

    this.searchByName(this.state.nameSearch)

    return (
      <ScrollView>
        <Container>
          <Content padder style={styles.content}>
            <Accordion
              dataArray={this.users}
              animation={true}
              expanded={true}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
            ></Accordion>
          </Content>
        </Container>
      </ScrollView>
    )
  }

  render() {
    return (
      <View>
        <Header style={styles.header}>
          <Body style={styles.body}>
            <Title style={styles.buttonText}>Membros</Title>
          </Body>
        </Header>

        <View style={{borderColor: 'gray', borderWidth: 2, borderRadius: 10, padding: 10}}>
          <Input
            value={this.state.nameSearch}
            autoCapitalize={'none'}
            onChangeText={(nameSearch) => this.setState({ nameSearch })}
          />
        </View>

        {this.search()}
      </View>
    );
  }
}

export default withNavigation(MembersList);