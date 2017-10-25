// @flow

import React, { PureComponent } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View
} from 'react-native';
import TagsArea from './TagsArea';
import type { TagObject } from '../types';

type Props = {
  // Array of tag titles
  tags: string[],
  // Tag swapping animation duration in ms
  animationDuration: number,
  // Passes onPressAddNewTag callback down to TagsArea component
  onPressAddNewTag: () => void,
};

type State = {
  tags: TagObject[],
};

export default class Tags extends PureComponent {

  props: Props;

  static defaultProps = {
    animationDuration: 250
  };

  state: State = {
    // Convert passed array of tag titles to array of objects of TagObject type,
    // so ['tag', 'another'] becomes [{ title: 'tag' }, { title: 'another' }]
    tags: [...new Set(this.props.tags)]       // remove duplicates
      .map((title: string) => ({ title })),   // convert to objects
  };

  // Animate layout changes when dragging or removing a tag
  componentWillUpdate() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: this.props.animationDuration
    });
  }

  // Remove tag
  removeTag = (tag: TagObject): void => {
    this.setState((state: State) => {
      const index = state.tags.findIndex(({ title }) => title === tag.title);
      return {
        tags: [
          // Remove the tag
          ...state.tags.slice(0, index),
          ...state.tags.slice(index + 1),
        ]
      }
    });
  };

  render() {
    const { tags } = this.state;
    return (
      <View
        style={styles.container}
      >

        <TagsArea
          tags={tags}
          onPress={this.removeTag}
          onRenderTag={() => {}} // do nothing for now
          onPressAddNew={this.props.onPressAddNewTag}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
