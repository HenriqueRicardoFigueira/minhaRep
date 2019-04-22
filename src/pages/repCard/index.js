import React, { Component } from 'react';
import { View } from 'react-native';
import RepCard from '../../components/RepCard';
import { Container } from '../../components/styles';

export default class RepCardPage extends Component {
  render() {
    return <RepCard />;
  }
}

const Rep = () => <RepCard />;

const Reps = [
  {id: '1', rep: Rep}
]