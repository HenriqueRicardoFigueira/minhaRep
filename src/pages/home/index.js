import React, { Component } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import { styles } from '../../components/styles';

class Home extends Component {
    state = {
        user: '',
    }
    
    componentDidMount() {
        var user = firebase.auth().currentUser;
        var name = user.email;
        this.setState({user: name});
        console.log(user);
    }

    logout = async () => {
        firebase.auth().signOut().then(function() {
            console.log("deslogado");
            
          }).catch(function(error) {
            console.log(error);
          });
          this.props.navigation.navigate("LoginPage");
    }


    render() {
    return(
        <View style = {styles.container}>
            <Text> hello {this.state.user} !</Text>
            <TouchableOpacity onPress={this.logout} style = {styles.button}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
  }
}
export default withNavigation(Home);