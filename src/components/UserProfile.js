import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {
      name: '', //EDITAVEL
      email: '', //
      password: '', // q
      age: '', //EDITAVEL
      bio: '', //EDITAVEL
      uid: '', //PK

      isEditado: false
    };
  }

  /* CAMPOS DA DATABASE 
    bio,
    email,
    uid,
    age,
    name
  */

  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.ref.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            email: userP.email,
            bio: userP.bio,
            age: userP.age,
            uid: user.uid
          })
        } else {
          console.log("Não existe usuário");
        }
      })
  }

  editUser = () => {
    const { age, name, bio, email } = this.state;
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
        bio: bio,
        email: email,
        uid: user.uid,
        age: age,
        name: name
      });
    this.setState({ isEditado: true });
  }

  _goBack = () => {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text h1>Tela de Perfil</Text>

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
          <Label>Digite sua idade:</Label>
          <Input
            value={this.state.age}
            keyboardType='number-pad'
            onChangeText={(age) => this.setState({ age })}
          ></Input>
        </Item>

        {this.state.isEditado ? <Text> Editado com sucesso </Text> : <Text />}

        <Button style={styles.button} onPress={this.editUser}>
          <Text style={styles.buttonText}> Editar </Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(UserProfile);