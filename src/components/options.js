import React, { Component } from 'react';
import { Button, Text, List, ListItem, Left, Right, Body, Container } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'
import { styles } from './styles';

class Options extends Component {
  constructor(props) {
    super(props);
    this.buttonWidth = styles.screen.width * 0.92;
    this.buttonHeight = styles.screen.height * 0.05;
    this.iconSize = styles.screen.width * 0.05
    this.ref = firebase.firestore().collection('users');
    this.state = {
      name: '', //EDITAVEL
      uid: '', //PK

      avatarSource: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381',
      gotUrl: false,
      uri: '',
    }
  }
  componentDidMount = async () => {
    var user = firebase.auth().currentUser;

    await this.ref.doc(user.uid) 
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            uid: user.uid,
            photoURL: userP.photoURL,
          })
        } else {
          console.log("Não existe usuário");
        }
      })
      
  }
  logout = () => {
    let isLogged = true;
    Alert.alert(
      "Logout!",
      "Tem certeza que deseja sair?",
      [
        {
        text: "Cancelar",
        onPress: ()=> console.log("cancelado")
        },
        { text: "Sim", onPress: async() => {
            await firebase.auth().signOut().then(function () {
              console.log("deslogado");
              isLogged = false
            }).catch(function (error) {
              console.log(error);
            });
            if (isLogged == false) {
              this.props.navigation.navigate("Login");
            }
          }

        }
      ],
      { cancelable: false },
    )
  }

  render() {
    return (
      <ScrollView>
        <Image alignSelf='center' style={{ width: 100, height: 100, borderRadius: 100, marginTop: styles.screen.width * 0.05 }} source={{ uri: this.state.photoURL }}></Image>
        <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, alignSelf: "center" }}>
          <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>{this.state.name}</Text>
        </Container>
        <ListItem button >
          <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={() => this.props.navigation.navigate('UserProfile')}>
            <Left>
              <Icon active name="account-edit" size={this.iconSize}></Icon>
            </Left>
            <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
              <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>Editar perfil</Text>
            </Container>
            <Right>
              <Icon active name="chevron-right" size={this.iconSize * 0.6} />
            </Right>
          </Button>
        </ListItem>
        <ListItem button >
          <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={() => this.props.navigation.navigate('RepForm')}>
            <Left>
              <Icon active name="home-account" size={this.iconSize}></Icon>
            </Left>
            <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
              <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>Adicionar república</Text>
            </Container>
            <Right>
              <Icon active name="chevron-right" size={this.iconSize * 0.6} />
            </Right>
          </Button>
        </ListItem>
        <ListItem button>
          <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={() => this.props.navigation.navigate('RepCRUD')}>
            <Left>
              <Icon active name="pencil" size={this.iconSize}></Icon>
            </Left>
            <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
              <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>Editar república</Text>
            </Container>
            <Right>
              <Icon active name="chevron-right" size={this.iconSize * 0.6} />
            </Right>
          </Button>
        </ListItem>
        <ListItem button>
          <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={() => this.props.navigation.navigate('Anuncio')}>
            <Left>
              <Icon active name="bullhorn" size={this.iconSize}></Icon>
            </Left>
            <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
              <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>Criar anúncio</Text>
            </Container>
            <Right>
              <Icon active name="chevron-right" size={this.iconSize * 0.6} />
            </Right>
          </Button>
        </ListItem>
        <ListItem button>
          <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={() => this.logout()}>
            <Left>
              <Icon active name="power" size={this.iconSize}></Icon>
            </Left>
            <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
              <Text style={{ color: '#6F6F6F', alignSelf: "center" }}>Logout</Text>
            </Container>
            <Right>
              <Icon active name="chevron-right" size={this.iconSize * 0.6} />
            </Right>
          </Button>
        </ListItem>

      </ScrollView>
    );
  }
}
export default withNavigation(Options)
