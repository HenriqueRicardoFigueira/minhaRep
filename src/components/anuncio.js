import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';


import { nameColor, numberColor, bioColor } from '../formValidation';

// import { Container } from './styles';

class Anuncio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            bio: '',
            number: '',
            borderColorBio: '#e6e6e6',
            borderColorName: '#e6e6e6',
            borderColorNumber: '#e6e6e6',
        }
    }

    canRegister = (name, bio, number) => {
        boolBio = bioColor.call(this, bio)
        boolName = nameColor.call(this, name)

        return boolBio && boolName && boolEmail
    }

    // CHAMAR ESTA FUNÇÃO AO CLICAR NO BOTÃO DE CADASTRAR ANÚNCIO
    registerRep() {

        const {name, bio} = this.state;
        if(!canRegister(name, bio)) {
            return
        }

    }

    render() {
        return (<View>
            <Item floatingLabel style={styles.floatInput}
                style={{ borderColor: this.state.borderColorName }}>
                <Label>Nome da república:</Label>
                <Input
                // value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
                onEndEditing={() => nameColor.call(this, this.state.name)}
                ></Input>
            </Item>

            <Item floatingLabel style={styles.floatInput}
                style={{ borderColor: this.state.borderColorBio }}>
                <Label>Descrição:</Label>
                <Input
                //value={this.state.bio}
                onChangeText={(bio) => this.setState({ bio })}
                onEndEditing={() => bioColor.call(this, this.state.bio)}
                ></Input>
            </Item>
        </View>
        );
    }
}

export default withNavigation(Anuncio);