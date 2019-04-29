import React, { Component } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import { styles } from '../../components/styles';

import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';

class Home extends Component {

  componentWillMount() {
    handleAndroidBackButton(this.props.navigation.navigate, 'Login');
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

    logout = async () => {
        firebase.auth().signOut().then(function() {
            console.log("deslogado");
            
          }).catch(function(error) {
            console.log(error);
          });
          this.props.navigation.navigate("Login");
    }


    render() {
    return(
        
    
        <View style = {styles.container}>
           
     
            <Text> hello  !</Text>
            <TouchableOpacity onPress={this.logout} style = {styles.button}>
                <Text>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('RepForm')} style = {styles.button}>
                <Text>Adicionar Republica</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('RepCRUD')} style = {styles.button}>
                <Text>Gerenciar Republica</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')} style = {styles.button}>
                <Text>Gerenciar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('RepCard')} style = {styles.button}>
                <Text>Buscar Rep</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Maps')} style = {styles.button}>
                <Text>Mapa</Text>
            </TouchableOpacity>
        </View>
    );
  }
}
export default withNavigation(Home);