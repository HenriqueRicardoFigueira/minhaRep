import React, { Component } from 'react';

import { ScrollView, Button, TextInput, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Item, Input, Label } from 'native-base';

import {firebase} from '../../Firebase'
// import { Container } from './styles';

class RepEdit extends Component {
    constructor(props) {
        super(props);
        //const {navigation} = this.props
        //this.ref = firebase.firestore().collection('republics').doc(JSON.parse(navigation.getParam('repkey')));
        this.ref = firebase.firestore().collection('republics').doc(JSON.parse(this.props.navigation.getParam('repkey')));
        this.state = {
            key: '',
            name: '',
            bio: '',
            members: '',
            img: '',
            localization: '',
            tags: '',
            isSubmited: false,
            borderColor: '#e6e6e6'
        }
    };
    componentDidMount = () => {
        const ref = firebase.firestore().collection('republics').doc(JSON.parse(this.props.navigation.getParam('repkey')));
        ref.get().then((rep) => {
            if (rep.exists) {
                const republic = rep.data();
                this.setState({
                    key: rep.id,
                    name: republic.name,
                    bio: republic.bio,
                    members: republic.members,
                    tags: republic.tags
                })
            } else {
                console.log("Não existem repúplicas");
            }
        })
    }
    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    updateRep = () => {
        const updateRef = firebase.firestore().collection('republics').doc(this.state.key);
        //this.ref = firebase.firestore().collection('republics').doc(JSON.parse(this.props.navigation.getParam('repkey')));
        console.log(this.state.key);
        updateRef.update({
            name: this.state.name,
            bio: this.state.bio,
            members: this.state.members,
            tags: this.state.tags,
        }).then((repRef) => {
            this.setState({
                key: '',
                name: '',
                bio: '',
                members: '',
                tags: ''
            })

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.props.navigation.navigate('RepCRUD')

    }
    render() {
        return (
            <ScrollView>
                <Item floatingLabel>
                    <Label>
                        Nome
                    </Label>
                    <Input
                        value={this.state.name}
                        onChangeText={(text) => this.updateTextInput(text, 'name')}>
                        style = {styles.inputStyle}
                    </Input>
                </Item>
                <Label>Nome da repúplica:</Label>
                <TextInput
                    value={this.state.name}
                    onChangeText={(text) => this.updateTextInput(text, 'name')}
                ></TextInput>
                <Label>Descrição:</Label>
                <TextInput
                    value={this.state.bio}
                    onChangeText={(text) => this.updateTextInput(text, 'bio')}
                ></TextInput>
                <Label>Membros:</Label>
                <TextInput
                    value={this.state.members}
                    onChangeText={(text) => this.updateTextInput(text, 'members')}
                ></TextInput>

                <Label>Tags:</Label>
                <TextInput
                    placeholder={this.state.tags}
                    value={this.state.tags}
                    onChangeText={(text) => this.updateTextInput(text, 'tags')}
                ></TextInput>
                <Button title='Salvar' onPress={() => this.updateRep()} />
            </ScrollView>
        );
    }
}
export default withNavigation(RepEdit);