import React, { Component } from 'react';
import { Alert, View, Animated, PanResponder, Text, TextInput } from 'react-native';
import RepCard from '../../components/RepCard';
import { firebase } from '../../../Firebase'
import { styles } from '../../components/styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Swiper from 'react-native-swiper';
import ChatList from '../../components/ChatList'
import Options from '../options/index'
import { Header, Button, Right, Left, Body, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EventRegister } from 'react-native-event-listeners'
import { invite } from '../../components/message'

var Reps = [];
var RepsBusca = [];
var repMatchs = null
const photoURL = '../../image/houseIcon.png'

let pageIndex = 1;
let finalIndex = 1;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.iconSize = styles.screen.width * 0.06
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      filter: null,
      tabColors: ['#6F6F7F', '#eff7f9', '#6F6F7F', '#6F6F7F']
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-styles.screen.width / 2, 0, styles.screen.width / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

    // essa var será lida pelo card e verificado se ele foi para 'SIM' ou 'NÃO'
    // -1 para NÃO - esquerda; 1 para SIM - direita.
    this.dragTo = { drag: 'NONE' }
  }

  removeSim = (gestureState, speed) => {
    this.dragTo.drag = 'SIM'

    // adicionando na lista dos matchs
    repMatchs.push(Reps[this.state.currentIndex % Reps.length].id)

    Animated.spring(this.position, {
      tension: speed,
      toValue: { x: styles.screen.width + 100, y: gestureState.dy },
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 });
      })
    })
  }

  removeNao = (gestureState, speed) => {
    this.dragTo.drag = 'NAO'
    Animated.spring(this.position, {
      tension: speed,
      toValue: { x: -styles.screen.width - 100, y: gestureState.dy }
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 });
      })
    })
  }

  voltaAnimacao = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 },
      friction: 4
    }).start()
  }

  verificaCliqueFoto = (x0, y0) => {
    regionYmin = Math.floor(styles.screen.height * 0.785)
    regionYmax = Math.floor(styles.screen.height * 0.885)
    regionXmin = Math.floor(styles.screen.width * 0.03125)
    regionXmax = Math.floor(styles.screen.width * 0.98438)

    if (y0 * 0.922 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if (x0 >= Math.floor(styles.screen.width / 2)) {
        EventRegister.emit('changeImage', { pos: 1, currentIndex: this.state.currentIndex })  // avança a imagem
      } else {
        EventRegister.emit('changeImage', { pos: -1, currentIndex: this.state.currentIndex }) // retrocede a imagem
      }
    }
  }

  verificaCliqueFoto = (x0, y0) => {
    regionYmin = Math.floor(styles.screen.height * 0.785)
    regionYmax = Math.floor(styles.screen.height * 0.885)
    regionXmin = Math.floor(styles.screen.width * 0.03125)
    regionXmax = Math.floor(styles.screen.width * 0.98438)

    if (y0 * 0.922 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if (x0 >= Math.floor(styles.screen.width / 2)) {
        EventRegister.emit('changeImage', { pos: 1, currentIndex: this.state.currentIndex })  // avança a imagem
      } else {
        EventRegister.emit('changeImage', { pos: -1, currentIndex: this.state.currentIndex }) // retrocede a imagem
      }
    }
  }

  verificaCliqueFoto = (x0, y0) => {
    regionYmin = Math.floor(styles.screen.height * 0.785)
    regionYmax = Math.floor(styles.screen.height * 0.885)
    regionXmin = Math.floor(styles.screen.width * 0.03125)
    regionXmax = Math.floor(styles.screen.width * 0.98438)

    if (y0 * 0.89 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if (x0 >= Math.floor(styles.screen.width / 2)) {
        EventRegister.emit('changeImage', { pos: 1, currentIndex: this.state.currentIndex })  // avança a imagem
      } else {
        EventRegister.emit('changeImage', { pos: -1, currentIndex: this.state.currentIndex }) // retrocede a imagem
      }
    }
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        // se a distancia é igual a 0, então clicou
        if (gestureState.dx == 0 && gestureState.dy == 0) {
          this.verificaCliqueFoto(gestureState.x0, gestureState.y0)
        } else {    // não foi clicado, foi movido
          if (gestureState.dx > 120) {
            this.removeSim(gestureState, 12)
          } else if (gestureState.dx < -120) {
            this.removeNao(gestureState, 12)
          } else {
            this.voltaAnimacao()
          }
        }
      }
    })

    handleAndroidBackButton(exitAlert);
  }

  // deixa tudo minúsculo
  // remove ~ ´ ^ ç
  formatName = (name) => {
    return name.toLowerCase()
      .replace('ã', 'a')
      .replace('á', 'a')
      .replace('â', 'a')
      .replace('é', 'e')
      .replace('ê', 'e')
      .replace('í', 'i')
      .replace('õ', 'o')
      .replace('ô', 'o')
      .replace('ç', 'c')
  }

  renderReps = () => {
    RepsBusca = []
    if (this.state.filter != null) {
      for (i = 0; i < Reps.length; i++) {
        if (this.formatName(this.state.filter) == this.formatName(Reps[i].city)) {
          RepsBusca.push(Reps[i])
        }
      }
      return RepsBusca.map((item, i) => {
        if (i == this.state.currentIndex % RepsBusca.length && !this.isMatch(item.id)) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id} style={[this.rotateAndTranslate, { height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute' }]}>

              <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: '#e102ff', color: '#e102ff', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
              </Animated.View>

              <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: '#8002ff', color: '#8002ff', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
              </Animated.View>

              <RepCard rep={item} />

            </Animated.View>
          )
        }
        else if (i == this.state.currentIndex % RepsBusca.length + 1 && !this.isMatch(item.id)) {
          return (
            <Animated.View
              key={item.id} style={[{
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }], height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute'
              }]}>

              <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderColor: '#e102ff', color: '#e102ff', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
              </Animated.View>

              <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderColor: '#8002ff', color: '#8002ff', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
              </Animated.View>

              <RepCard rep={item} />

            </Animated.View>
          )
        } else {
          return null
        }
      }
      ).reverse()

    } else {
      return Reps.map((item, i) => {
        if (i == this.state.currentIndex % Reps.length && !this.isMatch(item.id)) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.id} style={[this.rotateAndTranslate, { height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute' }]}>

              <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: '#e102ff', color: '#e102ff', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
              </Animated.View>

              <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderRadius: 20, borderColor: '#8002ff', color: '#8002ff', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
              </Animated.View>

              <RepCard rep={item} />

            </Animated.View>
          )
        }
        else if (i == this.state.currentIndex % Reps.length + 1 && !this.isMatch(item.id)) {
          return (
            <Animated.View
              key={item.id} style={[{
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }], height: styles.screen.height - 120, width: styles.screen.width, padding: 10, position: 'absolute'
              }]}>

              <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderColor: '#e102ff', color: '#e102ff', fontSize: 32, fontWeight: '800', padding: 10 }}>SIM</Text>
              </Animated.View>

              <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                <Text style={{ borderWidth: 5, borderColor: '#8002ff', color: '#8002ff', fontSize: 32, fontWeight: '800', padding: 10 }}>NAO</Text>
              </Animated.View>

              <RepCard rep={item} />

            </Animated.View>
          )
        } else {
          return null
        }
      }
      ).reverse()
    }
  }

  getReponse(index) {
    pageIndex = index;
  }
  // não importa a key, visto que é uma lista com apenas um elemento
  sectionOptions() {
    return (
      [<View key={0}>
        <Options></Options>
      </View>
      ]
    )
  }

  sectionSearch() {
    return (
      [<View style={{ flex: 1 }} key={0}>
        <TextInput onChangeText={(filter) => this.setState({ filter })} placeholder={"Filtrar por cidades!"} />
        <Button style={styles.button} onPress={() => this.selectSection(1)}>
          <Text style={styles.buttonText}>
            Filtrar
          </Text>
        </Button>
      </View>]
    )
  }

  sectionReps() {
    return (
      [<View style={styles.screen.width * 2} key={0}>
        {this.renderReps()}
      </View>]
    )
  }

  sectionChatsList() {
    return (
      [<View key={0}>
        <ChatList></ChatList>
      </View>]
    )
  }

  selectTab(index) {
    if (index === 0) {
      pageIndex = index;
      this.setState({
        tabColors: ['#eff7f9', '#6F6F6F', '#6F6F6F', '#6F6F6F']
      })
    } else if (index === 1) {
      pageIndex = index;
      this.setState({
        tabColors: ['#6F6F6F', '#eff7f9', '#6F6F6F', '#6F6F6F']
      })
    } else if (index === 2) {
      pageIndex = index;
      this.setState({
        tabColors: ['#6F6F6F', '#6F6F6F', '#6F6F6F', '#eff7f9']
      })
    }
    else if (index === 3) {
      pageIndex = index;
      this.setState({
        tabColors: ['#6F6F6F', '#6F6F6F', '#eff7f9', '#6F6F6F']
      })
    }
  }
  selectSection(index) {
    if (index === 0) {
      finalIndex = index - pageIndex;
      console.log(finalIndex, index, pageIndex)
      this.refs.swiper.scrollBy(finalIndex);
      this.selectTab(index)
    } else if (index === 1) {
      finalIndex = index - pageIndex;
      console.log(finalIndex, index, pageIndex)
      this.refs.swiper.scrollBy(finalIndex);
      this.selectTab(index)
    } else if (index === 2) {
      finalIndex = index - pageIndex;
      console.log(finalIndex, index, pageIndex)
      this.refs.swiper.scrollBy(finalIndex);
      this.selectTab(index)
    } else if (index == 3) {
      finalIndex = index - pageIndex;
      console.log(finalIndex, index, pageIndex)
      this.refs.swiper.scrollBy(finalIndex);
      this.selectTab(index)
    }
  }

  renderSection = () => {

    const sectionOptionsArray = this.sectionOptions();
    const sectionRepsArray = this.sectionReps();
    const sectionChatsListArray = this.sectionChatsList();
    const sectionSearchArray = this.sectionSearch();

    const componentReturn = [...sectionOptionsArray, ...sectionRepsArray, ...sectionChatsListArray, ...sectionSearchArray]
    const componentList = componentReturn.map((item, i) => item);
    return (
      <Swiper ref='swiper' index={1} onIndexChanged={(index) =>
        this.selectTab(index)} showsPagination={false} style={{ backgroundColor: "#eff7f9" }}>
        {componentList}
      </Swiper>
    )

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{ backgroundColor: '#c6dcf4' }} androidStatusBarColor='#b1cff0'>
          <Left>
            <Button transparent onPress={() => this.selectSection(0)}>
              <Icon name='settings' size={this.iconSize} color={this.state.tabColors[0]} />
            </Button>
          </Left>
          <Body>
            <Button transparent onPress={() => this.selectSection(1)}>
              <Icon name='home' size={this.iconSize} color={this.state.tabColors[1]}></Icon>
            </Button>
          </Body>
          <Body>
            <Button transparent onPress={() => this.selectSection(3)}>
              <Icon name='magnify' size={this.iconSize} color={this.state.tabColors[2]} ></Icon>
            </Button>
          </Body>
          <Right>
            <Button transparent onPress={() => this.selectSection(2)}>
              <Icon ref='chat' name='wechat' size={this.iconSize} color={this.state.tabColors[3]}></Icon>
            </Button>
          </Right>
        </Header>
        {this.renderSection()}
      </View>
    );
  }

  async getMembers(id, rep) {
    var membersSnapshot = await firebase.firestore().collection('republics/' + id + '/members').get()
    try {
      rep.members = membersSnapshot._docs
    } catch (err) {
      rep.members = []
    } finally {
      Reps.push(rep)
    }
  }

  // verifica se a república está na lista de conversas do user
  // se estiver é porque já foi dado um match
  isMatch = (repId) => {
    for (let i = 0; i < repMatchs.length; i++) {
      id = repMatchs[i]

      if (id == repId) {
        return true
      }
    }

    return false
  }

  getRepMatchs = async () => {
    repMatchs = await firebase.firestore().collection('chats').doc(this.refUser).get()

    if (repMatchs.exists) {
      return repMatchs.data().repIds ? repMatchs.data().repIds : []
    } else {
      return []
    }
  }

  pontuation = (rep, tags) => {
    rep.point = 0

    if (!rep.tags) {
      return
    }

    // verifica cada key do user
    // a cada key que a rep tiver o mesmo valor, ganha um ponto
    Object.keys(tags).forEach((key) => {
      if (tags[key] == rep.tags[key]) {
        rep.point++
      }
    })
  }

  sortReps = async () => {
    // recuperando as tags do usuario
    userRef = await firebase.firestore().collection('users').doc(this.refUser).get()
    tags = userRef._data.tags
    if (!tags) {
      return
    }

    Reps = Reps.sort((rep1, rep2) => {
      if (rep1.point == undefined) this.pontuation(rep1, tags)
      if (rep2.point == undefined) this.pontuation(rep2, tags)

      if (rep1.point > rep2.point) {
        return -1
      } else {
        return 1
      }
    })
  }

  getIndex = () => { return this.state.currentIndex == Reps.length ? Reps.length : this.state.currentIndex % Reps.length }

  async getDados() {
    Reps = []   // 'limpando' a lista de reps
    this.ref = firebase.firestore().collection('republics');
    this.refUser = firebase.auth().currentUser.uid;
    // só faz essa requisição quando logar no app
    repMatchs = repMatchs ? repMatchs : await this.getRepMatchs()
    const repData = await this.ref.get()
    try {

      if (!repData._docs) {
        return
      }

      for (var i = 0, index = 0; i < repData._docs.length; i++) {

        var ref = repData._docs[i]._data
        // se a república não estiver anunciada
        // ou se nesta república já foi dado um match
        // continua para a próxima iteração
        if (!ref.isAnnounced || this.isMatch(ref.admUID)) {
          continue
        }

        var rep = {
          index: index,
          id: ref.admUID,
          title: ref.name,
          localization: ref.street,
          photoURL: ref.photoURL,
          bathroom: ref.bathroom,
          bed: ref.bed,
          members: null,  // este valor será preenchido abaixo
          value: ref.value,
          vacancies: ref.vacancies,
          latitude: ref.latitude,
          longitude: ref.longitude,
          bio: ref.bio,
          city: ref.city,
          removeSim: this.removeSim,
          removeNao: this.removeNao,
          dragTo: this.dragTo,
          tags: ref.tags,
          currentIndexFunc: this.getIndex.bind(this),
        }

        // recupera os membros da república
        var id = repData._docs[i]._ref.id
        await this.getMembers(id, rep)
        index++

      }

      await this.sortReps()
      this.forceUpdate();
    } catch (err) {
      console.log("Err first try: ", err)
    }

  }

  async componentDidMount() {
    this.getToken();

    // verificando se app foi aberto por notificacao
    const notificationOpen = await firebase.notifications().getInitialNotification()
    if (notificationOpen) {
      this.selectSection(2)
      // se for uma notificacao de invite
      if (notificationOpen.notification.data.invite == 'true') {
        invite(notificationOpen.notification)
      }
    }

    this.getDados();
  }

  async getToken() {
    this.refUser = firebase.auth().currentUser.uid
    this.fcmToken = await firebase.messaging().getToken()

    ref = firebase.firestore().collection('users');
    ref.doc(this.refUser)
      .get()
      .then((userData) => {
        userData = userData.data();
        // update user with token
        ref.doc(userData.uid).set({
          age: userData.age,
          bio: userData.bio,
          email: userData.email,
          gotUrl: userData.gotUrl,
          name: userData.name,
          photoURL: userData.photoURL,
          uid: this.refUser,
          token: this.fcmToken
        })
      })
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
    Reps = []
  }
}