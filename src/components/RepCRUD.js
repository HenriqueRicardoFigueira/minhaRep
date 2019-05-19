import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';
import { nameColor, memberColor, bioColor } from '../formValidation'

class RepCRUD extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('republics');
    //this.imgRef = firebase.storage().ref().child('republicsImages');

    this.state = {
      // PK TO FIND THE OWNER AND THE DOCUMENT
      admUID: '',
      // DATABASE FIELDS
      bio: '',
      members: '',
      name: '',
      tags: '',
      // CHECK FIELDS
      isEditado: false,
      borderColorBio: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorMember: '#e6e6e6',
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser; // CHECK FOR THE CURRENT USERS UID

    this.ref.doc(user.uid) // ACCESS THE REPUBLIC'S INFO
      .get()
      .then((repData) => {
        if (repData.exists) {
          const repDatas = repData.data();
          this.setState({ // INITIALIZE THE FIELDS WITH THE REPUBLIC'S INFO
            admUID: repDatas.admUID,
            bio: repDatas.bio,
            members: repDatas.members,
            name: repDatas.name,
            tags: repDatas.tags
          })
        } else {
          alert("Não existe republica cadastrada neste usuário");
          this.props.navigation.navigate("Home");
        }
      })
  }

  canRegister = (name, bio, members) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolBio = bioColor.call(this, bio)
    boolName = nameColor.call(this, name)
    boolMember = memberColor.call(this, members)

    return boolBio && boolName && boolMember
  }

  editRep = () => {
    const { admUID, bio, members, name, tags } = this.state;

    if (!this.canRegister(name, bio, members)) {
      return
    }

    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
        admUID: admUID,
        bio: bio,
        members: members,
        name: name,
        tags: tags
      });
    this.setState({ isEditado: true });
  }

  membersList = () => {
    this.props.navigation.navigate("MembersList");
  }

  render() {
    return (
      <View style={styles.container}>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)}>
          <Label>Nome da Republica:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            onEndEditing={() => nameColor.call(this, this.state.name)}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorMember }, styles.floatInput)}>
          <Label>Numero de Membros:</Label>
          <Input
            value={this.state.members}
            keyboardType='number-pad'
            onChangeText={(members) => this.setState({ members })}
            onEndEditing={() => memberColor.call(this, this.state.members)}
          ></Input>
        </Item>

        <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBio }, styles.floatInput)}>
          <Label>Biografia:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
            onEndEditing={() => bioColor.call(this, this.state.bio)}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Tags:</Label>
          <Input
            value={this.state.tags}
            disabled
            onChangeText={(tags) => this.setState({ tags })}
          ></Input>
        </Item>

        {this.state.isEditado ? <Text> Editado com sucesso </Text> : <Text />}

        <Button style={styles.button} onPress={this.membersList}>
          <Text style={styles.buttonText}> Lista de Membros </Text>
        </Button>

        <Button style={styles.button} onPress={this.editRep}>
          <Text style={styles.buttonText}> Editar </Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(RepCRUD);
