import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
//import styles from './styles';

import { withNavigation } from 'react-navigation';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');

    this.state = {
      nome: '', //EDITAVEL
      email: '', //
      password: '', // q
      cidade: '', //EDITAVEL
      idade: '', //EDITAVEL
      bio: '', //EDITAVEL
      uid: '', //PK

      isEditado: false
    };
  }

  /* CAMPOS DA DATABASE 
    bio,
    cidade,
    email,
    uid,
    idade,
    nome
  */

  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.ref.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            nome: userP.nome,
            email:userP.email,
            bio: userP.bio,
            idade: userP.idade,
            cidade: userP.cidade,
            uid: user.uid
          })
        } else {
          console.log("Não existe usuário");
        }
      })
  }

  editUser = () => {
    const { cidade, idade, nome, bio, email } = this.state;
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
        bio: bio,
        cidade: cidade,
        email: email,
        uid: user.uid,
        idade: idade,
        nome: nome
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

        <TextInput style={styles.input}
          label='Nome'
          placeholder={this.state.nome}
          value={this.state.nome}
          autoCapitalize={'none'}
          onChangeText={nome => this.setState({ nome })}
        />

        <TextInput style={styles.input}
          label='Email'
          placeholder={this.state.email}
          value={this.state.email}
          autoCapitalize={'none'}
          editable={false}
          onChangeText={email => this.setState({ email })}
        />

        <TextInput style={styles.input}
          label='Cidade'
          placeholder={this.state.cidade}
          value={this.state.cidade}
          autoCapitalize={'none'}
          onChangeText={cidade => this.setState({ cidade })}
        />

        <TextInput style={styles.input}
          label='Idade'
          placeholder={this.state.idade}
          value={this.state.idade}
          keyboardType='number-pad'
          onChangeText={idade => this.setState({ idade })}
        />

        <TextInput style={styles.input}
          label='Bio'
          placeholder={this.state.bio}
          value={this.state.bio}
          onChangeText={bio => this.setState({ bio })}
        />

        {this.state.isEditado ? <Text> Editado com sucesso </Text> : <Text />}

        <TouchableOpacity style={styles.button} onPress={this.editUser}>
          <Text style={styles.butonText}> Editar </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={this._goBack}>
          <Text style={styles.butonText}> Voltar </Text>
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

export default withNavigation(UserProfile);