import React, { Component} from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FacebookLogin from './facebookLogin';
import GoogleLogin from './googleLogin';
import { withNavigation } from 'react-navigation';

// import { Container } from './styles';
import firebase from 'react-native-firebase';

import {input, styles} from './styles';

class Login extends Component {
    state = {
        email: '',
        password: '',
        canLogin: false,
        isAuthenticated: false,
        borderColorEmail: '#e6e6e6',
        borderColorPassword: '#e6e6e6'
    };

    login = async () => {
        const { email , password } = this.state;

        // verifica se os campos email e password estão certos
        // se não, altera suas bordas
        this.canLogin();

        // se alguns dos campos não está no padrão, então não prossegue para o login
        if(!this.state.canLogin) {
            return;
        }

     try {
        const user = await  firebase.auth().signInWithEmailAndPassword(email, password);
        this.setState({isAuthenticated: true});
        console.log(email, password);
        this.props.navigation.navigate("Home");
     } catch (err) {
         console.log(err);
     }
    }

  render() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../image/logo2.png')}/>

            <TextInput style={input(this.state.borderColorEmail)}
                placeholder="Digite seu email"
                value={this.state.email}
                autoCapitalize={'none'}
                onChangeText={email => this.setState({email})}
            />
            <TextInput style={input(this.state.borderColorPassword)}
                placeholder="Digite sua senha"
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={password => this.setState({password})}
            />
            <TouchableOpacity style={styles.button} onPress={this.login}>
                <Text style={styles.butonText}>Logar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.login}>
                <Text style={styles.butonText}>Registrar</Text>
            </TouchableOpacity>

            <View style={styles.loginView}>
                <FacebookLogin style={styles.loginButtons}/>
                <GoogleLogin style={styles.loginButtons}/>
            </View>

            {this.state.isAuthenticated ?<Text>Logado com sucesso</Text>: <Text/> }
        </View>
    );
  }

  // utilizando um regex, verifica o email
  emailColor = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(re.test(String(email).toLowerCase())) {
      return '#e6e6e6';
    } else {
      return '#ff0000';
    }
  }

  // apenas verifica se a variável está sem valor
  // se estiver, altera a cor da borda do input
  passwordColor = (password) => {
    if(password.length > 4) {
      return '#e6e6e6';
    } else {
      return '#ff0000';
    }
  }

  canLogin = () => {

    borderColorEmail = this.emailColor(this.state.email);
    borderColorPassword = this.passwordColor(this.state.password);

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
