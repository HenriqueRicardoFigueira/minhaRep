import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
import { numberColor, valueColor } from '../formValidation';

class Anuncio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      vacancies: '',
      repUID: firebase.auth().currentUser.uid,

      borderColorValue: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
    }
  }

  componentWillMount() {
    this.ref = firebase.firestore().collection('republics');
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .get()
      .then((repData) => {
        if (repData) {
          const repDatas = repData.data();
          this.setState({
            repUID: repDatas.admUID,
            repDatas: repDatas,
          })

          if(repDatas.isAnnounced) { // verificar aqui se a república já foi anunciada
            alert("Esta república já está anunciada");
            this.props.navigation.navigate("Home");
          }
        } else {
          alert("Não existe republica cadastrada neste usuário");
          this.props.navigation.navigate("Home");
        }
      })
  }

  canRegister = (number, value) => {
    boolValue = valueColor.call(this, value)
    boolNumber = numberColor.call(this, number)
    return boolValue && boolNumber
  }

  // CHAMAR ESTA FUNÇÃO AO CLICAR NO BOTÃO DE CADASTRAR ANÚNCIO
  registerRep = () => {

    const { value, vacancies, repUID } = this.state;
    if (!this.canRegister(vacancies, value)) {
      return
    }

    const { repDatas } = this.state
    ref = firebase.firestore().collection('republics');
    ref.doc(repUID).set({
      admUID: repUID,
      bathroom: repDatas.bathroom,
      bed: repDatas.bed,
      bio: repDatas.bio,
      cep: repDatas.cep,
      city: repDatas.city,
      complement: repDatas.complement,
      gotUrl: repDatas.gotUrl,
      isAnnounced: true,
      latitude: repDatas.latitude,
      longitude: repDatas.longitude,
      members: repDatas.members,
      name: repDatas.name,
      numberHome: repDatas.numberHome,
      photoURL: repDatas.photoURL,
      street: repDatas.street,
      tags: repDatas.tags,
      uf: repDatas.uf,
      value: value,
      vacancies: vacancies,
    })
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <View style={styles.container}>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorValue }, styles.floatInput)}>
          <Label>Valor :</Label>
          <Input
            keyboardType='number-pad'
            onChangeText={(value) => this.setState({ value })}
            onEndEditing={() => valueColor.call(this, this.state.value)}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumber }, styles.floatInput)}>
          <Label>Numero de vagas:</Label>
          <Input
            keyboardType='number-pad'
            onChangeText={(vacancies) => this.setState({ vacancies })}
            onEndEditing={() => numberColor.call(this, this.state.vacancies)}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={() => this.registerRep()}>
          <Text style={styles.buttonText}> Anunciar </Text>
        </Button>

      </View>
    )
  }
}

export default withNavigation(Anuncio);