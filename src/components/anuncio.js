import { styles } from './styles'
import React, { Component } from 'react'
import { firebase } from '../../Firebase'
import { View, Text } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Button, Item, Input, Label } from 'native-base'
import { nameColor, numberColor, bioColor, valueColor, localColor } from '../formValidation'

class Anuncio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            repUID: '',
            name: '',
            bio: '',
            number: '',
            value: '',
            img: '',
            latitude: '',
            longitude: '',
            tags: '',
            numberHome: '',
            street: '',
            complement: '',
            uf: '',
            city: '',
            tags: '',
            borderColorBio: '#e6e6e6',
            borderColorName: '#e6e6e6',
            borderColorValue: '#e6e6e6',
            borderColorLocal: '#e6e6e6',
            borderColorNumber: '#e6e6e6',
        }
    }

    componentDidMount() {
        this.ref = firebase.firestore().collection('republics');
        var user = firebase.auth().currentUser;
        this.ref.doc(user.uid)
            .get()
            .then((repData) => {
                if (repData.exists) {
                    const repDatas = repData.data();
                    this.setState({
                        bio: repDatas.bio,
                        name: repDatas.name,
                        repUID: repDatas.admUID,
                        street: repData.street,
                        numberHome: repData.numberHome,
                        city: repData.city,
                        latitude: repData.latitude,
                        longitude: repData.longitude
                    })

                } else {
                    alert("Não existe republica cadastrada neste usuário");
                }
            })
    }

    canRegister = (name, bio, number, value, street) => {
        boolBio = bioColor.call(this, bio)
        boolName = nameColor.call(this, name)
        boolValue = valueColor.call(this, value)
        boolLocal = localColor.call(this, street)
        boolNumber = numberColor.call(this, number)

        return boolBio && boolName && boolValue && boolLocal && boolNumber
    }

    // CHAMAR ESTA FUNÇÃO AO CLICAR NO BOTÃO DE CADASTRAR ANÚNCIO
    registerRep = () => {
        //bloco comentado por questão que não vai haver mudanças no nome e no bio, pois vão ser informações que iremos pegar do banco
        const { repUID, name, bio, number, value, street, tags, city, numberHome, latitude, longitude } = this.state;
        if (!this.canRegister(name, bio, number, value, street)) {
            return
        }

        ref = firebase.firestore().collection('anuncio');
        ref.doc(repUID).set({
            name: name,
            bio: bio,
            value: value,
            tags: tags,
            repUID: repUID,
            street: street,
            city: city,
            number: number, 
            numberHome: numberHome,
            latitude: latitude,
            longitude: longitude
        })
        this.props.navigation.navigate("Home");
    }

    render() {
        return (
            <View style={styles.container}>

                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)} >
                    <Label>Nome da república:</Label>
                    <Input
                        value={this.state.name}
                        onChangeText={(name) => this.setState({ name })}
                        onEndEditing={() => nameColor.call(this, this.state.name)}
                    ></Input>
                </Item>

                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorBio }, styles.floatInput)} >
                    <Label>Descrição:</Label>
                    <Input
                        value={this.state.bio}
                        onChangeText={(bio) => this.setState({ bio })}
                        onEndEditing={() => bioColor.call(this, this.state.bio)}
                    ></Input>
                </Item>
                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumber }, styles.floatInput)} >
                    <Label>Numero de vagas:</Label>
                    <Input
                        keyboardType='number-pad'
                        onChangeText={(number) => this.setState({ number })}
                        onEndEditing={() => numberColor.call(this, this.state.number)}
                    ></Input>
                </Item>
                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorValue }, styles.floatInput)} >
                    <Label>Valor:</Label>
                    <Input
                        keyboardType='number-pad'
                        onChangeText={(value) => this.setState({ value })}
                        onEndEditing={() => valueColor.call(this, this.state.value)}
                    ></Input>
                </Item>
                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorLocal }, styles.floatInput)} >
                    <Label>Local:</Label>
                    <Input
                        value={this.state.street}
                        onChangeText={(street) => this.setState({ street })}
                        onEndEditing={() => localColor.call(this, this.state.street)}
                    ></Input>
                </Item>
                <Button style={styles.button} onPress={() => this.registerRep()}>
                    <Text style={styles.buttonText}> Anunciar </Text>
                </Button>

            </View>
        );
    }
}

export default withNavigation(Anuncio);