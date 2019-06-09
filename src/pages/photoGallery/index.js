import Gallery from 'rep-gallery'
import React, { Component } from 'react'
import { withNavigation } from 'react-navigation'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton'

class PhotoGallery extends Component {

  constructor(props) {
    super(props)

    const { navigation } = this.props
    this.photoURL = navigation.getParam('photoURL')
  }

  componentWillMount () {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCRUD', {photoURL: this.photoURL})
  }

  createObjects = () => { 
    this.photoURLReal = this.photoURL.map((link) => {
      return {id: link, source: { uri: link }}
    })
  }

  doneURL = (delPhotos) => {
    for(var url in delPhotos) {
      for(var index = 0; index < this.photoURL.length; index ++) {
        if(url.id == this.photoURL[index].id) {
          this.photoURL.splice(index, 1)
          break
        }
      }
    }
  }

  render() {

    this.createObjects()

    return (
        <Gallery photos={this.photoURLReal} callback={this.doneURL} />
    );
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}

export default withNavigation(PhotoGallery);