import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import { firebase } from '../../Firebase'
import axios from 'axios';
import { styles } from './styles'
import { nameColor, bioColor, genericColor, cepColor } from '../formValidation';
import { imageSelect } from './commonPhoto'


class RepForm extends Component {
  constructor(props) {
    super();
    this.ref = firebase.firestore().collection('republics');
    this.state = {
      regex: /^[0-9][0-9]*$/,

      name: '',
      bio: '',
      bed: '',
      bathroom: '',
      latitude: '',
      longitude: '',
      tags: '',
      cep: '',
      numberHome: '',
      street: '',
      complement: '',
      uf: '',
      city: '',
      uid: '',

      isSubmited: false,

      avatarSource: null,
      photoURL: [],
      gotUrl: false,
      uri: '',

      boolLocalization: false,
      borderColorBio: '#e6e6e6',
      borderColorCep: '#e6e6e6',
      borderColorBed: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
      borderColorBathroom: '#e6e6e6',
      borderColorNumberHome: '#e6e6e6',
    }
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid) // ACCESS THE REPUBLIC'S INFO
      .get()
      .then((repData) => {
        if (repData.exists) {
          alert("Já existe republica cadastrada neste usuário");
          this.props.navigation.navigate("RepCard");
        }
      });
    this.setState({
      uid: user.uid,
    })
  }

  canRegister = (name, bio, bathroom, bed) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolBio = bioColor.call(this, bio)
    boolName = nameColor.call(this, name)
    boolBed = genericColor.call(this, bed, this.state.regex, 'borderColorBed')
    boolBathroom = genericColor.call(this, bathroom, this.state.regex, 'borderColorBathroom')

    return boolBio && boolName && this.state.boolLocalization && this.getLocalization() && boolBed && boolBathroom && this.state.photoURL.length != 0
  }

  searchAdress = (cep) => {
    if (!cepColor.call(this, cep)) {
      this.setState({
        borderColorCep: '#ff0000',
        street: '',
        boolLocalization: false,
      })

      return false
    }

    axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((response) => {

      if (response.data.erro) {
        this.setState({
          borderColorCep: '#ff0000',
          street: '',
          boolLocalization: false,
        })
      } else {
        this.setState({
          street: response.data.logradouro,
          uf: response.data.uf,
          city: response.data.localidade,
          boolLocalization: true,
        })
      }
    })
  }

  getLocalization = () => {
    if(!this.state.boolLocalization) {
      this.setState({borderColorCep: '#ff0000'});
      return false
    } else if(!genericColor.call(this, this.state.numberHome, this.state.regex, 'borderColorNumberHome')) {
      this.setState({borderColorNumber: '#ff0000'})
      return false
    }

    axios.get('https://maps.google.com/maps/api/geocode/json?address=' + this.state.logradouro + ',' + this.state.numberHome + ','
      + this.state.city + ',' + this.state.uf + '&components=country:BR&key=AIzaSyDTwm8jKEXByLoOxH3PgIF4SaU2RbLhJrg')
      .then((response) => {
        if (response.data.erro) {
          this.setState({
            borderColorNumberHome: '#ff0000',
            latitude: '',
            longitude: '',
          })
        } else {
          this.setState({
            latitude: response.data.results["0"].geometry.location.lat,
            longitude: response.data.results["0"].geometry.location.lng,
          })
        }
      })

      return true;
  }

   addRep = async() => {
    const { name, bio, cep, numberHome, bathroom, bed } = this.state;

    if (!this.canRegister(name, bio, bathroom, bed)) {
      return
    }

    await this.ref.doc(this.state.uid).set({

      name: name,
      bio: bio,
      numberHome: numberHome,
      street: this.state.street,
      cep: cep,
      bathroom: bathroom,
      bed: bed,
      city: this.state.city,
      uf: this.state.uf,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      tags: this.state.tags,
      admUID: this.state.uid,
      photoURL: this.state.photoURL,
      gotUrl: true,
      isAnnounced: false,

    });

    // add o dono como primeiro membro
    await firebase.firestore().collection('users').doc(this.state.uid).get()
      .then(async (data) => {

        nameUser = data.data().name
        await firebase.firestore().collection('republics/' + this.state.uid + '/members')
        .doc(this.state.uid)
        .set({
          name: nameUser,
          uid: this.state.uid
        })
      })


    this.props.navigation.navigate("RepCard");
  }

  updateStateCallback = (url) => {
    this.state.photoURL.push(url)
    this.setState({ gotUrl: true })
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)} >
            <Label>Nome da república:</Label>
            <Input
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              onEndEditing={() => nameColor.call(this, this.state.name)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBio }, styles.floatInput)} >
            <Label>Descrição:</Label>
            <Input
              value={this.state.bio}
              onChangeText={(bio) => this.setState({ bio })}
              onEndEditing={() => bioColor.call(this, this.state.bio)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorCep }, styles.floatInput)} >
            <Label>Cep:</Label>
            <Input
              value={this.state.cep}
              keyboardType='number-pad'
              onChangeText={(cep) => this.setState({ cep })}
              onEndEditing={() => this.searchAdress(this.state.cep)}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput} >
            <Label>Rua:</Label>
            <Input
              value={this.state.street}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumberHome }, styles.floatInput)}>
            <Label>Número:</Label>
            <Input
              keyboardType='number-pad'
              value={this.state.numberHome}
              onChangeText={(numberHome) => this.setState({ numberHome })}
              onEndEditing={() => this.getLocalization()}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBathroom }, styles.floatInput)}>
            <Label>Banheiros:</Label>
            <Input
              keyboardType='number-pad'
              value={this.state.bathroom}
              onChangeText={(bathroom) => this.setState({ bathroom })}
              onEndEditing={() => genericColor.call(this, this.state.bathroom, this.state.regex, 'borderColorBathroom')}
              style = {styles.inputStyle}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBed }, styles.floatInput)}>
            <Label>Quartos:</Label>
            <Input
              keyboardType='number-pad'
              value={this.state.bed}
              onChangeText={(bed) => this.setState({ bed })}
              onEndEditing={() => genericColor.call(this, this.state.bed, this.state.regex, 'borderColorBed')}
              style = {styles.inputStyle}
            ></Input>
          </Item>
          
          <Button style={styles.button} onPress={() => {imageSelect(this.state.admUID, this.updateStateCallback)}}>
            <Text style={styles.buttonText}> Enviar Foto </Text>
          </Button>

          <Button style={styles.button} onPress={() => this.addRep()}>
            <Text style={styles.buttonText}>Submeter</Text>
          </Button>

        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(RepForm)