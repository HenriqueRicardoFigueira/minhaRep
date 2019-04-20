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
    bio
    tag: null
*/

export default class Register extends Component {

    state={
        nome: '',
        email: '',
        password: '',
        cidade: '',
        idade: '',
        bio: '',
        isRegistrado: false,
        isAuthenticated: false,
        isGravado: false
    };

    registro = async () => {
        const { bio, cidade , email, id, idade, nome, password} = this.state;
        try {
            //REGISTRA O USUARIO NO AUTHENTICATION
            const user = await  firebase.auth().createUserWithEmailAndPassword(email, password);
            this.setState({isRegistrado: true});
            
            // REGISTRA OS DADOS DO USUARIO NA DATABASE()
            firebase.database().ref('users/' + user.uid).set(
                {
                    bio: bio,
                    cidade: cidade,
                    email: email,
                    id: id,
                    idade: idade,
                    nome: nome,
                }
            ).then(() => {
                this.setState({isGravado: true});
            }).catch((error) => {
                console.log(error)
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
                onChangeText = {idade => this.setState({idade})}
            />


            <TouchableOpacity style = {styles.button} onPress = {this.registro}>
                <Text style = {styles.butonText}>Registrar</Text>
            </TouchableOpacity>

            { this.state.isRegistrado ? <Text> Registrado com sucesso </Text>: <Text/> }
            { this.state.isAuthenticated ? <Text> Logado com sucesso </Text>: <Text/> }
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
        padding: 30,
        width: 350,
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