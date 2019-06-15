import React, { Component } from 'react';
import { Button, Text, List, ListItem, Left, Right, Body, Container, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { styles } from './styles';
import Tags from './tags';

// import { Container } from './styles';

class Desc extends Component {
    constructor(props) {
        super(props);

        this.buttonWidth = styles.screen.width * 0.92;
        this.buttonHeight = styles.screen.height * 0.05;
        this.iconSize = styles.screen.width * 0.05

        state = {
            iImage: 0,
            bed: '',
            title: '',
            value: '',
            members: '',
            currentIndex: '',
            latitude: '',
            bathroom: '',
            repImage: '',
            longitude: '',
            vacancies: '',
            localization: '',
            tags: '',
            city: '',
            bio: '',
        }
    }

    mapView = () => {
        var latitude = this.state.latitude;
        var longitude = this.state.longitude;
        this.props.navigation.navigate("Maps", {latitude, longitude});
      }

    componentWillMount() {
        var rep = this.props.navigation.getParam('rep');
        this.setState({
            title: rep.title,
            bed: rep.bed,
            value: rep.value,
            members: rep.members,
            currentIndex: rep.currentIndex,
            repImage: rep.repImage,
            vacancies: rep.vacancies,
            localization: rep.localization,
            latitude: rep.latitude,
            longitude: rep.longitude,
            city: rep.city,
            tags: rep.tags,
            bio: rep.bio
        })
        console.log(this.state);
    }

    render() {
        return (
            <ScrollView>
                <Image alignSelf='center' style={{ width: 100, height: 100, borderRadius: 100, marginTop: styles.screen.width * 0.05 }} source={{ uri: this.state.repImage[0] }} />
                <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, alignSelf: "center" }}>
                    <Text style={{ color: '#1b2021', alignSelf: "center" }}>{this.state.title}</Text>
                </Container>
                <ListItem Text >
                    <Left>
                        <Label> Quartos: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.bed}</Label>
                    </Right>
                </ListItem>
                <ListItem Text >
                    <Left>
                        <Label> Valor: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.value}</Label>
                    </Right>
                </ListItem>
                <ListItem Text >
                    <Left>
                        <Label> Membros: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.members}</Label>
                    </Right>
                </ListItem>
                <ListItem Text >
                    <Left>
                        <Label> Vagas: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.vacancies}</Label>
                    </Right>
                </ListItem>
                <ListItem Text >
                    <Left>
                        <Label> Bio: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.bio}</Label>
                    </Right>
                </ListItem>
                <ListItem Text >
                    <Left>
                        <Label> Cidade: </Label>
                    </Left>
                    <Right>
                        <Label>{this.state.city}</Label>
                    </Right>
                </ListItem>

                <Tags tags={this.state.tags}/>

                <ListItem button >
                    <Button transparent style={{ width: this.buttonWidth, height: this.buttonHeight }} onPress={this.mapView}>
                        <Left>
                            <Icon active name="map-marker" size={this.iconSize}></Icon>
                        </Left>
                        <Container style={{ backgroundColor: '#eff7f9', width: this.buttonWidth * 0.8, height: this.buttonHeight, position: "absolute", left: 30 }}>
                            <Text style={{ color: '#1b2021', alignSelf: "center" }}>Localização</Text>
                        </Container>
                        <Right>
                            <Icon active name="chevron-right" size={this.iconSize * 0.6} />
                        </Right>
                    </Button>
                </ListItem>
            </ScrollView>

        );
    }
}
export default withNavigation(Desc)