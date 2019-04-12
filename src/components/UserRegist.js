import React, { Component} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';

/*
    Fields from User Register :
    nome
    email
    password
    cidade
    idade
*/

export default class Register extends Component {

    state={
        uid: '',
        nome: '',
        email: '',
        password: '',
        cidade: '',
        idade: '',
        isRegistrado: false,
        isAuthenticated: false,
        isGravado: false
    };

    registro = async () => {
        const { nome, email , password, cidade, idade } = this.state;
        try {
            //REGISTRA O USUARIO NO AUTHENTICATION
            const user = await  firebase.auth().createUserWithEmailAndPassword(email, password);
            this.setState({isRegistrado: true});
            this.uid = user.uid;

            //APOS O REGISTRO O USUARIO É AUTENTICADO
            //user = login();

            /* 
            // REGISTRA OS DADOS DO USUARIO NA DATABASE()
            firebase.database().ref('Users/' + user.uid).set(
                {
                    Name: nome,
                    Email: email,
                    City: cidade
                }
            ).then(() => {
                console.log('inserted')
            }).catch((error) => {
                console.log(error)
            });
            this.setState({isGravado: true});
            */

        } catch (err) {
            console.log(err);
        }

    }
    /*
    login = async () => {
        const { email , password } = this.state;

     try {
        const user = await  firebase.auth().signInWithEmailAndPassword(email, password);
        this.setState({isAuthenticated: true});
        console.log(email, password);
        return user;
     } catch (err) {
         console.log(err);
     }
    }
    */

  render() {
    return (
        <View style={styles.container}>

            <Text h1>Tela de registro </Text>

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

            <TouchableOpacity style={styles.button} onPress={this.registro}>
                <Text style={styles.butonText}>Registrar</Text>
            </TouchableOpacity>

            {this.state.isRegistrado ?<Text>Registrado com sucesso</Text>: <Text/> }
            {this.state.isAuthenticated ?<Text>Logado com sucesso</Text>: <Text/> }
            {this.state.isGravado ?<Text>Chegou ao fim</Text>: <Text/> }

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
        padding: 30,
        width:350,
        height: 550
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
        fontSize: 18,
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
});