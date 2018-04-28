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
      error: '',
      end: '',
      started: 0,
      results: [],
      userText: '',
      resultText: '',
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    this.compareText = this.compareText.bind(this);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: 0,
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: true,
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  async _startRecognizing(e) {
    const started = this.state.started;
    if (!started) {
      this.setState({
        recognized: '',
        error: '',
        started: 1,
        results: [],
        end: '',
        resultText: '',
      });
      try {
        Voice.start('en-US');
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        let result_text = this.state.results;
        // let result_text = [ 'Who do you want to say' ];
        console.log(result_text)
        this.setState({
          recognized: '',
          error: '',
          started: 2,
          results: [],
          resultText: result_text,
          end: ''
        });
        this._stopRecognizing(0);
        this._cancelRecognizing(0);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (err) {
      console.error(err);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
      this.setState({ started: 0 });
    } catch (err) {
      console.error(err);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (err) {
      console.error(err);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: 0,
      results: [],
      partialResults: [],
      end: ''
    });
  }

  compareText = () => {
    let result_text =  this.state.results.map((result, index) => {
      return result;
    });
    this.setState({ started: 0, resultText: result_text });
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
              value={this.state.userText}
              onChangeText={value =>
                this.setState({ userText: value })
              }
            />
          <Text style={styles.instructions}>
            What they hear
          </Text>
          <Text style={styles.recordText}>
            {(() => {
                let result_text = [];
                let text_color = '#22b14b';
                let user_text = this.state.userText.toLowerCase();
                if (this.state.resultText && this.state.resultText[0]) {
                  let result_obj = this.state.resultText[0].split(' ');
                  for (let i=0; i<result_obj.length;i++) {
                    text_color = user_text.search(result_obj[i].toLowerCase())<0 ? '#f00' : '#22b14b';
                    result_text.push(<Text key={`result-${i}`} style={{color: text_color}}>{result_obj[i]} </Text>);
                  }
                }
                return result_text;
              }
            )()}
          </Text>
        </View>
        <View style={styles.footerBar}>
          {(() => {
            if (this.state.started) {
              let processLabel = this.state.started == 1 ? 'Recording': 'Speech recognition in progress';
              return <Text style={styles.recordLabel}>{processLabel}</Text>
            }
          })()}
          <TouchableHighlight onPress={this._startRecognizing.bind(this)} underlayColor="white">
            <Image 
              style={styles.micButton}
              source={(() => {
                if (this.state.started)
                  return require('./record-button.png')
                else
                  return require('./mic-button.png')
              })()}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  bodyContent: {
    alignItems: "center",
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
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
    width: DEVICE_WIDTH - 30,
    minHeight: DEVICE_HEIGHT - 210,
  },
  inputText: {
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#000",
    borderWidth: 2,
    borderColor: "#000",
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
    marginLeft: 12,
  },
  resultLabel: {
    textAlign: 'left',
    paddingLeft: 15,
    paddingRight: 15,
    color: '#22b14c',
    marginBottom: 1,
  },
  recordText: {
    paddingLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerBar: {
    position: 'absolute',
    alignItems: "center",
    bottom: 0
  },
  recordLabel: {
    bottom: 20,
    color: '#f42222',
    fontSize: 12,
  },
  micButton: {
    width: 60,
    height: 60,
    bottom: 15,
  },
});