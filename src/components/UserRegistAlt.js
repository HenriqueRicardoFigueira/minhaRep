import React, { Component } from 'react';
import { Button, Item, Input, Label } from 'native-base';
import { Text, Image, ScrollView, View } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { nameColor, emailColor, passwordColor, ageColor } from '../formValidation';
import { withNavigation } from 'react-navigation';
import Tags from './tags';
import { EventRegister } from 'react-native-event-listeners'

class UserRegistAlt extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {

      name: '',
      email: '',
      age: null,
      bio: null,
      uid: '',
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381',
      tags: {
        garage: false,
        suits: false,
        pets: false,
        wifi: false,
        party: false
      },
      borderColorAge: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorEmail: '#e6e6e6',
      borderColorPassword: '#e6e6e6',
    };
  };

  componentWillMount() {
    
    var suits = false;
    var garage = false;
    var wifi = false;
    var party = false;
    var pets = false;
    this.listener = EventRegister.addEventListener('changeIcon', (newTags) => {
      console.log(newTags);
      if (newTags == 'suits')
        suits = true;
      else if (newTags == 'nosuits')
        suits = false;
      else if (newTags == 'garage')
        garage = true;
      else if (newTags == 'nogarage')
        garage = false;
      else if (newTags == 'pets')
        pets = true;
      else if (newTags == 'nopets')
        pets = false;
      else if (newTags == 'wifi')
        wifi = true;
      else if (newTags == 'nowifi')
        wifi = false;
      else if (newTags == 'party')
        party = true;
      else if (newTags == 'noparty')
        party = false;

      this.setState({ tags: { suits: suits, garage: garage, pets: pets, wifi: wifi, party: party } })
    })
  }

  componentDidMount = async () => {
    var user = firebase.auth().currentUser;

    await this.ref.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            age: userP.age,
            bio: userP.bio,
            name: userP.name,
            email: userP.email,
            uid: user.uid,
            photoURL: userP.photoURL
          })
        } else {
          console.log("Não existe usuário");
        }
      })
    console.log(this.state.uid)
  }

  registerUser = async () => {
    const { email, age, name, bio, photoURL, tags } = this.state;
    if (!this.canRegister(email, age, name)) {
      return
    }

    // REGISTRA O USUARIO NO AUTHENTICATION
    // RETORNA UM OBJETO DO TIPO user
    const user = await firebase.auth().currentUser;
    this.setState({ isRegistrado: true });

    // REGISTRA OS DADOS DO USUARIO NA DATABASE()
    this.ref.doc(user.uid).set({
      bio: bio,
      email: email,
      uid: user.uid,
      age: age,
      name: name,
      tags: tags,
      photoURL: photoURL,
    }).catch((error) => {
      console.error("Error registering user: ", error);
    });

    // RESETA O .state
    this.setState({
      name: '',
      email: '',
      age: null,
      bio: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381'
    });

    this.props.navigation.navigate("RepCard");
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: this.state.photoURL }} />

          <Text h1>Estamos quase lá {this.state.name}!</Text>
          <Text h1>Só precisamos de mais algumas informações:</Text>
          <Text />

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorAge }}>
            <Label>Digite sua idade:</Label>
            <Input
              value={this.state.age}
              keyboardType='number-pad'
              onChangeText={(age) => this.setState({ age })}
              onEndEditing={() => ageColor.call(this, this.state.age)}
              style={styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorAge }}>
            <Label>Descreva um pouco sobre você:</Label>
            <Input
              value={this.state.bio}
              onChangeText={(bio) => this.setState({ bio })}
              onEndEditing={() => ageColor.call(this, this.state.bio)}
              style={styles.inputStyle}
            ></Input>
          </Item>

          <Tags />

          <Button style={styles.button} onPress={this.registerUser}>
            <Text style={styles.buttonText}> Registrar </Text>
          </Button>

        </View>
      </ScrollView>
    );
  }

  canRegister = (email, age, name) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolAge = ageColor.call(this, age)
    boolName = nameColor.call(this, name)
    boolEmail = emailColor.call(this, email)

    return boolAge && boolName && boolEmail
  }
}

export default withNavigation(UserRegistAlt);