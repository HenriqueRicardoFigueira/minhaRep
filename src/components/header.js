import React, { Component } from 'react';
import { Header, Button, Right, Left, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';
import {styles} from '../components/styles';
import Swiper from 'react-native-swiper'

export default class Headers extends Component {
	constructor(props){
		super(props)
		this.iconSize = styles.screen.width * 0.05
	}
	response(num){
		this.props.callback(num);
	}
	render() {
		return (
			<View>
				<Header style = {{backgroundColor: '#F0803C'}} androidStatusBarColor = '#ef752a'>
					<Left>
						<Button transparent>
							<Icon name='cog' size = {this.iconSize} onPress={() => this.response(0)} />
						</Button>
					</Left>
					<Body>
						<Button transparent>
							<Icon name='home' size = {this.iconSize} onPress={() => this.response(1)}></Icon>
						</Button>
					</Body>
					<Right>
						<Button transparent>
							<Icon name='wechat' size = {this.iconSize} onPress={() => this.response(2)}></Icon>
						</Button>
					</Right>
				</Header>
			</View>
		)
	}
}
module.exports = Headers