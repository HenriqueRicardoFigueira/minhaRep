import React, { Component } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

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

  editRep = () => {
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

          <Image
            style={{ width: 100, height: 100 }}
            disabled={!this.state.gotUrl}
            source={{ uri: this.state.photoURL }} 
          />

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
            <Label>Cep:</Label>
            <Input
              value={this.state.cep}
              onChangeText={(cep) => this.setState({ cep })}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}>
            <Label>Numero da Casa:</Label>
            <Input
              value={this.state.numberHome}
              onChangeText={(numberHome) => this.setState({ numberHome })}
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
