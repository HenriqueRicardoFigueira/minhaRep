import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
import { numberColor, valueColor } from '../formValidation';
import Tags from './tags';
import { EventRegister } from 'react-native-event-listeners'


class Anuncio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      vacancies: '',
      repUID: firebase.auth().currentUser.uid,
      tags: {
        garage: false,
        suits: false,
        pets: false,
        wifi: false,
        party: false
      },
      borderColorValue: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
    }
  }

  componentWillMount() {
    this.ref = firebase.firestore().collection('republics');
    var user = firebase.auth().currentUser;
    var suits = false;
    var garage = false;
    var wifi = false;
    var party = false;
    var pets = false;
    this.listener = EventRegister.addEventListener('changeIcon', (newTags) => {
      console.log(newTags);
      if (newTags == 'suits')
        suits = true;
      else if (newTags == 'nosuits')
        suits = false;
      else if (newTags == 'garage')
        garage = true;
      else if (newTags == 'nogarage')
        garage = false;
      else if (newTags == 'pets')
        pets = true;
      else if (newTags == 'nopets')
        pets = false;
      else if (newTags == 'wifi')
        wifi = true;
      else if (newTags == 'nowifi')
        wifi = false;
      else if (newTags == 'party')
        party = true;
      else if (newTags == 'noparty')
        party = false;

      this.setState({ tags: { suits: suits, garage: garage, pets: pets, wifi: wifi, party: party } })
    })

    this.ref.doc(user.uid)
      .get()
      .then((repData) => {
        if (repData) {
          const repDatas = repData.data();
          this.setState({
            repUID: repDatas.admUID,
            repDatas: repDatas,
          })

          if (repDatas.isAnnounced) { // verificar aqui se a república já foi anunciada
            alert("Esta república já está anunciada");
            this.props.navigation.navigate("RepCard");
          }
        } else {
          alert("Não existe republica cadastrada neste usuário");
          this.props.navigation.navigate("RepCard");
        }
      })
    console.log(this.state)
  }

  canRegister = (number, value) => {
    boolValue = valueColor.call(this, value)
    boolNumber = numberColor.call(this, number)
    return boolValue && boolNumber
  }

  // CHAMAR ESTA FUNÇÃO AO CLICAR NO BOTÃO DE CADASTRAR ANÚNCIO
  registerRep = () => {

    const { value, vacancies, repUID, tags } = this.state;
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
      tags: tags,
      uf: repDatas.uf,
      value: value,
      vacancies: vacancies,
    })
    this.props.navigation.navigate("RepCard");
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
            style={styles.inputStyle}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumber }, styles.floatInput)}>
          <Label>Numero de vagas:</Label>
          <Input
            keyboardType='number-pad'
            onChangeText={(vacancies) => this.setState({ vacancies })}
            onEndEditing={() => numberColor.call(this, this.state.vacancies)}
            style={styles.inputStyle}
          ></Input>
        </Item>

        <Tags />


        <Button style={styles.button} onPress={() => this.registerRep()}>
          <Text style={styles.buttonText}> Anunciar </Text>
        </Button>

      </View>
    )
  }
}

export default withNavigation(Anuncio);