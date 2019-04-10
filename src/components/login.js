import React, { Component} from 'react';

import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FacebookLogin from './facebookLogin';
import GoogleLogin from './googleLogin';

// import { Container } from './styles';
import firebase from 'react-native-firebase';


export default class Login extends Component {
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
     } catch (err) {
         console.log(err);
     }
    }

  render() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('C:/Users/henri/Desktop/minharep/minhaRep/src/image/logo2.png')}/>
            <TextInput style={styles.input}
            placeholder="Digite seu email"
            value={this.state.email}
            onChangeText={email => this.setState({email})}
            /> 
             <TextInput style={styles.input}
            placeholder="Digite sua senha"
            value={this.state.password}
            onChangeText={password => this.setState({password})}
            /> 
            <TouchableOpacity style={styles.button} onPress={this.login}>
                <Text style={styles.butonText}>Logar</Text>
            </TouchableOpacity>
            <FacebookLogin/>
            <GoogleLogin/>

            {this.state.isAuthenticated ?<Text>Logado com sucesso</Text>: <Text/> }
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 20,
    },
    input: {
        height: 45,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        borderColor: '#EEE',
        borderWidth: 1,
        paddingHorizontal: 20,
        marginBottom: 30,
    },

    button: {
        height: 45,
        backgroundColor: '#069',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    butonText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    
    image: {
        width: 300,
        height: 300,
        justifyContent: 'center',
    }
});