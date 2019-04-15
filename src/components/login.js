import React, { Component} from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FacebookLogin from './facebookLogin';
import GoogleLogin from './googleLogin';
import { withNavigation } from 'react-navigation';

// import { Container } from './styles';
import firebase from 'react-native-firebase';


class Login extends Component {
    state={
        email: '',
        password: '',
        isAuthenticated: false,
    };

    login = async () => {
        const { email , password } = this.state;

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

            <TextInput style={styles.input}
                placeholder="Digite seu email"
                value={this.state.email}
                autoCapitalize={'none'}
                onChangeText={email => this.setState({email})}
            />
            <TextInput style={styles.input}
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
}

export default withNavigation(Login);
