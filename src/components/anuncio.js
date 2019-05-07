import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Button, Item, Input, Label, Thumbnail } from 'native-base';
import { withNavigation } from 'react-navigation';


// import { Container } from './styles';

class Anuncio extends Component {
    render() {
        return (<View>
            <Item floatingLabel style={styles.floatInput}>
                <Label>Nome da república:</Label>
                <Input
                   // value={this.state.name}
                    //onChangeText={(name) => this.setState({ name })}
                ></Input>
            </Item>

            <Item floatingLabel style={styles.floatInput}>
                <Label>Descrição:</Label>
                <Input
                    //value={this.state.bio}
                    //onChangeText={(bio) => this.setState({ bio })}
                ></Input>
            </Item>
        </View>
        );
    }
}

export default withNavigation(Anuncio);