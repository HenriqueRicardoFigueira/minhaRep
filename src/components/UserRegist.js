import React, { Component} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
import {validate} from '../validation/UserRegistValidation'

/*
    Fields from User Register :
    nome
    email
    password
    cidade
    idade
    bio
    tag: null
*/

export default class Register extends Component {
    constructor(props){
        super(props)

        this.ref = firebase.firestore().collection('users');

        this.state={

            nome: '',
            nomeError: false,
            nomeErrorMessage: '',

            email: '',
            emailError: false,
            emailErrorMessage: '',

            password: '',
            passwordError: false,
            passwordErrorMessage: '',

            cidade: '',
            cidadeError: false,
            cidadeErrorMessage: '',

            idade: '',
            idadeError: false,
            idadeErrorMessage: '',

            bio: '',

            uid: '',

            isValidated: false,
            isRegistrado: false,
            isGravado: false,
        }
    };
    
    validateFieldNome(){
        let v = validate('nome', this.nome);
        this.setState({
            nomeError: !v[0],
            nomeErrorMessage: v[1]
        })
    }
    validateFieldEmail(){
        let v = validate('email', this.email);
        this.setState({
            emailError: !v[0],
            emailErrorMessage: v[1]
        })
    }
    validateFieldPassword(){
        let v = validate('password', this.password);
        this.setState({
            passwordError: !v[0],
            passwordErrorMessage: v[1]
        })
    }
    validateFieldCidade(){
        let v = validate('cidade', this.cidade);
        this.setState({
            cidadeError: !v[0],
            cidadeErrorMessage: v[1]
        })
    }
    validateFieldIdade(){
        let v = validate('idade', this.idade);
        this.setState({
            idadeError: !v[0],
            idadeErrorMessage: v[1]
        })
    }

    validateAll(){
        validateFieldNome();
        validateFieldEmail();
        validateFieldPassword();
        validateFieldCidade();
        validateFieldIdade();
        if(
            nomeError == false && 
            emailError == false && 
            passwordError == false && 
            cidadeError == false && 
            idadeError == false
        ) registro();
    }

    registro = async () => {
        const { cidade , email, idade, nome, password} = this.state;
        try {
            //REGISTRA O USUARIO NO AUTHENTICATION
            const res = await  firebase.auth().createUserWithEmailAndPassword(email, password);
            this.setState({isRegistrado: true});
            
            // REGISTRA OS DADOS DO USUARIO NA DATABASE()
            this.ref.doc(res.user.uid).set({
                bio: '',
                cidade: cidade,
                email: email,
                uid: res.user.uid,
                idade: idade,
                nome: nome
            });
            // RESETA O .state
            this.setState({
                nome: '',
                nomeError: false,
                nomeErrorMessage: '',
                email: '',
                emailError: false,
                emailErrorMessage: '',
                password: '',
                passwordError: false,
                passwordErrorMessage: '',
                cidade: '',
                cidadeError: false,
                cidadeErrorMessage: '',
                idade: '',
                idadeError: false,
                idadeErrorMessage: '',
                bio: '',
                isGravado: true
              });
        } catch (err) {
            console.log(err);
        }
    }    


    /*
    Fields from User Register :
    nome
    email
    password
    cidade
    idade
    bio
    tag: null
    */

  render() {
    return (
        <View style = {styles.container}>

            <Text h1>Tela de registro </Text>

            <TextInput style = {styles.input}
                placeholder = "Nome"
                value = {this.state.nome}
                autoCapitalize = {'none'}
                onChangeText = {nome => this.setState({nome})}
            />

            <TextInput style = {styles.input}
                placeholder = "Email"
                value = {this.state.email}
                autoCapitalize = {'none'} 
                onChangeText = {email => this.setState({email})}
            />

            <TextInput style = {styles.input}
                placeholder = "Senha"
                value = {this.state.password}
                secureTextEntry = {true}
                onChangeText = {password => this.setState({password})}
            />

            <TextInput style = {styles.input}
                placeholder = "Cidade"
                value = {this.state.cidade}
                autoCapitalize = {'none'} 
                onChangeText = {cidade => this.setState({cidade})}
            />

            <TextInput style = {styles.input}
                placeholder = "Idade"
                value = {this.state.idade}
                keyboardType = 'number-pad'
                onChangeText = {idade => this.setState({idade})}
            />


            <TouchableOpacity style = {styles.button} onPress = {this.registro}>
                <Text style = {styles.butonText}> Registrar </Text>
            </TouchableOpacity>

            { this.state.isRegistrado ? <Text> Registrado com sucesso </Text>: <Text/> }
            { this.state.isGravado ? <Text> Chegou ao fim </Text>: <Text/> }

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
        paddingHorizontal: 30,
        paddingTop: 30,
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
        borderRadius: 30,
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