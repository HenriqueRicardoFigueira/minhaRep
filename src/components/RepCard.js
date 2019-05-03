import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { styles } from '../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RepCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bed: props.rep.bed,
      title: props.rep.title,
      price: props.rep.price,
      users: props.rep.users,
      bathroom: props.rep.bathroom,
      repImage: props.rep.imageLink,
      vacancies: props.rep.vacancies,
      localization: props.rep.localization,
    }
  }

  componentWillMount() {
    var qtd = this.state.vacancies
    this.state.vacancies = qtd > 1 ? qtd + ' Vagas' : qtd + ' Vaga'
    this.iconSize = Math.floor(styles.screen.width * 0.11)
  }

  render() {
    return (
      <View style={styles.container} >
        {/* O cartão que será 'arrastado' */}
        <View style={styles.card}>
          {/* VIEW SUPERIOR */}
          <View style={styleSwipe.viewImage}>
            <Image style={styleSwipe.repImage} source={this.getImage()} />
            <View style={styleSwipe.viewText}>
              <Text style={styleSwipe.repTitle}>{this.state.vacancies}</Text>
              <Text style={styleSwipe.repTitle}>{this.state.title}</Text>
              <Text style={styleSwipe.repLocalization}>{this.state.localization}</Text>
            </View>
          </View>

          {/* VIEW ICONES */}
          <View>
            <View style={styleSwipe.iconView}>
              {/*icone banheiros*/}
              <View style={styleSwipe.iconViewText} >
                <View style={styleSwipe.icon} >
                  <Icon name='bathtub' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} />
                </View>
                <Text style={styleSwipe.iconText}>{this.state.bathroom}</Text>
              </View>
              {/*icone quartos*/}
              <View style={styleSwipe.iconViewText} >
                <View style={styleSwipe.icon} >
                  <Icon name='bed' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Camas', [{ text: 'OK' }])} />
                </View>
                <Text style={styleSwipe.iconText}>{this.state.bed}</Text>
              </View>
              {/*icone membros*/}
              <View style={styleSwipe.iconViewText}>
                <View style={styleSwipe.icon} >
                  <Icon name='users' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Membros', [{ text: 'OK' }])} />
                </View>
                <Text style={styleSwipe.iconText}>{this.state.users}</Text>
              </View>
              {/*icone preco*/}
              <View style={styleSwipe.iconViewText}>
                <View style={styleSwipe.icon} >
                  <Icon name='money' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Preço do Aluguel', [{ text: 'OK' }])} />
                </View>
                <Text style={styleSwipe.iconText}>{this.state.price}</Text>
              </View>
              {/*icone mapa*/}
              <View style={styleSwipe.iconViewText}>
                <View style={styleSwipe.icon} >
                  <Icon name='map-o' size={35} color='#000' />
                </View>
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
    paddingTop: styles.screen.height * 0.58,
    position: 'absolute',
  },
  repTitle: {
    fontSize: 20,
    color: '#ffffff',
  },
  repLocalization: {
    fontSize: 15,
    color: '#ffffff',
  },
  iconView: {
    padding: 7,
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
    height: styles.card.height * 0.80,
  },
  iconViewText: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconText: {
    fontSize: 15
  }
});

// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
  imageLink: '../image/houseIcon.png'
}