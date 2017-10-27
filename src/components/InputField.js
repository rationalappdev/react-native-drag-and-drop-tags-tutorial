// @flow

import React, { PureComponent } from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  onSubmit: (text: string) => void,
};

type State = {
  text: ?string,
};

export default class InputField extends PureComponent {

  props: Props;

  state: State = {
    text: undefined, // user's input
  };

  getButtonTextStyles = (): {} => ({
    ...styles.text,
    ...(!this.state.text ? styles.inactive : {}),
  });

  // Call this.props.onSubmit handler and pass the input
  submit = (): void => {
    const { text } = this.state;
    if (text) {
      this.setState({ text: undefined }, () => this.props.onSubmit(text));
    } else {
      alert('Please enter new tag first');
    }
  };

  // Update state when input changes
  onChangeText = (text: string): void => this.setState({ text });

  // Handle return press on the keyboard
  onSubmitEditing = (event: { nativeEvent: { text: ?string } }): void => {
    const { nativeEvent: { text } } = event;
    this.setState({ text }, this.submit);
  };

  render() {
    return (
      // This component moves children view with the text input above the keyboard
      // when the text input gets the focus and the keyboard appears
      <KeyboardAvoidingView behavior='position'>
        <View style={styles.container}>

          <TextInput
            autoFocus={true}                        // focus and show the keyboard
            keyboardType="twitter"                  // keyboard with no return button
            placeholder="Add a tag..."              // visible before they started typing
            style={styles.input}
            onChangeText={this.onChangeText}        // handle input changes
            onSubmitEditing={this.onSubmitEditing}  // handle submit event
          />

          <TouchableOpacity
            style={styles.button}
            onPress={this.submit}
          >
            <Text style={this.getButtonTextStyles()}>Add</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    );
  }

}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 20,
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
