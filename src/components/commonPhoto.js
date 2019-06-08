import { firebase } from '../../Firebase'
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-picker'
import { Platform } from 'react-native'

const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const fs = RNFetchBlob.fs
const options = {
  title: 'Foto de Perfil',
  takePhotoButtonTitle: 'Enviar da Câmera',
  chooseFromLibraryButtonTitle: 'Enviar da Biblioteca'
}

getUrl = async () => {
  const imageName = state.admUID;
  const imageRef = firebase.storage().ref('repImages');
  await imageRef.child(imageName).getDownloadURL().then((url) => {
    setState({ photoURL: url, gotUrl: true })
  }).catch((error) => {
    //reject(error)
  });
}

uploadImage = (admUID, uri, mime = 'image/jpg') => {
  return new Promise((resolve, reject) => {
    const imageName = admUID
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

imageSelect = (admUID, updateStateCallback) => {
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      uploadImage(admUID, response.uri)
        .then((url) => {
          alert('uploaded');
          updateStateCallback(url)
        })
        .catch(error => console.log(error))
    }
  });
}

module.exports = { imageSelect };