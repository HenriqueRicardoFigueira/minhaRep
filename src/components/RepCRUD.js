import React, { Component } from 'react'
import { View, ScrollView, Text, Button, TextInput, FlatList, ActivityIndicator } from 'react-native'
import { Form, Input, Label, Item, Container, Content, Accordion, Header } from 'native-base'
import { withNavigation, createSwitchNavigator, createAppContainer } from 'react-navigation'

import firebase from 'react-native-firebase'


// import { Container } from './styles';

class RepCRUD extends Component {
    constructor(props) {
        super(props)
        this.ref = firebase.firestore().collection('republics');
        this.state = {
            isLoading: true,
            republics: [
            ],
        };
    }
    onCollectionUpdate = (querySnapshot) => {
        const republics = [];
        querySnapshot.forEach((rep) => {
            const { name, bio, members, tags } = rep.data();
            republics.push({
                key: rep.id,
                name, bio, members, tags
            });
            this.setState({
                republics,
                isLoading: false,

            })
        });
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    };

    renderHeader = (item) => {
        return (
            <View>
                <Text >
                    {item.name}
                </Text>
            </View>
        );
    }
    delRep(item){
        const {navigation} = this.props
        this.ref.doc(item.key).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        navigation.goBack();
    }

    renderContent = (item) => {
        return (
            <View>
                <Text>{item.bio}</Text>
                <Text>{item.members}</Text>
                <Text>{item.tags}</Text>
                <Container>
                    <Button title="Editar" onPress={() => this.props.navigation.navigate('RepEdit', {
                        repkey: `${JSON.stringify(item.key)}`
                    }) }/>
                    <Button title="Excluir" onPress={() => this.delRep(item)} />
                </Container>
            </View>
        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <ScrollView>
                <Container>
                    <Header />
                    <Content padder>
                        <Accordion
                            dataArray={this.state.republics}
                            animation={true}
                            expanded={true}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                        ></Accordion>
                    </Content>
                    <Button title="Adicionar Rep" onPress={() => this.props.navigation.navigate('RepForm')} />
                </Container>
            </ScrollView>
        );
    }
}
export default withNavigation(RepCRUD)
