import React, { Component } from 'react';
import { Button, Item, Input, Label } from 'native-base';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
import {styles} from './styles';

import { withNavigation } from 'react-navigation';

/*
    Fields from User Register :
    name
    email
    password
    city
    age
    bio
    tag: null
*/

class UserRegist extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {
      name: '',
      email: '',
      password: '',
      age: '',
      bio: '',
      uid: '',
    };
  };

  _registerUser = async () => {
    const { email, age, name, password } = this.state;
    //try {
    // REGISTRA O USUARIO NO AUTHENTICATION
    // RETORNA UM OBJETO DO TIPO user
    const usr = await firebase.auth().createUserWithEmailAndPassword(email, password);
    this.setState({ isRegistrado: true });

    // REGISTRA OS DADOS DO USUARIO NA DATABASE()
    this.ref.doc(usr.user.uid).set({
      bio: 'Conte um pouco sobre você',
      email: email,
      uid: usr.user.uid,
      age: age,
      name: name
    }).catch((error) => {
      console.error("Error registering user: ", error);
    });

    // RESETA O .state
    this.setState({
      name: '',
      email: '',
      password: '',
      age: '',
      bio: '',
      isSubmited: true,
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
    const { email, age, name, password } = this.state;
    // EDITA OS DADOS DO USUARIO "usr" NA DATABASE()
    this.ref.doc(usr.user.uid).set({
      bio: '',
      email: email,
      uid: usr.user.uid,
      age: age,
      name: name
    }).catch((error) => {
      console.error("Error editing document: ", error);
    });
    // RESETA O .state
    this.setState({
      name: '',
      email: '',
      password: '',
      age: '',
      bio: '',
      isSubmited: true
    });
  }

  _goBack = () => {
    this.props.navigation.navigate("Login");
  }

  /*
  Fields from User Register :
  name
  email
  password
  age
  bio
  tag: null
  */

  render() {
    return (
      <View style={styles.container}>

        <Text h1>Tela de registro </Text>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite seu nome:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite seu email:</Label>
          <Input
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite sua senha:</Label>
          <Input
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Digite sua idade:</Label>
          <Input
            value={this.state.age}
            keyboardType='number-pad'
            onChangeText={(age) => this.setState({ age })}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={this._registerUser}>
          <Text style={styles.buttonText}> Registrar </Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(UserRegist);