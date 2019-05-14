import React, { Component } from 'react'
import { View, ScrollView, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import {firebase} from '../../Firebase'

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
      localization: '',
      tags: '',
      isSubmited: false,
      borderColorBio: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
      userUID: ''
    }
  };

  componentDidMount() {
    var user = firebase.auth().currentUser;

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

  addRep = () => {
    const { name, bio, members } = this.state;

    if(!this.canRegister(name, bio, members)) {
      return
    }

    this.ref.doc(this.state.userUID).set({
      name: this.state.name,
      bio: this.state.bio,
      members: this.state.members,
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
  }*/

  render() {
    return (
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
          style={{ borderColor: this.state.borderColorBio }}>
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