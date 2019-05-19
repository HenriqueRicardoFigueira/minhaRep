import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { firebase } from '../../Firebase'
import { styles } from './styles';
import { Button, Item, Input, Label } from 'native-base';
import { withNavigation } from 'react-navigation';


import { numberColor, valueColor } from '../formValidation';

class Anuncio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            vacancies: '',
            repUID: firebase.auth().currentUser.uid,
            name: '',
            bio: '',
            img: '',
            latitude: '',
            longitude: '',
            tags: '',
            numberHome: '',
            street: '',
            complement: '',
            uf: '',
            city: '',
            cep: '',
            tags: '',
            isAnnounced: true,
            borderColorValue: '#e6e6e6',
            borderColorNumber: '#e6e6e6',
        }
    }

    componentWillMount() {
        this.ref = firebase.firestore().collection('republics');
        var user = firebase.auth().currentUser;
        this.ref.doc(user.uid)
            .get()
            .then((repData) => {
                console.log(repData);
                if (repData) {
                    const repDatas = repData.data();
                    this.setState({
                        repUID: repDatas.admUID,
                        name: repDatas.name,
                        bio: repDatas.bio,
                        street: repDatas.street,
                        numberHome: repDatas.numberHome,
                        city: repDatas.city,
                        latitude: repDatas.latitude,
                        longitude: repDatas.longitude,
                        cep: repDatas.cep,
                        tags: repDatas.tags,
                        uf: repDatas.uf
                    })
                    
                } else {
                    alert("Não existe republica cadastrada neste usuário");
                }
            });
    }

    canRegister = (number, value) => {
        boolValue = valueColor.call(this, value)
        boolNumber = numberColor.call(this, number)

        return boolValue && boolNumber
    }

    // CHAMAR ESTA FUNÇÃO AO CLICAR NO BOTÃO DE CADASTRAR ANÚNCIO
    registerRep = () => {
        //bloco comentado por questão que não vai haver mudanças no nome e no bio, pois vão ser informações que iremos pegar do banco
        const { repUID, name, bio, value, street, tags, vacancies, city, numberHome, latitude, longitude, cep, isAnnounced, uf } = this.state;
        if (!this.canRegister(vacancies, value)) {
            return
        }

        ref = firebase.firestore().collection('republics');
        ref.doc(repUID).set({
            name: name,
            bio: bio,
            street: street,
            numberHome: numberHome,
            city: city,
            latitude: latitude,
            longitude: longitude,
            value: value,
            vacancies: vacancies,
            cep: cep,
            tags: tags,
            isAnnounced: isAnnounced,
            uf: uf
        })
        this.props.navigation.navigate("Home");
    }

    render() {
        return (

            /*
            <View style={styles.container}>
            
                <Item floatingLabel style={styles.floatInput}
                    style={{ borderColor: this.state.borderColorName }}>
                    <Label>Nome da república:</Label>
                    <Input
                        value={this.state.name}
                        onChangeText={(name) => this.setState({ name })}
                        onEndEditing={() => nameColor.call(this, this.state.name)}
                    ></Input>
                </Item>

                <Item floatingLabel style={styles.floatInput}
                    style={{ borderColor: this.state.borderColorBio }}>
                    <Label>Descrição:</Label>
                    <Input
                        value={this.state.bio}
                        onChangeText={(bio) => this.setState({ bio })}
                        onEndEditing={() => bioColor.call(this, this.state.bio)}
                    ></Input>
                </Item>
                <Item floatingLabel style={styles.floatInput}
                    style={{ borderColor: this.state.borderColorNumber }}>
                    <Label>Numero de vagas:</Label>
                    <Input
                        keyboardType='number-pad'
                        onChangeText={(number) => this.setState({ number })}
                        onEndEditing={() => numberColor.call(this, this.state.number)}
                    ></Input>
                </Item>
                <Item floatingLabel style={styles.floatInput}
                    style={{ borderColor: this.state.borderColorValue }}>
                    <Label>Valor:</Label>
                    <Input
                        keyboardType='number-pad'
                        onChangeText={(value) => this.setState({ value })}
                        onEndEditing={() => valueColor.call(this, this.state.value)}
                    ></Input>
                </Item>
                <Item floatingLabel style={styles.floatInput}
                    style={{ borderColor: this.state.borderColorLocal }}>
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
            */
            <View style={styles.container}>

                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorName }, styles.floatInput)} >
                    <Label>Valor :</Label>
                    <Input
                        //value={this.state.value}
                        onChangeText={(value) => this.setState({ value })}
                        onEndEditing={() => valueColor.call(this, this.state.value)}
                    ></Input>
                </Item>

                <Item floatingLabel style={Object.assign({ borderColor: this.state.borderColorNumber }, styles.floatInput)} >
                    <Label>Numero de vagas:</Label>
                    <Input
                        //value={this.state.vacancies}
                        onChangeText={(vacancies) => this.setState({ vacancies })}
                        onEndEditing={() => numberColor.call(this, this.state.vacancies)}
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