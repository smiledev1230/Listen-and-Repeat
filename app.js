import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableHighlight} from 'react-native';

import { Header, Divider } from 'react-native-elements';
import Voice from 'react-native-voice';
import Dimensions from 'Dimensions';

export default class ListenRepeat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: '√',
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value,
    });
  }

  async _startRecognizing(e) {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: ''
    });
  }

  render() {
    return (
      <View style={styles.bodyContent}>
        <View>
          <Header 
            centerComponent={{ text: 'Listen and repeat', style: styles.title }}
            outerContainerStyles={ styles.header }  
          />
          <Image
            style={styles.headerBorder}
            source={require('./header-border.png')}
          />
        </View>
        <View style={styles.mainContent}>
          <Text style={styles.instructions}>
            what you want to say:
          </Text>
          <TouchableHighlight onPress={this._startRecognizing.bind(this)}>
            <Image
              style={styles.speakerButton}
              source={require('./speaker-button.png')}
            />
          </TouchableHighlight>
          <TextInput
              style={styles.inputText}
              autoCapitalize="none"
              underlineColorAndroid='transparent'
              value={this.state.confirm_password}
              onChangeText={value =>
                this.setState({ confirm_password: value })
              }
            />
          <Text style={styles.instructions}>
            What they hear
          </Text>
          {this.state.results.map((result, index) => {
            return (
              <Text
                key={`result-${index}`}
                style={styles.stat}>
                {result}
              </Text>
            )
          })}          
        </View>
        <TouchableHighlight onPress={this._startRecognizing.bind(this)}>
          <Image
            style={styles.micButton}
            source={require('./mic-button.png')}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  bodyContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#31bfff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    color: "white",
    fontSize: 24,
    top: 6,
    fontWeight: 'bold'
  },
  headerBorder: {
    marginTop: 12,
    marginBottom: 12,
  },
  mainContent: {
    borderWidth: 2,
    borderColor: "#ccc",
    marginLeft: 15,
    marginRight: 15,
    width: DEVICE_WIDTH - 30
  },
  inputText: {
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#000",
    borderWidth: 2,
    borderColor: "#000",
    marginTop: 10
  },
  speakerButton: {
    position: 'absolute',
    top: -32,
    right: 10,
    width: 20,
    height: 20,
  },
  instructions: {
    textAlign: 'left',
    color: '#333333',
    marginTop: 15,
    marginBottom: 15,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },

  micButton: {
    alignItems: "center",
    width: 100,
    height: 100,
  },

  button: {
    width: 50,
    height: 50,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
});