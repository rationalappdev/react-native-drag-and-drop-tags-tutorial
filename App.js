// @flow

import React, { PureComponent } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Main extends PureComponent {

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <View style={styles.header}>
          <Text style={[styles.text, styles.title]}>
            Let's drag and drop some tags!
          </Text>
          <Text style={styles.text}>
            Drag and drop tags to reorder, tap to remove or press Add New to add new tags.
          </Text>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3',
  },
  header: {
    marginHorizontal: 20,
    marginVertical: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 16,
    textAlign: 'center',
  },
});
