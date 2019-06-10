import React, { Component } from 'react';

import { View } from 'react-native';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../androidBackButton';


import Desc from '../../components/desc'
// import { Container } from './styles';

export default class description extends Component {
    componentWillMount() {
        handleAndroidBackButton(this.props.navigation.navigate, 'RepCard');
    }
    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }
    render() {
        return (
            <View>
                <Desc />
            </View>

        );
    }
}
