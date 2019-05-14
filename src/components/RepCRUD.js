import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import {firebase} from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';

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
      isEditado: false
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

  editRep = () => {
    const { admUID, bio, members, name, tags } = this.state;
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

  render() {
    return (
      <View style={styles.container}>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Nome da Republica:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Numero de Membros:</Label>
          <Input
            value={this.state.members}
            keyboardType='number-pad'
            onChangeText={(members) => this.setState({ members })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Biografia:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
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

        <Button style={styles.button} onPress={this.editRep}>
          <Text style={styles.buttonText}> Editar </Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(RepCRUD);


/*
import React, { Component } from 'react'
import { View, ScrollView, Text, Button, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { Form, Input, Label, Item, Container, Content, Accordion, Header } from 'native-base'
import { withNavigation, createSwitchNavigator, createAppContainer } from 'react-navigation'

import firebase from 'react-native-firebase'


// import { Container } from './styles';

class RepCRUD extends Component {
    constructor(props) {
        super(props)
        this.ref = firebase.firestore().collection('republics');
        this.state = {
            isLoading: true,
            republics: [
            ],
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        const republics = [];
        querySnapshot.forEach((rep) => {
            const { name, bio, members, tags } = rep.data();
            republics.push({
                key: rep.id,
                name, bio, members, tags
            });
            this.setState({
                republics,
                isLoading: false,

            })
        });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    };

    renderHeader = (item) => {
        return (
            <View>
                <Text >
                    {item.name}
                </Text>
            </View>
        );
    }
    delRep(item){
        const {navigation} = this.props
        this.ref.doc(item.key).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        navigation.goBack();
    }

    renderContent = (item) => {
        return (
            <View>
                <Text>{item.bio}</Text>
                <Text>{item.members}</Text>
                <Text>{item.tags}</Text>
                <Container>
                    <Button title="Editar" onPress={() => this.props.navigation.navigate('RepEdit', {
                        repkey: `${JSON.stringify(item.key)}`
                    }) }/>
                    <Button title="Excluir" onPress={() => this.delRep(item)} />
                </Container>
            </View>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <ScrollView>
                <Container>
                    <Header />
                    <Content padder>
                        <Accordion
                            dataArray={this.state.republics}
                            animation={true}
                            expanded={true}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                        ></Accordion>
                    </Content>
                    <Button title="Adicionar Rep" onPress={() => this.props.navigation.navigate('RepForm')} />
                </Container>
            </ScrollView>
        );
    }
}
export default withNavigation(RepCRUD)*/
