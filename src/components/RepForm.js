import React, { Component } from 'react'
import { View, ScrollView, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import { firebase } from '../../Firebase'
import axios from 'axios';
import { styles } from './styles'
import { nameColor, bioColor, numberColor, memberColor, cepColor } from '../formValidation';


class RepForm extends Component {
  constructor(props) {
    super();
    this.ref = firebase.firestore().collection('republics');
    this.state = {
      name: '',
      bio: '',
      members: '',
      img: '',
      latitude: '',
      longitude: '',
      tags: '',
      cep: '',
      numberHome: '',
      street: '',
      complement: '',
      uf: '',
      city: '',
      isSubmited: false,
      borderColorBio: '#e6e6e6',
      borderColorCep: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
      borderColorMember: '#e6e6e6',
      borderColorNumberHome: '#e6e6e6',
      userUID: ''
    }
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid) // ACCESS THE REPUBLIC'S INFO
      .get()
      .then((repData) => {
        if (repData.exists) {
          alert("Já existe republica cadastrada neste usuário");
          this.props.navigation.navigate("Home");
        }
      });
    this.setState({
      userUID: user.uid,
    })
  }

  canRegister = (name, bio, members, cep) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolBio = bioColor.call(this, bio)
    boolCep = this.searchAdress(cep)
    boolName = nameColor.call(this, name)
    boolMember = memberColor.call(this, members)
    boolLocalization = this.getLocalization()

    return boolBio && boolName && boolNumber && boolCep && boolLocalization
  }

  searchAdress = (cep) => {
    if (!cepColor.call(this, cep)) {
      return false
    }

    axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((response) => {

      if (response.data.erro) {
        this.setState({
          borderColorCep: '#ff0000',
          street: '',
        })

        return false
      }

      this.setState({
        street: response.data.logradouro,
        uf: response.data.uf,
        city: response.data.localidade
      })
    })

    return true
  }

  getLocalization = () => {
    axios.get('https://maps.google.com/maps/api/geocode/json?address=' + this.state.logradouro + ',' + this.state.numberHome + ','
      + this.state.city + ',' + this.state.uf + '&components=country:BR&key=AIzaSyDTwm8jKEXByLoOxH3PgIF4SaU2RbLhJrg')
      .then((response) => {
        if (response.data.erro) {
          this.setState({
            borderColorNumberHome: '#ff0000',
            latitude: '',
            longitude: '',
          })

          return false
        }

        this.setState({
          latitude: response.data.results["0"].geometry.location.lat,
          longitude: response.data.results["0"].geometry.location.lng,
        })

        return true
      })
  }

  addRep = () => {
    const { name, bio, members, cep } = this.state;

    if (!this.canRegister(name, bio, members, cep)) {
      return
    }

    this.ref.doc(this.state.userUID).set({
      name: this.state.name,
      bio: this.state.bio,
      members: this.state.members,
      numberHome: this.state.numberHome,
      street: this.state.street,
      cep: this.state.cep,
      city: this.state.city,
      uf: this.state.uf,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      tags: this.state.tags,
      admUID: this.state.userUID,
    });
    this.props.navigation.navigate("Home");
  }

  /*register() {
    const nameError = validate('name', this.state.name)
    const bioError = validate('bio', this.state.bio)
    const tagsError = validate('tags', this.state.tags)
    const membersError = validate('members', this.state.members)

    this.setState({
      nameError: nameError,
      bioError: bioError,
      tagsError: tagsError,
      membersError: membersError
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps != this.props) ||   
      (nextState = this.state) 
  }*/

  render() {
    return (
      <View style={styles.container} >

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)}>
          <Label>Nome da república:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            onEndEditing={() => nameColor.call(this, this.state.name)}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBio, marginTop: styles.floatInput.marginTop }, styles.floatInput)}>
          <Label>Descrição:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
            onEndEditing={() => bioColor.call(this, this.state.bio)}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorMember }, styles.floatInput)} >
          <Label>Quantidade de Membros:</Label>
          <Input
            value={this.state.members}
            keyboardType='number-pad'
            onChangeText={(members) => this.setState({ members })}
            onEndEditing={() => memberColor.call(this, this.state.members)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          /*style={{ borderColor: this.state.borderColorNumber }}*/>
          <Label>Cep:</Label>
          <Input
            value={this.state.cep}
            onChangeText={(cep) => this.setState({ cep })}
            onEndEditing={() => this.searchAdress(this.state.cep)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}
          /*style={{ borderColor: this.state.borderColorNumber }}*/>
          <Label>Rua:</Label>
          <Input
            value={this.state.street}
          //onEndEditing={() => numberColor.call(this, this.state.members)}

          ></Input>
        </Item>
        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumberHome }, styles.floatInput)} >
          <Label>Número:</Label>
          <Input
            keyboardType='number-pad'
            value={this.state.numberHome}
            onChangeText={(numberHome) => this.setState({ numberHome })}
            onEndEditing={() => this.getLocalization()}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Tags:</Label>
          <Input
            value={this.state.tags}
            onChangeText={(tags) => this.setState({ tags })}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={() => this.addRep()}
          disabled={!this.state.name.length || !this.state.bio.length}>
          <Text style={styles.buttonText}>Submeter</Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(RepForm)