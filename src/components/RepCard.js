import React, { Component } from 'react';
import { View, /*Image,*/ Text, Alert, TouchableOpacity } from 'react-native';
import { styles } from '../components/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { EventRegister } from 'react-native-event-listeners'
import { withNavigation } from 'react-navigation';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { firebase } from '../../Firebase';
import { createMessage} from './message';
import { Body } from 'native-base';

class RepCard extends Component {

  constructor(props) {
    super(props);

    this.dragTo = props.rep.dragTo
    this.removeSim = props.rep.removeSim
    this.removeNao = props.rep.removeNao

    this.state = {
      iImage: 0,
      id: props.rep.id,
      bed: props.rep.bed,
      title: props.rep.title,
      value: props.rep.value,
      members: props.rep.members,
      currentIndex: props.rep.index,
      latitude: props.rep.latitude,
      bathroom: props.rep.bathroom,
      repImage: props.rep.photoURL,
      longitude: props.rep.longitude,
      vacancies: props.rep.vacancies,
      tags: props.rep.tags,
      localization: props.rep.localization,
      bio: props.rep.bio,
      city: props.rep.city,
      currentIndexFunc: props.rep.currentIndexFunc
    }
  }


  descView = () => {
    var rep = this.state
    this.props.navigation.navigate("Description", { rep });
  }

  mapView = () => {
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    this.props.navigation.navigate("Maps", { latitude, longitude });
  }

  componentWillMount() {
    var qtd = this.state.vacancies
    this.state.vacancies = qtd > 1 ? qtd + ' Vagas' : qtd + ' Vaga'
    this.iconSize = Math.floor(styles.screen.width * 0.08)

    this.listener = EventRegister.addEventListener('changeImage', (info) => {
      this.setState((state) => {
        // isso evita que o card sobreposto atualize também
        if (this.state.currentIndex != info.currentIndex) {
          return
        }

        if (info.pos == -1 && state.iImage == 0) {
          // retorna a ultima posição da lista de imagens
          return { iImage: state.repImage.length }
        } else {
          // avança ou retarda na lista de imagens
          return { iImage: state.iImage + info.pos }
        }
      })
    })
  }

  render() {
    return (
      <View style={styles.containerCard} >

        {/* O cartão que será 'arrastado' */}
        <View style={styles.card}>
          {/* VIEW SUPERIOR */}
          <Body>
            <View style={styles.viewImage}>
              <Image style={styles.repImage} source={this.getImage()} indicator={ProgressBar} />
              <View style={styles.viewText}>
                <Text style={styles.repTitle}>{this.state.vacancies}</Text>
                <Text style={styles.repTitle}>{this.state.title}</Text>
                <Text style={styles.repLocalization}>{this.state.localization}</Text>
              </View>
            </View>

            {/* VIEW ICONES */}
            <View>
              <Body>
                <View style={styles.iconView}>
                  {/*BOTÃO NÃO */}
                  <View style={styles.iconViewText}>
                    <MaterialCommunityIcons name='close' size={this.iconSize} color='#8002ff' onPress={() => { this.remove('NAO', this.removeNao, 1) }} />
                  </View>
                  {/*icone banheiros*/}
                  <View style={styles.iconViewText} >
                    <View style={styles.icon} >
                      <FontAwesome name='bathtub' size={this.iconSize * 0.8} color='#c6dcf4' onPress={() => Alert.alert('', 'Quantidade de Banheiros', [{ text: 'OK' }])} />
                    </View>
                    <Text style={styles.iconText}>{this.state.bathroom}</Text>
                  </View>
                  {/*icone quartos*/}
                  <View style={styles.iconViewText} >
                    <View style={styles.icon} >
                      <MaterialCommunityIcons name='hotel' size={this.iconSize} color='#c6dcf4' onPress={() => Alert.alert('', 'Quantidade de Quartos', [{ text: 'OK' }])} />
                    </View>
                    <Text style={styles.iconText}>{this.state.bed}</Text>
                  </View>
                  {/*icone membros*/}
                  <View style={styles.iconViewText}>
                    <View style={styles.icon} >
                      <MaterialCommunityIcons name='account-group' size={this.iconSize} color='#c6dcf4' onPress={() => Alert.alert('', 'Quantidade de Membros', [{ text: 'OK' }])} />
                    </View>
                    <Text style={styles.iconText}>{this.state.members.length}</Text>
                  </View>
                  {/*icone preco*/}
                  <View style={styles.iconViewText}>
                    <View style={styles.icon} >
                      <MaterialCommunityIcons name='cash' size={this.iconSize} color='#c6dcf4' onPress={() => Alert.alert('', 'Preço do Aluguel', [{ text: 'OK' }])} />
                    </View>
                    <Text style={styles.iconText}>{this.state.value}</Text>
                  </View>
                  {/*BOTÃO SIM*/}
                  <View style={styles.iconViewText}>
                    <MaterialCommunityIcons name='check' size={this.iconSize} color='#e102ff' onPress={() => { this.remove('SIM', this.removeSim, 1) }} />
                  </View>
                  <View>
                    <MaterialCommunityIcons name='information-outline' color='#c6dcf4' size={this.iconSize} onPress={this.descView} />
                  </View>
                </View>
              </Body>
            </View>
          </Body>
        </View>

      </View>
    );
  }

  remove = (size, callback, param) => {
    callback({ dy: param }, 10)
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

  addInChat = async (uid, repId) => {
    chatRef = firebase.firestore().collection('chats').doc(uid)
    await chatRef.get().then((data) => {

      if(data.exists) {
        repIds = data.data().repIds ? data.data().repIds : []
        repIds.push(repId)
        chatRef.update({
          repIds: repIds
        })
      } else {
        firebase.firestore().collection('chats').doc(uid).set({repIds: [repId]})
      }
    })
  }

  match = async () => {
    repId = this.state.id
    uid = firebase.auth().currentUser.uid

    // o dono da república é o usuário
    if (repId == uid) {
      return
    }

    await firebase.firestore()
      .collection('chats')
      .doc(uid)
      .collection(repId)
      .doc('minicial')
      .set(await createMessage('Você tem um novo match', uid, {exists: false}))

    // adiciona na lista de conversas de ambos
    await this.addInChat(uid, repId)
    await this.addInChat(repId, uid)

    this.props.navigation.navigate('Chat', { repId });
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)

    // realiza o match e
    // evita que a rep que está por 'baixo' também dê um match
    if (this.dragTo.drag == 'SIM' && this.state.currentIndex == this.state.currentIndexFunc()-1) {
      this.match()
    } else {
      // do nothing
    }
  }
};

// propriedades padrão do componente
RepCard.defaultProps = {
  title: 'Título da República',
}

export default withNavigation(RepCard)