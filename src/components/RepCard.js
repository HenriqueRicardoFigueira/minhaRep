import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { input, styles } from '../components/styles';
import { Icon } from 'react-native-elements';

export default class RepCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      repTitle: props.title,
      repImage: props.imageLink
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* O cartão que será 'arrastado' */}
        <View style={styles.card}>

          {/* VIEW SUPERIOR */}
          <View style={styleSwipe.view1}>
            {/* View com a foto */}
            <View>
              <Image style={styleSwipe.iconPhoto} source={require('../image/houseIcon.png')} />
            </View>
            {/* View com o nome da rep e as tags */}
            <View>
              <Text style={styleSwipe.repTitle}>{this.state.repTitle}</Text>
              <View style={styleSwipe.iconsView}>
                <Icon size={15} reverse name='ios-american-football' type='ionicon' color='#517fa4' />
                <Icon size={15} raised name='heartbeat' type='font-awesome' color='#f50' onPress={() => alert('hello')} />
                <Icon size={15} reverse name='ios-american-football' type='ionicon' color='#517fa4' />
                <Icon size={15} raised name='heartbeat' type='font-awesome' color='#f50' onPress={() => alert('hello')} />
              </View>
            </View>
          </View>

          {/* VIEW INTERMEDIÁRIA */}
          <View>
            <Image style={styleSwipe.repImage} source={this.getImage()} />
          </View>

          {/* TERCEIRA VIEW */}
          <View>
            <View style={styleSwipe.iconsView}>
              <Icon size={25} reverse name='ios-american-football' type='ionicon' color='#517fa4' />
              <Icon size={25} raised name='heartbeat' type='font-awesome' color='#f50' onPress={() => alert('hello')} />
              <Icon size={25} reverse name='ios-american-football' type='ionicon' color='#517fa4' />
              <Icon size={25} raised name='heartbeat' type='font-awesome' color='#f50' onPress={() => alert('hello')} />
            </View>
          </View>

          {/* VIEW FINAL */}
          <View>

          </View>
        </View>
      </View>
    );
  }

  // se for passado uma imagem para o componente, então recupera pelo link
  // se não, recupera localmente a imagem
  getImage = () => {
    if(this.state.repImage == '../image/houseIcon.png') {
      return require('../image/houseIcon.png');
    } else {
      return { uri: this.state.repImage }
    }
  }
};

const styleSwipe = StyleSheet.create({
  view1: {
    padding: 5,
    flexDirection: 'row',
  },
  iconPhoto: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#ffb380',
  },
  repTitle: {
    width: 190,
    fontSize: 25,
    paddingLeft: 5,
    color: '#ff6600',
    flexDirection: 'column',
  },
  iconsView: {
    flexDirection: 'row',
  },
  repImage: {
    width: styles.card.width - 20,
    height: styles.card.height / 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#8c8c8c',
    borderWidth: 3,
  }
});


// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
  imageLink: '../image/houseIcon.png'
}