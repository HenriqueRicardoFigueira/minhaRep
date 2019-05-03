import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Profile Pic',
  takePhotoButtonTitle: 'Use Your Camera',
  chooseFromLibraryButtonTitle: 'Open From Library'
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
      imgUrl: '',
      uri: '',

      isEditado: false
    };
  }

  /* CAMPOS DA DATABASE 
    bio,
    email,
    uid,
    age,
    name
  */


  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.ref.doc(user.uid)
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
            imgUrl: userP.imgUrl
          })
        } else {
          console.log("Não existe usuário");
        }
      })
  }

  imageUpload = (uri, imageName, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const imageRef = firebase.storage().ref().child('userImages').child(imageName);

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
  }

  imageSelect = () => {
    ImagePicker.showImagePicker(options, (response) => { // ABRE A TELA DE GALERIA OU CAMERA
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        this.setState({
          avatarSource: source,
        });
        this.imageUpload(source.uri, this.state.uid); // UPA A FOTO PARA A STORAGE COM O NOME this.state.uid

        // A PARTIR DAQUI TA CAGADO
        const url = firebase.storage().ref().child('userImages').child(this.state.uid).getDownloadURL().then(function(url) {
          return url;
        }); // ESSA DROGA DE FUNÇÃO RETORNA UM OBJETO NAO UMA STRING

        this.setState({
          imgUrl: url // ESTÁ ADCIONANDO ESSE OBJETO NO STATE
        });
        this.editUser(); // ATUALIZA O DATABASE MAS ATUALIZA ERRADO
      }
    });
  }

  editUser = () => {
    const { age, name, bio, email, imgUrl } = this.state;
    var user = firebase.auth().currentUser;
    this.ref.doc(user.uid)
      .set({
        bio: bio,
        email: email,
        uid: user.uid,
        age: age,
        name: name,
        imgUrl: imgUrl
      });
    this.setState({ isEditado: true });
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.avatarSource ? <Thumbnail source={{ uri: this.state.imgUrl }} /> : <Text />}

        <Item floatingLabel style={styles.floatInput}>
          <Label>Nome:</Label>
          <Input
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Email:</Label>
          <Input
            value={this.state.email}
            disabled
            onChangeText={(email) => this.setState({ email })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Idade:</Label>
          <Input
            value={this.state.age}
            keyboardType='number-pad'
            onChangeText={(age) => this.setState({ age })}
          ></Input>
        </Item>

        <Item floatingLabel style={styles.floatInput}>
          <Label>Biografia:</Label>
          <Input
            value={this.state.bio}
            onChangeText={(bio) => this.setState({ bio })}
          ></Input>
        </Item>

        <Button style={styles.button} onPress={this.imageSelect}>
          <Text style={styles.buttonText}> Enviar Foto </Text>
        </Button>

        {this.state.isEditado ? <Text> Editado com sucesso </Text> : <Text />}

        <Button style={styles.button} onPress={this.editUser}>
          <Text style={styles.buttonText}> Editar </Text>
        </Button>

      </View>
    );
  }
}

export default withNavigation(UserProfile);