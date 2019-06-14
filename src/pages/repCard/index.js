import React, { Component } from 'react';
import { Alert, AsyncStorage, View, Animated, PanResponder, Text } from 'react-native';
import RepCard from '../../components/RepCard';
import { firebase } from '../../../Firebase'
import { styles } from '../../components/styles';
import { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert } from '../../androidBackButton';
import Swiper from 'react-native-swiper';
import PhotoCard from '../../components/photoCard'
import Options from '../options/index'
import { Header, Button, Right, Left, Body } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EventRegister } from 'react-native-event-listeners'

var Reps = [];
const photoURL = '../../image/houseIcon.png'

let pageIndex = 1;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.iconSize = styles.screen.width * 0.06
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,

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
    this.dragTo = {drag: 'NONE'}
  }

  removeSim = (gestureState, speed) => {
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

    if (y0*0.922 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if(x0 >= Math.floor(styles.screen.width/2)) {
        EventRegister.emit('changeImage', {pos: 1, currentIndex: this.state.currentIndex})  // avança a imagem
      } else {
        EventRegister.emit('changeImage', {pos: -1, currentIndex: this.state.currentIndex}) // retrocede a imagem
      }
    }
  }

  verificaCliqueFoto = (x0, y0) => {
    regionYmin = Math.floor(styles.screen.height * 0.785)
    regionYmax = Math.floor(styles.screen.height * 0.885)
    regionXmin = Math.floor(styles.screen.width * 0.03125)
    regionXmax = Math.floor(styles.screen.width * 0.98438)

    if (y0*0.89 > styles.repImage.height) {
      return
    }

    if (x0 > regionXmin && x0 < regionXmax) {
      if(x0 >= Math.floor(styles.screen.width/2)) {
        EventRegister.emit('changeImage', {pos: 1, currentIndex: this.state.currentIndex})  // avança a imagem
      } else {
        EventRegister.emit('changeImage', {pos: -1, currentIndex: this.state.currentIndex}) // retrocede a imagem
      }
    }
  }

  async componentWillMount() {

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

  renderReps = () => {
    return Reps.map((item, i) => {

      if (i == this.state.currentIndex) {
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
      else if (i == this.state.currentIndex + 1) {
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
        return null;
      }
    }).reverse()
  }

  getReponse(index) {
    pageIndex = index;
  }

  sectionOptions() {
    return (
      [<View>
        <Options></Options>
      </View>
      ]
    )
  }

  sectionReps() {
    return (
      [<View style={{ flex: 1 }}>
        {this.renderReps()}
      </View>]
    )
  }
  sectionTeste() {
    return (
      [<View>
        <PhotoCard></PhotoCard>
      </View>]
    )
  }

  selectSection(index) {
    console.log('index >>> ', index);
    //pageIndex = index
    if (index === 0) {
      const finalIndex = index - pageIndex;

      this.refs.swiper.scrollBy(finalIndex);
      pageIndex = 0;
    } else if (index === 1) {
      const finalIndex = index - pageIndex;

      this.refs.swiper.scrollBy(finalIndex);
      pageIndex = 1;
    } else if (index === 2) {
      const finalIndex = index - pageIndex;

      this.refs.swiper.scrollBy(finalIndex);
      pageIndex = 2;
    }
  }
  swiperFunc(componentList) {

  }

  renderSection = () => {
    const sectionOptionsArray = this.sectionOptions();
    const sectionRepsArray = this.sectionReps();
    const sectionTesteArray = this.sectionTeste();

    const componentReturn = [...sectionOptionsArray, ...sectionRepsArray, ...sectionTesteArray]
    const componentList = componentReturn.map((item, i) => item);
    return (
      <Swiper ref='swiper' index={pageIndex} onIndexChanged={(index) =>
        pageIndex = index} showsPagination={false} style={{backgroundColor: "#eff7f9"}}>

        {componentList}
      </Swiper>
    )

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{ backgroundColor: '#c6dcf4' }} androidStatusBarColor='#869cb4'>
          <Left>
            <Button transparent>
              <Icon name='settings' size={this.iconSize} onPress={() => this.selectSection(0)} />
            </Button>
          </Left>
          <Body>
            <Button transparent>
              <Icon name='home' size={this.iconSize} onPress={() => this.selectSection(1)}></Icon>
            </Button>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='wechat' size={this.iconSize} onPress={() => this.selectSection(2)}></Icon>
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

  async getDados() {
    Reps = []   // 'limpando' a lista de reps
    this.ref = firebase.firestore().collection('republics');
    this.refAnuncio = firebase.firestore().collection('anuncio');
    this.refUser = firebase.auth().currentUser.uid;

    const repData = await this.ref.get()
    try {

      if (!repData._docs) {
        return
      }

      for (var i = 0; i < repData._docs.length; i++) {

        var ref = repData._docs[i]._data
        // se a república não estiver anunciada, continua para a próxima iteração
        if (!ref.isAnnounced) {
          continue
        }

        var rep = {
          index: i,
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
          removeNao: this.removeNao
        }

        // recupera os membros da república
        var id = repData._docs[i]._ref.id
        await this.getMembers(id, rep)
      }

      this.forceUpdate();
    } catch (err) {
      console.log("Err first try: ", err)
    }
  }

  async componentDidMount() {
    this.getDados();
    this.checkPermission()
  }

  // 1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
        this.getToken()
    } else {
        this.requestPermission()
    }
  }

  // 3
  async getToken() {
    this.fcmToken = await AsyncStorage.getItem('fcmToken')
    if (!this.fcmToken) {
        this.fcmToken = await firebase.messaging().getToken()
        if (this.fcmToken) {
            console.log(this.fcmToken)
            // user has a device token
            await AsyncStorage.setItem('fcmToken', this.fcmToken)
        }
    }
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission()
        // User has authorised
        this.getToken()
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected')
    }
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }
}