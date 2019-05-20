import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Platform } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import axios from 'axios';
import { nameColor, memberColor, bioColor, cepColor, genericColor } from '../formValidation'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const options = {
  title: 'Foto de Perfil',
  takePhotoButtonTitle: 'Enviar da Câmera',
  chooseFromLibraryButtonTitle: 'Enviar da Biblioteca'
}

class RepCRUD extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('republics');
    //this.imgRef = firebase.storage().ref().child('republicsImages');

    this.state = {
      admUID: '',
      bio: '',
      members: '',
      name: '',
      tags: '',

      avatarSource: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/repImages%2FDefaultRepPic.jpg?alt=media&token=60298d1d-c5f4-42d2-964b-58504da8bd0d',
      gotUrl: false,
      uri: '',


      isEditado: false,
      boolLocalization: false,
      borderColorBio: '#e6e6e6',
      borderColorCep: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
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

            name: repDatas.name,
            bio: repDatas.bio,
            members: repDatas.members,
            numberHome: repDatas.numberHome,
            street: repDatas.street,
            cep: repDatas.cep,
            city: repDatas.city,
            uf: repDatas.uf,
            latitude: repDatas.latitude,
            longitude: repDatas.longitude,
            tags: repDatas.tags,
            admUID: repDatas.admUID,
            photoURL: repDatas.photoURL,
            gotUrl: repDatas.gotUrl,

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
    boolNumberHome = genericColor()

    return boolBio && boolName && boolMember && this.state.boolLocalization && this.getLocalization()
  }

  editRep = () => {

    const { name, members, bio, cep, numberHome } = this.state;

    if (!this.canRegister(name, bio, members, cep, numberHome)) {
      return
    }

    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
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
        admUID: this.state.uid,
        photoURL: this.state.photoURL,
        gotUrl: this.state.gotUrl,
      });
    this.setState({ isEditado: true });
  }

  membersList = () => {
    this.props.navigation.navigate("MembersList");
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
    if(!genericColor.call(this, this.state.numberHome, /^[0-9][0-9]*/, 'borderColorNumberHome')) {
      return
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
  }

  imageSelect = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.uploadImage(response.uri)
          .then((url) => {
            alert('uploaded');
            this.setState({ photoURL: url, gotUrl: true });
            console.log(this.state.photoURL)
          })
          .catch(error => console.log(error))
        this.getUrl();
      }
    });
  }

  getUrl = async () => {
    const imageName = this.state.uid;
    const imageRef = firebase.storage().ref('repImages');
    await imageRef.child(imageName).getDownloadURL().then((url) => {
      this.setState({ photoURL: url, gotUrl: true })
    }).catch((error) => {
      //reject(error)
    });
  }

  uploadImage = (uri, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const imageName = this.state.uid
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

      let uploadBlob = null
      const imageRef = firebase.storage().ref('repImages').child(imageName);
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob._ref, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>

          <Image
            style={{ width: 100, height: 100 }}
            disabled={!this.state.gotUrl}
            source={{ uri: this.state.photoURL }}
          />

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

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorCep }, styles.floatInput)}>
            <Label>Cep:</Label>
            <Input
              keyboardType='number-pad'
              value={this.state.cep}
              onChangeText={(cep) => this.setState({ cep })}
              onEndEditing={() => this.searchAdress(this.state.cep)}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumberHome }, styles.floatInput)}>
            <Label>Numero da Casa:</Label>
            <Input
              keyboardType='number-pad'
              value={this.state.numberHome}
              onChangeText={(numberHome) => this.setState({ numberHome })}
              onEndEditing={() => {this.getLocalization()}}
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

          <Button style={styles.button} onPress={this.imageSelect}>
            <Text style={styles.buttonText}> Enviar Foto </Text>
          </Button>

          <Button style={styles.button} onPress={this.editRep}>
            <Text style={styles.buttonText}> Editar </Text>
          </Button>

        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(RepCRUD);
