import React, { Component } from 'react';
import { Alert } from 'react-native';

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
    isAuthenticated: false,
    disableLoginButton: false,
    borderColorEmail: '#e6e6e6',
    borderColorPassword: '#e6e6e6'
  };

  login = (email, password) => {

    // verifica se os campos email e password estão certos
    // se não, altera suas bordas
    // se alguns dos campos não está no padrão, então não prossegue para o login
    if (!this.canLogin(email, password)) {
      return
    }

    try {
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
        .then((firebaseUser) => { // login com sucesso
          this.setState({ isAuthenticated: true });
          console.log(email, password);
          this.props.navigation.navigate("Home");
        }).catch((error) => {   // erro no login
          /* PRECISA VERIFICAR O TIPO DE ERRO */
          Alert.alert('Email ou senha incorretos', '',[{ text: 'OK' }])
          // insere a borda vermelha nos campos do login
          this.setState({
            borderColorPassword: '#ff0000',
            borderColorEmail: '#ff0000',
          })
        })
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

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorEmail }}>
          <Label>Digite seu email:</Label>
          <Input
            value={this.state.email}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({ email })}
            onEndEditing={() => { this.emailColor(this.state.email) }}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          style={{ borderColor: this.state.borderColorPassword }}>
          <Label>Digite sua senha:</Label>
          <Input
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
            onEndEditing={() => { this.passwordColor(this.state.password) }}
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
    var newColor = null
    if (re.test(String(email).toLowerCase())) {
      newColor = '#e6e6e6'
    } else {
      newColor = '#ff0000'
    }

    this.setState({
      borderColorEmail: newColor
    })

    return newColor
  }

  // apenas verifica se a variável está sem valor
  // se estiver, altera a cor da borda do input
  passwordColor = (password) => {
    var newColor = null
    if (password.length > 4) {
      newColor = '#e6e6e6'
    } else {
      newColor = '#ff0000'
    }

    this.setState({
      borderColorPassword: newColor
    })

    return newColor
  }

  canLogin = (email, password) => {

    newColorEmail = this.emailColor(email);
    newColorPassword = this.passwordColor(password);

    // os dois são iguais? ou seja, se forem diferente já retorna false
    // se os dois forem iguais e o email, por exemplo, for #e6e6e6, então os dois estão certos
    var canLoginNow = (newColorEmail == newColorPassword) && (newColorPassword == '#e6e6e6') && (this.state.email != '') && (this.state.password != '')

    return canLoginNow
  };
}

export default withNavigation(Login);
