// @flow

import React, { PureComponent } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Tags from './src/components/Tags';
import NewTagModal from './src/components/NewTagModal';

const TAGS = [
  '#love',
  '#instagood',
  '#photooftheday',
  '#beautiful',
  '#fashion',
  '#happy',
  '#tbt',
  '#cute',
  '#followme',
  '#like4like',
  '#follow',
  '#followme',
  '#picoftheday',
  '#me',
  '#selfie',
  '#summer',
  '#instadaily',
  '#photooftheday',
  '#friends',
  '#girl',
  '#fun',
  '#style',
  '#instalike',
  '#food',
  '#family',
  '#tagsforlikes',
  '#igers',
];

type State = {
  modalVisible: boolean,
};

export default class Main extends PureComponent {

  state: State = {
    modalVisible: false,
  };

  // Reference Tags component
  _tagsComponent: ?Tags;

  openModal = (): void => {
    this.setState({ modalVisible: true });
  };

  closeModal = (): void => {
    this.setState({ modalVisible: false });
  };

  onSubmitNewTag = (tag: string) => {
    this._tagsComponent && this._tagsComponent.onSubmitNewTag(tag);
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <NewTagModal
          visible={modalVisible}
          onSubmit={this.onSubmitNewTag}
          onClose={this.closeModal}
        />

        <View style={styles.header}>
          <Text style={[styles.text, styles.title]}>
            Let's drag and drop some tags!
          </Text>
          <Text style={styles.text}>
            Drag and drop tags to reorder, tap to remove or press Add New to add new tags.
          </Text>
        </View>

        <Tags
          ref={component => this._tagsComponent = component }
          tags={TAGS}
          onPressAddNewTag={this.openModal}
        />

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
    fontSize: 16,
    textAlign: 'center',
  },
});
