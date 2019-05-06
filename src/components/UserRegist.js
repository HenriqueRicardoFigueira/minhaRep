import React, { Component } from 'react';
import { Button, Item, Input, Label } from 'native-base';
import { View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from './styles';

import { withNavigation } from 'react-navigation';

/*
    Fields from User Register :
    name
    email
    password
    age
*/

class UserRegist extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {
      name: '',
      email: '',
      password: '',
      age: '',
      bio: '',
      uid: '',
      borderColorAge: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorEmail: '#e6e6e6',
      borderColorPassword: '#e6e6e6',
    };
  };

  registerUser = async () => {
    const { email, age, name, password } = this.state;
    if(!this.canRegister(email, age, name, password)) {
      return
    }

    //try {
    // REGISTRA O USUARIO NO AUTHENTICATION
    // RETORNA UM OBJETO DO TIPO user
    const usr = await firebase.auth().createUserWithEmailAndPassword(email, password);
    this.setState({ isRegistrado: true });

    // REGISTRA OS DADOS DO USUARIO NA DATABASE()
    this.ref.doc(usr.user.uid).set({
      bio: 'Conte um pouco sobre você',
      email: email,
      uid: usr.user.uid,
      age: age,
      name: name,
      imgUrl: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381'
    }).catch((error) => {
      console.error("Error registering user: ", error);
    });

    // RESETA O .state
    this.setState({
      name: '',
      email: '',
      password: '',
      age: '',
      bio: '',
      isSubmited: true,
    });

    this.props.navigation.navigate("Home");
  }

  /*
  Fields from User Register :
  name
  email
  password
  age
  bio
  tag: null
  */

  render() {
    return (
      <View style={styles.container}>

        <Text h1>Tela de registro </Text>

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorName }}>
          <Label>Digite seu nome:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            onEndEditing={() => this.nameColor(this.state.name)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorEmail }}>
          <Label>Digite seu email:</Label>
          <Input
            value={this.state.email}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({ email })}
            onEndEditing={() => this.emailColor(this.state.email)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorPassword }}>
          <Label>Digite sua senha:</Label>
          <Input
            value={this.state.password}
            secureTextEntry={true}
            autoCapitalize={'none'}
            onChangeText={(password) => this.setState({ password })}
            onEndEditing={() => this.passwordColor(this.state.password)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
        style={{ borderColor: this.state.borderColorAge }}>
          <Label>Digite sua idade:</Label>
          <Input
            value={this.state.age}
            keyboardType='number-pad'
            onChangeText={(age) => this.setState({ age })}
            onEndEditing={() => this.ageColor(this.state.age)}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={this.registerUser}>
          <Text style={styles.buttonText}> Registrar </Text>
        </Button>

      </View>
    );
  }

  color = (field, regex) => {
    var newColor = null
    if (regex.test(String(field).toLowerCase())) {
      newColor = '#e6e6e6'
    } else {
      newColor = '#ff0000'
    }

    return newColor
  }

  nameColor = (name) => {
    newColor = this.color(name, /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-]{0,19}$/)

    this.setState({
      borderColorName: newColor,
    })

    return newColor == '#e6e6e6'
  }

  emailColor = (email) => {
    newColor = this.color(email, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    this.setState({
      borderColorEmail: newColor,
    })

    return newColor == '#e6e6e6'
  }

  passwordColor = (password) => {
    newColor = this.color(password, /^([a-zA-Z0-9@*#]{4,15})$/)

    this.setState({
      borderColorPassword: newColor,
    })

    return newColor == '#e6e6e6'
  }

  ageColor = (age) => {
    newColor = this.color(age, /^[0-9][0-9]$/)

    this.setState({
      borderColorAge: newColor
    })

    return newColor == '#e6e6e6'
  }

  canRegister = (email, age, name, password) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolAge = this.ageColor(age)
    boolName = this.nameColor(name)
    boolEmail = this.emailColor(email)
    boolPassword = this.passwordColor(password)

    return boolAge && boolName && boolEmail && boolPassword
  }
}

export default withNavigation(UserRegist);