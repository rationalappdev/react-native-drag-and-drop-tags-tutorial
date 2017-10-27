// @flow

import React, { PureComponent } from 'react';
import {
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  View
} from 'react-native';
import { isPointWithinArea, moveArrayElement } from '../helpers';
import TagsArea from './TagsArea';
import type { TagObject, GestureState } from '../types';

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
  // Used to temporarily disable tag swapping while moving tag to the new position
  // to avoid unwanted tag swaps while the animation is happening
  dndEnabled: boolean,
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
    dndEnabled: true,                         // drag and drop enabled
  };

  // PanResponder to handle drag and drop gesture
  panResponder: PanResponder;

  // Tag that is currently being dragged
  tagBeingDragged: ?TagObject;

  // Initialize PanResponder
  componentWillMount() {
    this.panResponder = this.createPanResponder();
  }

  // Animate layout changes when dragging or removing a tag
  componentWillUpdate() {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: this.props.animationDuration
    });
  }

  // Create PanResponder
  createPanResponder = (): PanResponder => PanResponder.create({
    // Handle drag gesture
    onMoveShouldSetPanResponder: (_, gestureState: GestureState) => this.onMoveShouldSetPanResponder(gestureState),
    onPanResponderGrant: (_, gestureState: GestureState) => this.onPanResponderGrant(),
    onPanResponderMove: (_, gestureState: GestureState) => this.onPanResponderMove(gestureState),
    // Handle drop gesture
    onPanResponderRelease: (_, gestureState: GestureState) => this.onPanResponderEnd(),
    onPanResponderTerminate: (_, gestureState: GestureState) => this.onPanResponderEnd(),
  });

  // Find out if we need to start handling tag dragging gesture
  onMoveShouldSetPanResponder = (gestureState: GestureState): boolean => {
    const { dx, dy, moveX, moveY, numberActiveTouches } = gestureState;

    // Do not set pan responder if a multi touch gesture is occurring
    if (numberActiveTouches !== 1) {
      return false;
    }

    // or if there was no movement since the gesture started
    if (dx === 0 && dy === 0) {
      return false;
    }

    // Find the tag below user's finger at given coordinates
    const tag = this.findTagAtCoordinates(moveX, moveY);
    if (tag) {
      // assign it to `this.tagBeingDragged` while dragging
      this.tagBeingDragged = tag;
      // and tell PanResponder to start handling the gesture by calling `onPanResponderMove`
      return true;
    }

    return false;
  };

  // Called when gesture is granted
  onPanResponderGrant = (): void => {
    this.updateTagState(this.tagBeingDragged, { isBeingDragged: true });
  };

  // Handle drag gesture
  onPanResponderMove = (gestureState: GestureState): void => {
    const { moveX, moveY } = gestureState;
    // Do nothing if dnd is disabled
    if (!this.state.dndEnabled) {
      return;
    }
    // Find the tag we're dragging the current tag over
    const draggedOverTag = this.findTagAtCoordinates(moveX, moveY, this.tagBeingDragged);
    if (draggedOverTag) {
      this.swapTags(this.tagBeingDragged, draggedOverTag);
    }
  };

  // Called after gesture ends
  onPanResponderEnd = (): void => {
    this.updateTagState(this.tagBeingDragged, { isBeingDragged: false });
    this.tagBeingDragged = undefined;
  };

  // Enable dnd back after the animation is over
  enableDndAfterAnimating = (): void => {
    setTimeout(this.enableDnd, this.props.animationDuration)
  };

  enableDnd = (): void => {
    this.setState({ dndEnabled: true });
  };

  // Find the tag at given coordinates
  findTagAtCoordinates = (x: number, y: number, exceptTag?: TagObject): ?TagObject => {
    return this.state.tags.find((tag) =>
      tag.tlX && tag.tlY && tag.brX && tag.brY
      && isPointWithinArea(x, y, tag.tlX, tag.tlY, tag.brX, tag.brY)
      && (!exceptTag || exceptTag.title !== tag.title)
    );
  };

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

  // Swap two tags
  swapTags = (draggedTag: TagObject, anotherTag: TagObject): void => {
    this.setState((state: State) => {
      const draggedTagIndex = state.tags.findIndex(({ title }) => title === draggedTag.title);
      const anotherTagIndex = state.tags.findIndex(({ title }) => title === anotherTag.title);
      return {
        tags: moveArrayElement(
          state.tags,
          draggedTagIndex,
          anotherTagIndex,
        ),
        dndEnabled: false,
      }
    }, this.enableDndAfterAnimating);
  };

  // Update the tag in the state with given props
  updateTagState = (tag: TagObject, props: Object): void => {
    this.setState((state: State) => {
      const index = state.tags.findIndex(({ title }) => title === tag.title);
      return {
        tags: [
          ...state.tags.slice(0, index),
          {
            ...state.tags[index],
            ...props,
          },
          ...state.tags.slice(index + 1),
        ],
      }
    });
  };

  // Update tag coordinates in the state
  onRenderTag = (tag: TagObject,
                 screenX: number,
                 screenY: number,
                 width: number,
                 height: number): void => {
    this.updateTagState(tag, {
      tlX: screenX,
      tlY: screenY,
      brX: screenX + width,
      brY: screenY + height,
    });
  };

  // Add new tag to the state
  onSubmitNewTag = (title: string): void => {
    // Remove tag if it already exists to re-add it to the bottom of the list
    const existingTag = this.state.tags.find((tag: TagObject) => tag.title === title);
    if (existingTag) {
      this.removeTag(existingTag);
    }
    // Add new tag to the state
    this.setState((state: State) => {
      return {
        tags: [
          ...state.tags,
          { title },
        ],
      }
    });
  };

  render() {
    const { tags } = this.state;
    return (
      <View
        style={styles.container}
        {...this.panResponder.panHandlers}
      >

        <TagsArea
          tags={tags}
          onPress={this.removeTag}
          onRenderTag={this.onRenderTag}
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
