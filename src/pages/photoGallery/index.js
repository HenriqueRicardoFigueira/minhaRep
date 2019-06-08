import Gallery from 'rep-gallery'
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton'

class PhotoGallery extends Component {

  constructor(props) {
    super(props)

    const { navigation } = this.props
    this.photoURL = navigation.getParam('photoURL')
  }

  componentWillMount () {
    handleAndroidBackButton(this.props.navigation.navigate, 'RepCRUD')
  }

  createObjects = () => { 
    this.photoURLReal = this.photoURL.map((link) => {
      return {id: link, source: { uri: link }}
    })
  }

  render() {

    this.createObjects()

    return (
      <Gallery photos={this.photoURLReal} />
    );
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}

export default withNavigation(PhotoGallery);