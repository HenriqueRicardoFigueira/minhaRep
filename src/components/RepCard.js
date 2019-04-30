import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { input, styles } from '../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          <View style={styleSwipe.viewImage}>
            <Image style={styleSwipe.repImage} source={this.getImage()} />
            <View style={styleSwipe.viewText}>
              <Text style={styleSwipe.repTitle}>República Federativa do Bllll</Text>
              <Text style={styleSwipe.repLocalization}>Avenida Juscelino Kubtcheck</Text>
            </View>
          </View>

          {/* VIEW INTERMEDIÁRIA */}
          <View>
            <View style={styleSwipe.iconViewButton}>
              <View style={styleSwipe.icon} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} >
                <Icon name='bathtub' size={35} color='#000' />
              </View>
              <View style={styleSwipe.icon} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} >
                <Icon name='bed' size={35} color='#000' onPress={() => Alert.alert('', 'Quantidade de Camas', [{ text: 'OK' }])} />
              </View>
              <View style={styleSwipe.icon} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} >
                <Icon name='users' size={35} color='#000' onPress={() => Alert.alert('', 'Quantidade de Membros', [{ text: 'OK' }])} />
              </View>
              <View style={styleSwipe.icon} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} >
                <Icon name='money' size={35} color='#000' onPress={() => Alert.alert('', 'Preço do Aluguel', [{ text: 'OK' }])} />
              </View>
              <View style={styleSwipe.icon} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} >
                <Icon name='map-o' size={35} color='#000' onPress={() => Alert.alert('', 'Mapa da República', [{ text: 'OK' }])} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // se for passado uma imagem para o componente, então recupera pelo link
  // se não, recupera localmente a imagem
  getImage = () => {
    if (this.state.repImage == '../image/houseIcon.png') {
      return require('../image/houseIcon.png');
    } else {
      return { uri: this.state.repImage }
    }
  }
};

const styleSwipe = StyleSheet.create({
  viewImage: {
    paddingTop: 5,
    width: styles.screen.width * 0.97,
  },
  viewText: {
    paddingLeft: 5,
    paddingTop: styles.screen.height * 0.57,
    position: 'absolute',
  },
  repTitle: {
    fontSize: 22,
    color: '#ffffff',
  },
  repLocalization: {
    fontSize: 15,
    color: '#ffffff',
  },
  iconViewButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: styles.screen.width * 0.85,
  },
  icon: {
    margin: 1.8,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff944d',
    width: styles.screen.width * 0.17,
    height: styles.screen.width * 0.17,
  },
  repImage: {
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#8c8c8c',
    width: styles.card.width * 0.97,
    height: styles.card.height * 0.75,
  }
});

// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
  imageLink: '../image/houseIcon.png'
}