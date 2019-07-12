import React, { Component } from 'react';
import { Alert, TextInput, View, Platform, Image, FlatList, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion, Button, Body, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'
const cnlg = require('cnlg')
import { enviaConvite } from './message'

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
    var uid = firebase.auth().currentUser.uid;
    var repId = item.uid

    if(repId == uid) {
      alert('Impossível enviar convite para si mesmo.')
    } else {
      Alert.alert(
        'Deseja enviar um convite para ' + await resolveName(repId),
        '',
        [
          { text: 'NÃO' },
          { text: 'SIM', onPress: async () => {
              await enviaConvite(uid, repId, false)
              //alert('Convite enviado')
            }
          }
        ]
      )
    }
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
    if(!item) {
      return null
    }

    return (
      <View style={styles.content}>
        <Text style={styles.listText}>
          {item.name}
        </Text>
      </View>
    );
  }

// deixa tudo minúsculo
  // remove ~ ´ ^ ç
  formatName = (name) => {
    return name.toLowerCase()
      .replace('ã', 'a')
      .replace('á', 'a')
      .replace('â', 'a')
      .replace('é', 'e')
      .replace('ê', 'e')
      .replace('í', 'i')
      .replace('õ', 'o')
      .replace('ô', 'o')
      .replace('ç', 'c')
  }

  searchByName = (nameSearch) => {
    this.users = this.usersBackup.map(item => {
      if(item && this.formatName(item.name).startsWith(this.formatName(nameSearch))) {
        return item;
      } else {
        return undefined
      }
    })
  }

  search = () => {
    if (this.state.nameSearch == '')
      return ( <View style={{backgroundColor: '#eff7f9'}} />)

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

        <TextInput
          style={{height: styles.screen.height*0.08, borderColor: 'gray', borderWidth: 2, borderRadius: 10}}
          value={this.state.nameSearch}
          autoCapitalize={'none'}
          placeholder={'Digite um nome'}
          onChangeText={(nameSearch) => this.setState({ nameSearch })}
        />

        {this.search()}
      </View>
    );
  }
}

export default withNavigation(MembersList);