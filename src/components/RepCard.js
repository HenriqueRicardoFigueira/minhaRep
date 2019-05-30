import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { styles } from '../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EventRegister } from 'react-native-event-listeners'

export default class RepCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      iImage: 0,
      bed: props.rep.bed,
      title: props.rep.title,
      value: props.rep.value,
      members: props.rep.members,
      latitude: props.rep.latitude,
      bathroom: props.rep.bathroom,
      repImage: props.rep.photoURL,
      longitude: props.rep.longitude,
      vacancies: props.rep.vacancies,
      localization: props.rep.localization,
    }
  }

  componentWillMount() {
    var qtd = this.state.vacancies
    this.state.vacancies = qtd > 1 ? qtd + ' Vagas' : qtd + ' Vaga'
    this.iconSize = Math.floor(styles.screen.width * 0.11)

    this.listener = EventRegister.addEventListener('changeImage', (pos) => {
      this.setState((state) => {
        if (pos == -1 && state.iImage == 0) {
          // retorna a ultima posição da lista de imagens
          return { iImage: state.repImage.length }
        } else {
          // avança ou retarda na lista de imagens
          return { iImage: state.iImage + pos }
        }
      })
    })
  }

  render() {
    return (
      <View style={styles.container} >
        {/* O cartão que será 'arrastado' */}
        <View style={styles.card}>
          {/* VIEW SUPERIOR */}
          <View style={styles.viewImage}>
            <Image style={styles.repImage} source={this.getImage()} />
            <View style={styles.viewText}>
              <Text style={styles.repTitle}>{this.state.vacancies}</Text>
              <Text style={styles.repTitle}>{this.state.title}</Text>
              <Text style={styles.repLocalization}>{this.state.localization}</Text>
            </View>
          </View>

          {/* VIEW ICONES */}
          <View>
            <View style={styles.iconView}>
              {/*BOTÃO NÃO */}
              <View style={styles.iconViewText}>
                <Icon name='close' size={this.iconSize} color='#FF0000' />
              </View>
              {/*icone banheiros*/}
              <View style={styles.iconViewText} >
                <View style={styles.icon} >
                  <Icon name='bathtub' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} />
                </View>
                <Text style={styles.iconText}>{this.state.bathroom}</Text>
              </View>
              {/*icone quartos*/}
              <View style={styles.iconViewText} >
                <View style={styles.icon} >
                  <Icon name='bed' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Quartos', [{ text: 'OK' }])} />
                </View>
                <Text style={styles.iconText}>{this.state.bed}</Text>
              </View>
              {/*icone membros*/}
              <View style={styles.iconViewText}>
                <View style={styles.icon} >
                  <Icon name='users' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Quantidade de Membros', [{ text: 'OK' }])} />
                </View>
                <Text style={styles.iconText}>{this.state.members.length}</Text>
              </View>
              {/*icone preco*/}
              <View style={styles.iconViewText}>
                <View style={styles.icon} >
                  <Icon name='money' size={this.iconSize} color='#000' onPress={() => Alert.alert('', 'Preço do Aluguel', [{ text: 'OK' }])} />
                </View>
                <Text style={styles.iconText}>{this.state.value}</Text>
              </View>
              {/*BOTÃO SIM*/}
              <View style={styles.iconViewText}>
                <Icon name='check' size={this.iconSize} color='#008000' />
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
    if (this.state.repImage == '../../image/houseIcon.png') {
      return require('../image/houseIcon.png');
    } else {
      var len = this.state.repImage.length
      return { uri: this.state.repImage[this.state.iImage % len] }
    }
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }
};

// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
}