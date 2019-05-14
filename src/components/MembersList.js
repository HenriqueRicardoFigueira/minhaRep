import React, { Component } from 'react';
import { View, Platform, Image, FlatList, ScrollView, Button } from 'react-native';
//import firebase from 'react-native-firebase';
import { styles } from './styles';
import { Item, Input, Label, Thumbnail, Header, Content, List, ListItem, Text, Container, Accordion } from 'native-base';
import { withNavigation } from 'react-navigation';
import { firebase } from '../../Firebase'

class MembersList extends Component {
  constructor(props) {
    super(props);

    this.refUsers = firebase.firestore().collection('users');
    this.refRep = firebase.firestore().collection('republics');

    this.state = {
      isloading: true,
      users: [],
    };
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;

    this.unsubscribe = this.refRep.doc(user.uid).collection('members').onSnapshot(this.onCollectionUpdate);
  };

  onCollectionUpdate = (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((usr) => {
      const { name, uid, email } = usr.data();
      users.push({
        key: usr.id,
        name,
        email,
        uid
      });
      this.setState({
        users,
        isLoading: false,
      })
    });
  }

  removeMember(item){
    var user = firebase.auth().currentUser;

    this.refRep.doc(user.uid).collection('members').doc(item.uid).delete().catch((error) => {
      console.error("Error deleting user: ", error);
    });
    this.props.navigation.navigate("MembersList")
  }

  renderContent = (item) => {
    return (
        <View>
            <Text>{item.email}</Text>
            <Container>
                <Button title="Remover" onPress={() => this.removeMember(item)} />
            </Container>
        </View>
    );
}

renderHeader = (item) => {
  return (
      <View>
          <Text >
              {item.name}
          </Text>
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
                        dataArray={this.state.users}
                        animation={true}
                        expanded={true}
                        renderHeader={this.renderHeader}
                        renderContent={this.renderContent}
                    ></Accordion>
                </Content>
                <Button title="Adicionar Novo Membro" onPress={() => this.props.navigation.navigate("MembersAdd")} />
            </Container>
        </ScrollView>
    );
}
}

export default withNavigation(MembersList);