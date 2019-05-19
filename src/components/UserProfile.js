import React, { Component } from 'react';
import { View, Text, Platform, Image, ScrollView } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { firebase } from '../../Firebase'
import { nameColor, emailColor, ageColor, bioColor } from '../formValidation';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const options = {
  title: 'Foto de Perfil',
  takePhotoButtonTitle: 'Enviar da Câmera',
  chooseFromLibraryButtonTitle: 'Enviar da Biblioteca'
}

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.ref = firebase.firestore().collection('users');
    //this.imgRef = firebase.storage().ref().child('userImages');

    this.state = {
      name: '', //EDITAVEL
      email: '', //
      password: '', //
      age: '', //EDITAVEL
      bio: '', //EDITAVEL
      uid: '', //PK

      avatarSource: null,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/minharep-6c7ba.appspot.com/o/userImages%2FDefaultUserPic.jpg?alt=media&token=0abdf2ac-06de-4ca6-b79d-7c1c08981381',
      gotUrl: false,
      uri: '',

      isEditado: false,

      borderColorAge: '#e6e6e6',
      borderColorBio: '#e6e6e6',
      borderColorName: '#e6e6e6',
      borderColorEmail: '#e6e6e6',
      borderColorNumber: '#e6e6e6',
    };
    //this.componentDidMount();
    //this.getUrl();
  }

  /* CAMPOS DA DATABASE 
    bio,
    email,
    uid,
    age,
    name
  */


  componentDidMount = async () => {
    var user = firebase.auth().currentUser;

    await this.ref.doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            email: userP.email,
            bio: userP.bio,
            age: userP.age,
            uid: user.uid,
          })
        } else {
          console.log("Não existe usuário");
        }
      })
    this.getUrl();
  }

  getUrl = async () => {
    const imageName = this.state.uid;
    const imageRef = firebase.storage().ref('userImages');
    await imageRef.child(imageName).getDownloadURL().then((url) => {
      this.setState({ photoURL: url, gotUrl: true })
    }).catch((error) => {
      reject(error)
    });
    this.editUser();
    console.log(this.state.photoURL)
  }

  uploadImage = (uri, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const imageName = this.state.uid
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

      let uploadBlob = null
      const imageRef = firebase.storage().ref('userImages').child(imageName);
      //console.log(typeof(imageName))
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

  /*imageUpload = (uri, imageName, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const imageRef = firebase.storage().ref('userImages').child(imageName);

      imageRef.put(uploadUri, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }*/

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

  canRegister = (name, email, age, bio) => {
    // se fizer as chamadas de função no retorno
    // só vai alterar a cor do primeiro que estiver fora do padrão
    boolBio = bioColor.call(this, bio)
    boolAge = ageColor.call(this, age)
    boolName = nameColor.call(this, name)
    boolEmail = emailColor.call(this, email)

    return boolBio && boolAge && boolName && boolEmail
  }

  editUser = () => {
    const { age, name, bio, email, photoURL } = this.state;

    if (!this.canRegister(name, email, age, bio)) {
      return
    }

    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
        bio: bio,
        email: email,
        uid: user.uid,
        age: age,
        name: name,
        photoURL: photoURL,
        gotUrl: true
      });
    this.setState({ isEditado: true });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>

          {this.state.avatarSource ? <Thumbnail source={{ uri: this.state.photoURL }} /> : <Text />}

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorName }}>
            <Label>Nome:</Label>
            <Input
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
              onEndEditing={() => nameColor.call(this, this.state.name)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorEmail }}>
            <Label>Email:</Label>
            <Input
              value={this.state.email}
              disabled
              onChangeText={(email) => this.setState({ email })}
              onEndEditing={() => emailColor.call(this, this.state.email)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorAge }}>
            <Label>Idade:</Label>
            <Input
              value={this.state.age}
              keyboardType='number-pad'
              onChangeText={(age) => this.setState({ age })}
              onEndEditing={() => ageColor.call(this, this.state.age)}
            ></Input>
          </Item>

          <Item floatingLabel style={styles.floatInput}
            style={{ borderColor: this.state.borderColorBio }}>
            <Label>Biografia:</Label>
            <Input
              value={this.state.bio}
              onChangeText={(bio) => this.setState({ bio })}
              onEndEditing={() => bioColor.call(this, this.state.bio)}
            ></Input>
          </Item>
          <Image
            style={{ width: 100, height: 100 }}
            disabled={!this.state.gotUrl}
            source={{ uri: this.state.photoURL }} />
          <Button style={styles.button} onPress={this.imageSelect}>
            <Text style={styles.buttonText}> Enviar Foto </Text>
          </Button>

          {this.state.isEditado ? <Text> Editado com sucesso </Text> : <Text />}

          <Button style={styles.button} onPress={this.editUser}>
            <Text style={styles.buttonText}> Editar </Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(UserProfile);