import React, { Component } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Button, Input, Label, Item, } from 'native-base'
import { withNavigation } from 'react-navigation'
import { firebase } from '../../Firebase'
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { styles } from './styles'
import { nameColor, bioColor, numberColor } from '../formValidation';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const options = {
  title: 'Foto de Perfil',
  takePhotoButtonTitle: 'Enviar da Câmera',
  chooseFromLibraryButtonTitle: 'Enviar da Biblioteca'
}

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
      uid: '',

      isSubmited: false,

      avatarSource: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/repImages%2FDefaultRepPic.jpg?alt=media&token=60298d1d-c5f4-42d2-964b-58504da8bd0d',
      gotUrl: false,
      uri: '',

      borderColorBio: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
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
      uid: user.uid,
    })
    this.getUrl();
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
    })
  }

  getLocalization = () => {
    axios.get('https://maps.google.com/maps/api/geocode/json?address=' + this.state.logradouro + ',' + this.state.numberHome + ','
      + this.state.city + ',' + this.state.uf + '&components=country:BR&key=AIzaSyDTwm8jKEXByLoOxH3PgIF4SaU2RbLhJrg').then((response) => {
        if (response) {
          this.setState({
            latitude: response.data.results["0"].geometry.location.lat,
            longitude: response.data.results["0"].geometry.location.lng,
          })

        }
      })
  }

  addRep = () => {
    const { name, bio, members } = this.state;

    if (!this.canRegister(name, bio, members)) {
      return
    }

    this.ref.doc(this.state.uid).set({

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
      gotUrl: true,
      
    });
    this.props.navigation.navigate("Home");
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
      reject(error)
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

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)} >
            <Label>Nome da república:</Label>
            <Input
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              onEndEditing={() => nameColor.call(this, this.state.name)}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBio, marginTop: styles.floatInput.marginTop }, styles.floatInput)} >
            <Label>Descrição:</Label>
            <Input
              value={this.state.bio}
              onChangeText={(bio) => this.setState({ bio })}
              onEndEditing={() => bioColor.call(this, this.state.bio)}
            ></Input>
          </Item>

          <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumber }, styles.floatInput)} >
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
          
          <Button style={styles.button} onPress={this.imageSelect}>
            <Text style={styles.buttonText}> Enviar Foto </Text>
          </Button>

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