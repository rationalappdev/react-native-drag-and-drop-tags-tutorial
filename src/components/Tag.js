// @flow

import React, { PureComponent } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { NativeMethodsMixinType } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { TagObject } from '../types';

type Props = {
  tag: TagObject,
  // Called when user taps on a tag
  onPress: (tag: TagObject) => void,
  // Called after a tag is rendered
  onRender: (tag: TagObject, screenX: number, screenY: number, width: number, height: number) => void,
};

export default class Tag extends PureComponent {

  props: Props;

  container: ?NativeMethodsMixinType;

  // Append styles.tagBeingDragged style if tag is being dragged
  getTagStyle = (): {} => ({
    ...styles.tag,
    ...(this.props.tag.isBeingDragged ? styles.tagBeingDragged : {}),
  });

  // Call view container's measure function to measure tag position on the screen
  onLayout = (): void => {
    this.container && this.container.measure(this.onMeasure);
  };

  // Pass tag coordinates up to the parent component
  onMeasure = (x: number,
               y: number,
               width: number,
               height: number,
               screenX: number,
               screenY: number): void => {
    this.props.onRender(this.props.tag, screenX, screenY, width, height);
  };

  // Handle tag taps
  onPress = (): void => {
    this.props.onPress(this.props.tag);
  };

  render() {
    const { tag: { title } } = this.props;
    return (
      <View
        ref={el => this.container = el}
        style={styles.container}
        onLayout={this.onLayout}
      >
        <TouchableOpacity
          style={this.getTagStyle()}
          onPress={this.onPress}
        >
          <Icon name="ios-close-circle-outline" size={16} color="#FFF" />
          <Text>{' '}</Text>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = {
  container: {
    marginBottom: 8,
    marginRight: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .33)',
    borderColor: 'rgba(255, 255, 255, .25)',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagBeingDragged: {
    backgroundColor: 'rgba(255, 255, 255, .01)',
    borderStyle: 'dashed',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'normal',
  },
};
