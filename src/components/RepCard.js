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
          <View style={styleSwipe.view1}>
            {/* View com a foto */}
            <View>
              <Image style={styleSwipe.iconPhoto} source={require('../image/houseIcon.png')} />
            </View>
            {/* View com o nome da rep e as tags */}
            <View>
              <Text style={styleSwipe.repTitle}>{this.state.repTitle}</Text>
              <View style={styleSwipe.iconViewTop}>
                <Icon size={30} name='snowflake-o' color='#000' style={styleSwipe.iconTop} />
                <Icon size={30} name='wheelchair-alt' color='#000' style={styleSwipe.iconTop} />
                <Icon size={30} name='bicycle' color='#000' style={styleSwipe.iconTop} />
                <Icon size={30} name='youtube' color='#000' style={styleSwipe.iconTop} />
                <Icon size={30} name='steam' color='#000' style={styleSwipe.iconTop} />
              </View>
            </View>
          </View>

          {/* VIEW INTERMEDIÁRIA */}
          <View>
            <Image style={styleSwipe.repImage} source={this.getImage()} />
          </View>

          {/* TERCEIRA VIEW */}
          <View>
            <View style={styleSwipe.iconViewButton}>
              <View style={styleSwipe.iconButton} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{text: 'OK'}])} >
                <Icon name='bathtub' size={35} color='#000' />
              </View>
              <View style={styleSwipe.iconButton} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{text: 'OK'}])} >
                <Icon name='bed' size={35} color='#000' onPress={() => Alert.alert('', 'Quantidade de Camas', [{text: 'OK'}])} />
              </View>
              <View style={styleSwipe.iconButton} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{text: 'OK'}])} >
                <Icon name='users' size={35} color='#000' onPress={() => Alert.alert('', 'Quantidade de Membros', [{text: 'OK'}])} />
              </View>
              <View style={styleSwipe.iconButton} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{text: 'OK'}])} >
                <Icon name='money' size={35} color='#000' onPress={() => Alert.alert('', 'Preço do Aluguel', [{text: 'OK'}])} />
              </View>
              <View style={styleSwipe.iconButton} onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{text: 'OK'}])} >
                <Icon name='map-o' size={35} color='#000' onPress={() => Alert.alert('', 'Mapa da República', [{text: 'OK'}])} />
              </View>
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
    if (this.state.repImage == '../image/houseIcon.png') {
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
    width: styles.screen.width*0.25,
    height: styles.screen.width*0.25,
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
  iconViewTop: {
    flexDirection: 'row',
    paddingRight: 10,
    justifyContent: 'space-between',
    width: styles.screen.width*0.5,
  },
  iconTop: {
    margin: 2,
    backgroundColor: '#ff944d',
  },
  iconViewButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    width: styles.screen.width*0.85,
  },
  iconButton: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff944d',
    width: styles.screen.width*0.17,
    height: styles.screen.width*0.17,
  },
  repImage: {
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: '#8c8c8c',
    width: styles.card.width*0.95,
    height: styles.card.height*0.6,
  }
});


// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
  imageLink: '../image/houseIcon.png'
}