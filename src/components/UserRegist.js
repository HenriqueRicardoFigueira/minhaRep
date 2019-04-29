import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
//import styles from './styles';

import { withNavigation } from 'react-navigation';

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

class UserRegist extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {
      nome: '',
      email: '',
      password: '',
      cidade: '',
      idade: '',
      bio: '',
      uid: '',
    };
  };

  _registerUser = async () => {
    const { cidade, email, idade, nome, password } = this.state;
    //try {
      // REGISTRA O USUARIO NO AUTHENTICATION
      // RETORNA UM OBJETO DO TIPO user
      const usr = await firebase.auth().createUserWithEmailAndPassword(email, password);
      this.setState({ isRegistrado: true });

      // REGISTRA OS DADOS DO USUARIO NA DATABASE()
      this.ref.doc(usr.user.uid).set({
        bio: 'Conte um pouco sobre você',
        cidade: cidade,
        email: email,
        uid: usr.user.uid,
        idade: idade,
        nome: nome
      }).catch((error) => {
        console.error("Error registering user: ", error);
      });

      // RESETA O .state
      this.setState({
        nome: '',
        email: '',
        password: '',
        cidade: '',
        idade: '',
        bio: '',
        isGravado: true,
      });
      this.props.navigation.navigate("Home");
    /*} catch (err) {
      console.log(err);
    }   */
  }

  _deleteUser = (usr) => {
    // ESPERA UM OBJETO DO TIPO user
    // O USUARIO A SER DELETADO DEVE ESTAR LOGANO NO SISTEMA PARA SER EXCLUIDO 
    //fonte da informação : https://stackoverflow.com/questions/38800414/delete-a-specific-user-from-firebase
    //const {navigation} = this.props
    this.ref.doc(usr.user.uid).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
    //navigation.goBack();
  }

  _editUser = (usr) => {
    // ESPERA UM OBJETO DO TIPO user
    const { cidade, email, idade, nome, password } = this.state;
    // EDITA OS DADOS DO USUARIO "usr" NA DATABASE()
    this.ref.doc(usr.user.uid).set({
      bio: '',
      cidade: cidade,
      email: email,
      uid: usr.user.uid,
      idade: idade,
      nome: nome
    }).catch((error) => {
      console.error("Error editing document: ", error);
    });
    // RESETA O .state
    this.setState({
      nome: '',
      email: '',
      password: '',
      cidade: '',
      idade: '',
      bio: '',
      isGravado: true
    });
  }

  _goBack = () => {
    this.props.navigation.navigate("Login");
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
      <View style={styles.container}>

        <Text h1>Tela de registro </Text>

        <TextInput style={styles.input}
          placeholder="Nome"
          value={this.state.nome}
          autoCapitalize={'none'}
          onChangeText={nome => this.setState({ nome })}
        />

        <TextInput style={styles.input}
          placeholder="Email"
          value={this.state.email}
          autoCapitalize={'none'}
          onChangeText={email => this.setState({ email })}
        />

        <TextInput style={styles.input}
          placeholder="Senha"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
        />

        <TextInput style={styles.input}
          placeholder="Cidade"
          value={this.state.cidade}
          autoCapitalize={'none'}
          onChangeText={cidade => this.setState({ cidade })}
        />

        <TextInput style={styles.input}
          placeholder="Idade"
          value={this.state.idade}
          keyboardType='number-pad'
          onChangeText={idade => this.setState({ idade })}
        />

        <TouchableOpacity style={styles.button} onPress={this._registerUser}>
          <Text style={styles.butonText}> Registrar </Text>
        </TouchableOpacity>

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

export default withNavigation(UserRegist);