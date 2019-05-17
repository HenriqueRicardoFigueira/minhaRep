import React, { Component } from 'react';
import { Button, Item, Input, Label, Image } from 'native-base';
import { View, Text } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { nameColor, emailColor, passwordColor, ageColor } from '../formValidation';
import { withNavigation } from 'react-navigation';

class UserRegistAlt extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {

      name: '',
      email: '',
      age: '',
      bio: '',
      uid: '',
      photoURL: '',

      borderColorAge: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorEmail: '#e6e6e6',
      borderColorPassword: '#e6e6e6',
    };
  };

  componentDidMount = async () => {
    var user = firebase.auth().currentUser;

    await this.ref.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
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
    const { email, age, name, bio, photoURL } = this.state;
    if (!this.canRegister(email, age, name, password)) {
      return
    }

    // REGISTRA O USUARIO NO AUTHENTICATION
    // RETORNA UM OBJETO DO TIPO user
    const usr = await firebase.auth().createUserWithEmailAndPassword(email, password);
    this.setState({ isRegistrado: true });

    // REGISTRA OS DADOS DO USUARIO NA DATABASE()
    this.ref.doc(usr.user.uid).set({
      bio: bio,
      email: email,
      uid: usr.user.uid,
      age: age,
      name: name,
      photoURL: photoURL,
    }).catch((error) => {
      console.error("Error registering user: ", error);
    });

    // RESETA O .state
    this.setState({
      name: '',
      email: '',
      age: '',
      bio: '',
      photoURL: '',
    });

    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <View style={styles.container}>

        <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: this.state.photoURL }} 
        />

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
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorAge }}>
          <Label>Descreva um pouco sobre você:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
            onEndEditing={() => ageColor.call(this, this.state.bio)}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={this.registerUser}>
          <Text style={styles.buttonText}> Registrar </Text>
        </Button>

      </View>
    );
  }

  canRegister = (email, age, name, password) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolAge = ageColor.call(this, age)
    boolName = nameColor.call(this, name)
    boolEmail = emailColor.call(this, email)
    boolPassword = passwordColor.call(this, password)

    return boolAge && boolName && boolEmail && boolPassword
  }
}

export default withNavigation(UserRegistAlt);