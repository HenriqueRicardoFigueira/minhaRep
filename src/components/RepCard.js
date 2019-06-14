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
import createMessage from './message';
import { Body } from 'native-base';
import firebaseSvc from './FirebaseSvc';

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp*/) {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

class RepCard extends Component {

  constructor(props) {
    super(props);

    this.dragTo = props.dragTo

    this.repIds = [],

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
      localization: props.rep.localization,
      bio: props.rep.bio,
      city: props.rep.city,

      name: '',
      email: '',
      photoURL: '',

    }
  }

  get user() {
    return {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.photoURL,
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }

  componentDidMount = async () => {
    var userUid = firebaseSvc.uid;
    await this.refUsers
      .doc(userUid)
      .get()
      .then((userData) => {
        if (userData.exists) {
          const userP = userData.data();
          this.setState({
            name: userP.name,
            email: userP.email,
            photoURL: userP.photoURL,
          })
        } else {
          console.log("Não existe usuário");
        }
      })
  }

  descView = () => {
    var rep = this.state
    console.log("chameeeiiii");
    this.props.navigation.navigate("Description", { rep });
  }

  mapView = () => {
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    this.props.navigation.navigate("Maps", { latitude, longitude });
  }

  componentWillMount() {

    console.log("entrou na componentWillMount da repcard");

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

    console.log('saiu da willmount da repcard')
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
                    <MaterialCommunityIcons name='close' size={this.iconSize} color='#8002ff' />
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
                    <MaterialCommunityIcons name='check' size={this.iconSize} color='#e102ff' />
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
      .set(createMessage('Agora vocês podem trocar mensagem', this.user)).then({})
    await this.newChat;
    this.props.navigation.navigate("ChatList", { repId }); // VAI PARA O CHAT LEVANDO O REP ID
  }

  newChat = async () => {

    var uid = firebaseSvc.uid;
    await firebase.firestore() // PUXA CONVERSAS JA EXISTENTES NO DOCUMENTO
      .collection('chats')
      .doc(uid)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          var data = doc.data().repIds;
          data.forEach(repId => { // COLOCA AS CONVERSAS EM UM ARRAY NO STATE
            this.repIds.push(repId)
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

    await firebase.firestore() // COLOCA AS CONVERSAS NO BANCO
      .collection('chats')
      .doc(uid)
      .set({
        repIds: this.repIds
      })

  }


  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)

    if (this.dragTo.drag == 'SIM') {  // realiza o match
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