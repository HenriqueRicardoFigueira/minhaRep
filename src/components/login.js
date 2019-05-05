import React, { Component } from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Item, Input, Label } from 'native-base';
import FacebookLogin from './facebookLogin';
import GoogleLogin from './googleLogin';

import { withNavigation } from 'react-navigation';

// import { Container } from './styles';
import firebase from 'react-native-firebase';

import { styles } from './styles';

class Login extends Component {
  state = {
    email: '',
    password: '',
    canLogin: false,
    isAuthenticated: false,
    borderColorEmail: '#e6e6e6',
    borderColorPassword: '#e6e6e6'
  };

  login = (email, password) => {
    //const { email , password } = this.state;

    // verifica se os campos email e password estão certos
    // se não, altera suas bordas
    /*this.canLogin(email, password);

    // se alguns dos campos não está no padrão, então não prossegue para o login
    if (!this.state.canLogin) {
      return;
    }*/

    try {
      const user = firebase.auth().signInWithEmailAndPassword(email, password);
      this.setState({ isAuthenticated: true });
      console.log(email, password);
      this.props.navigation.navigate("Home");
    } catch (err) {
      console.log(err);
    }
  }

  userRegist = async () => {
    this.props.navigation.navigate("UserRegist");
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../image/logo2.png')} />

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite seu email:</Label>
          <Input
            value={this.state.email}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({ email })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite sua senha:</Label>
          <Input
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={() => this.login(this.state.email, this.state.password)}>
          <Text style={styles.buttonText}>Logar</Text>
        </Button>

        <TouchableOpacity style={styles.registerButton} onPress={this.userRegist}>
          <Text style={styles.registerText}>Registrar</Text>
        </TouchableOpacity>

        <View style={styles.loginView}>
          <FacebookLogin style={styles.loginButtons} />
          <GoogleLogin style={styles.loginButtons} />
        </View>

        {this.state.isAuthenticated ? <Text>Logado com sucesso</Text> : <Text />}
      </View>
    );
  }

  // utilizando um regex, verifica o email
  emailColor = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(String(email).toLowerCase())) {
      return '#e6e6e6';
    } else {
      return '#ff0000';
    }
  }

  // apenas verifica se a variável está sem valor
  // se estiver, altera a cor da borda do input
  passwordColor = (password) => {
    if (password.length > 4) {
      return '#e6e6e6';
    } else {
      return '#ff0000';
    }
  }

  canLogin = (email, password) => {

    borderColorEmail = this.emailColor(email);
    borderColorPassword = this.passwordColor(password);

    // os dois são iguais? ou seja, se forem diferente já retorna false
    // se os dois forem iguais e o email, por exemplo, for #e6e6e6, então os dois estão certos
    var equals = borderColorEmail == borderColorPassword;
    var canLogin = equals && borderColorEmail == '#e6e6e6';

    this.setState({
      borderColorEmail: borderColorEmail,
      borderColorPassword: borderColorPassword,
      canLogin: canLogin
    });;
  };
}

export default withNavigation(Login);
