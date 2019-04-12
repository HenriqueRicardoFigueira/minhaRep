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

        if(!email || !password) {
            return;
        }

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
                onEndEditing={this.login}
                onChangeText={password => this.setState({password})}
            />
            <TouchableOpacity style={styles.button} onPress={this.login}>
                <Text style={styles.butonText}>Logar</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7ff',
        padding: 10,
    },

    input: {
        paddingTop: 10,
        height: 45,
        backgroundColor: '#FFF',
        alignSelf: 'stretch',
        borderColor: '#e6e6e6',
        borderWidth: 1,
        paddingHorizontal: 20,
        marginBottom: 30,
        borderRadius: 50,
        fontSize: 18
    },

    button: {
        height: 45,
        backgroundColor: '#069',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },

    butonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18
    },

    image: {
        width: 180,
        height: 180,
        justifyContent: 'center'
    },

    loginView: {
        paddingTop: 10
    }
});