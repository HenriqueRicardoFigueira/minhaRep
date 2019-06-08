import React, { Component } from 'react';

import { View, Image, Text } from 'react-native';
import { styles } from '../components/styles';
// import { Container } from './styles';

export default class PhotoCard extends Component {
	constructor (props){
		super (props);

		this.state = {
			repImage: props.photoURL,
			title: props.title,
			vacancies: props.vacancies,
      localization: props.localization
		}
	}
	getImage = () => {
		if (this.state.repImage == '../../image/houseIcon.png') {
			return require('../image/houseIcon.png');
		} else {
			return { uri: this.state.repImage }
		}
	}

	render() {

		return (
			<View style={styles.viewImage}>
				<Image style={styles.repImage} source={this.getImage()} />
				<View style={styles.viewText}>
					<Text style={styles.repTitle}>{this.state.vacancies}</Text>
					<Text style={styles.repTitle}>{this.state.title}</Text>
					<Text style={styles.repLocalization}>{this.state.localization}</Text>
				</View>
			</View>
		);
	}
}
module.exports = PhotoCard;