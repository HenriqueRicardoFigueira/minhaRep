import React, { Component } from 'react';
import { Container, Button, Item, Input, Label } from 'native-base';
import { View, Text, ScrollView } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { nameColor, emailColor, passwordColor, ageColor } from '../formValidation';
import { withNavigation } from 'react-navigation';
import md5 from 'md5'; 

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
      borderColorAge: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorEmail: '#e6e6e6',
      borderColorPassword: '#e6e6e6',
    };
  };

  registerUser = async () => {
    let { email, age, name, password } = this.state;
    if (!this.canRegister(email, age, name, password)) {
      return
    }

    password = md5(password)

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
      name: name,
      imgUrl: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381'
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

    this.props.navigation.navigate("RepCard");
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>

          <Text h1>Tela de registro </Text>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)} >
            <Label style={{ marginBottom: 20 }}>Digite seu nome:</Label>
            <Input
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              onEndEditing={() => nameColor.call(this, this.state.name)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorEmail }, styles.floatInput)} >
            <Label>Digite seu email:</Label>
            <Input
              value={this.state.email}
              autoCapitalize={'none'}
              onChangeText={(email) => this.setState({ email })}
              onEndEditing={() => emailColor.call(this, this.state.email)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorPassword }, styles.floatInput)} >
            <Label>Digite sua senha:</Label>
            <Input
              value={this.state.password}
              secureTextEntry={true}
              autoCapitalize={'none'}
              onChangeText={(password) => this.setState({ password })}
              onEndEditing={() => passwordColor.call(this, this.state.password)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorAge }, styles.floatInput)} >
            <Label>Digite sua idade:</Label>
            <Input
              value={this.state.age}
              keyboardType='number-pad'
              onChangeText={(age) => this.setState({ age })}
              onEndEditing={() => ageColor.call(this, this.state.age)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Button style={styles.button} onPress={this.registerUser}>
            <Text style={styles.buttonText}> Registrar </Text>
          </Button>

        </View>
      </ScrollView>
    );
  }

  canRegister = (email, age, name, password) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolAge = ageColor.call(this, age)
    boolName = nameColor.call(this, name)
    boolEmail = emailColor.call(this, email)
    boolPassword = passwordColor.call(this, password)

    return boolAge && boolName && boolEmail && boolPassword
  }
}

export default withNavigation(UserRegist);