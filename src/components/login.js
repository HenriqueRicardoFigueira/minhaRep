import React, { Component } from 'react';
import { Alert } from 'react-native';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Item, Input, Label } from 'native-base';
import FacebookLogin from './facebookLogin';
import GoogleLogin from './googleLogin';

import { withNavigation } from 'react-navigation';

import { emailColor, passwordColor } from '../formValidation';

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

  errorMessage = (error) => {

    switch (error.code) {
      case 'auth/unknown':
        return 'Verifique a conexão e tente novamente.'
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou senha incorretos.'
      default:
        return 'Erro inesperado. Tente novamente mais tarde.'
    }
  }

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
          this.props.navigation.navigate("RepCard");
        }).catch((error) => {   // erro no login
          /* PRECISA VERIFICAR O TIPO DE ERRO */
          Alert.alert(this.errorMessage(error), '', [{ text: 'OK' }])
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

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorEmail }, styles.floatInput)} >
          <Label>Digite seu email:</Label>
          <Input
            value={this.state.email}
            autoCapitalize={'none'}
            onChangeText={(email) => this.setState({ email })}
            onEndEditing={() => { emailColor.call(this, this.state.email) }}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorPassword }, styles.floatInput)} >
          <Label>Digite sua senha:</Label>
          <Input
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
            onEndEditing={() => { passwordColor.call(this, this.state.password) }}
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

  canLogin = (email, password) => {

    newColorEmail = emailColor.call(this, email);
    newColorPassword = passwordColor.call(this, password);

    // os dois são iguais? ou seja, se forem diferente já retorna false
    // se os dois forem iguais e o email, por exemplo, for #e6e6e6, então os dois estão certos
    var canLoginNow = (newColorEmail == newColorPassword) && (newColorPassword == '#e6e6e6') && (this.state.email != '') && (this.state.password != '')

    return canLoginNow
  };
}

export default withNavigation(Login);
