import React, { Component } from 'react'
import { View, ScrollView, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import firebase from 'react-native-firebase'

import { styles } from './styles'


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
      borderColor: '#e6e6e6'
    }
  };

  addRep = () => {
    this.ref.add({
      name: this.state.name,
      bio: this.state.bio,
      members: this.state.members,
      tags: this.state.tags,
    });
    this.props.navigation.navigate("RepCRUD");
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

        <Item floatingLabel style={styles.floatInput}>
          <Label>Nome da república:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Descrição:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Membros:</Label>
          <Input
            value={this.state.members}
            onChangeText={(members) => this.setState({ members })}
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