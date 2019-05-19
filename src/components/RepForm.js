import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import { firebase } from '../../Firebase'
import axios from 'axios';

import { styles } from './styles'

import { nameColor, bioColor, numberColor } from '../formValidation';



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
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
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

  canRegister = (name, bio, members) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolBio = bioColor.call(this, bio)
    boolName = nameColor.call(this, name)
    boolNumber = numberColor.call(this, members)

    return boolBio && boolName && boolNumber
  }

  searchAdress = (cep) => {
    axios.get('https://viacep.com.br/ws/' + cep + '/json/').then((response) => {
      if (response) {
        this.setState({
          street: response.data.logradouro,
          uf: response.data.uf,
          city: response.data.localidade
        })
      }
      console.log(this.state);

    })
  }

  getLocalization = () => {
    axios.get('https://maps.google.com/maps/api/geocode/json?address=' + this.state.logradouro + ',' + this.state.numberHome + ','
      + this.state.city + ',' + this.state.uf + '&components=country:BR&key=AIzaSyDTwm8jKEXByLoOxH3PgIF4SaU2RbLhJrg').then((response) => {
        if (response) {
          console.log(response);
          this.setState({
            latitude: response.data.results["0"].geometry.location.lat,
            longitude: response.data.results["0"].geometry.location.lng,
          })

        }
        console.log(this.state);
      })
  }

  addRep = () => {
    const { name, bio, members } = this.state;

    if (!this.canRegister(name, bio, members)) {
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorName }}>
            <Label>Nome da república:</Label>
            <Input
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              onEndEditing={() => nameColor.call(this, this.state.name)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorBio, marginTop: styles.floatInput.marginTop }}>
            <Label>Descrição:</Label>
            <Input
              value={this.state.bio}
              onChangeText={(bio) => this.setState({ bio })}
              onEndEditing={() => bioColor.call(this, this.state.bio)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorNumber }}>
            <Label>Quantidade de Membros:</Label>
            <Input
              value={this.state.members}
              keyboardType='number-pad'
              onChangeText={(members) => this.setState({ members })}
              onEndEditing={() => numberColor.call(this, this.state.members)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
          /*style={{ borderColor: this.state.borderColorNumber }}*/>
            <Label>Cep:</Label>
            <Input
              value={this.state.cep}
              onChangeText={(cep) => this.setState({ cep })}
              //onEndEditing={() => numberColor.call(this, this.state.members)}
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
          <Item floatingLabel style={styles.floatInput}>
            <Label>Número:</Label>
            <Input
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
      </ScrollView>
    );
  }
}
export default withNavigation(RepForm)