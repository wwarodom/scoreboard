import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet ,TouchableOpacity, AppState } from 'react-native';
import { View, Text } from 'native-base';   

import _ from 'lodash';
import {sprintf} from 'sprintf-js';

const DEFAULT_BG_COLOR = '#FAB913';
const DEFAULT_TIME_TXT_COLOR = '#000';
const DEFAULT_DIGIT_TXT_COLOR = '#000';
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];

class CountDown extends React.Component {
  static propTypes = {
    digitBgColor: PropTypes.string,
    digitTxtColor: PropTypes.string,
    timeTxtColor: PropTypes.string,
    timeToShow: PropTypes.array,
    size: PropTypes.number,
    until: PropTypes.number,
    onFinish: PropTypes.func,
    onPress: PropTypes.func,
  };

  state = {
    until: this.props.until,
    wentBackgroundAt: null,    
    isRestart: false,
  };

  componentDidMount() {
    if (this.props.onFinish) {
      this.onFinish = _.once(this.props.onFinish);
    }
    this.timer = setInterval(this.updateTimer, 1000);
   // AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
   // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentWillReceiveProps(nextProps) {     
    if (this.props.until !== nextProps.until) {
      this.setState({
        until: nextProps.until,
        isRestart: nextProps.isRestart,
      }, this.onRestart );    
    }
  }

  // _handleAppStateChange = currentAppState => {
  //   const {until, wentBackgroundAt} = this.state;
  //   if (currentAppState === 'active' && wentBackgroundAt) {
  //     const diff = (Date.now() - wentBackgroundAt) / 1000.0;
  //     this.setState({until: Math.max(0, until - diff)});
  //   }
  //   if (currentAppState === 'background') {
  //     this.setState({wentBackgroundAt: Date.now()});
  //   }
    
  // }

  getTimeLeft = () => {  
    const {until} = this.state;
    return {
      seconds: until % 60,
      minutes: parseInt(until / 60, 10) % 60,
      hours: parseInt(until / (60 * 60), 10) % 24,
      days: parseInt(until / (60 * 60 * 24), 10),
    };
  };

  updateTimer = () => {    
    const {until} = this.state;  
    if (until <= 1) {
      clearInterval(this.timer);
      if (this.onFinish) {
        this.onFinish();
        this.setState({until: 0});
      }
    } else {
      this.setState({until: until - 1});
    }
  };

  onRestart = () => {
    const {isRestart} = this.state;
    console.log('4 istart', isRestart)
    console.log('4 until', this.state.until)
    if ( isRestart ) {         
      clearInterval(this.timer);   
      this.timer = setInterval(this.updateTimer, 1000);
    } 
  }

  renderDigit = (d) => {
    const {digitBgColor, digitTxtColor, size} = this.props;
    return (
      <View style={[
        styles.digitCont,
        {backgroundColor: digitBgColor},
        {width: size * 1.7, height: size * 1.7},
      ]}>
        <Text style={[
          styles.digitTxt,
          {fontSize: size},
          {color: digitTxtColor}
        ]}>
          {d}
        </Text>
      </View>
    );
  };

  renderDoubleDigits = (label, digits) => {
    const {timeTxtColor, size} = this.props;

    return (
      <View style={styles.doubleDigitCont}>
        <View style={styles.timeInnerCont}>
          {this.renderDigit(digits)}
        </View>
        <Text style={[
          styles.timeTxt,
          {fontSize: size / 1.8},
          {color: timeTxtColor},
        ]}>
          {label}
        </Text>
      </View>
    );
  };

  renderCountDown = () => {
    const {timeToShow} = this.props;
    const {until} = this.state;
    const {days, hours, minutes, seconds} = this.getTimeLeft();
    const newTime = sprintf('%02d:%02d:%02d:%02d', days, hours, minutes, seconds).split(':');
    const Component = this.props.onPress ? TouchableOpacity : View;

    return (
      <Component
        style={styles.timeCont}
        onPress={this.props.onPress}
      >
        {_.includes(timeToShow, 'D') ? this.renderDoubleDigits(this.props['labelD'], newTime[0]) : null}
        {_.includes(timeToShow, 'H') ? this.renderDoubleDigits(this.props['labelH'], newTime[1]) : null}
        {_.includes(timeToShow, 'M') ? this.renderDoubleDigits(this.props['labelM'], newTime[2]) : null}
        {_.includes(timeToShow, 'S') ? this.renderDoubleDigits(this.props['labelS'], newTime[3]) : null}
      </Component>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.renderCountDown()}
      </View>
    );
  }
}

CountDown.defaultProps = {
  digitBgColor: DEFAULT_BG_COLOR,
  digitTxtColor: DEFAULT_DIGIT_TXT_COLOR,
  timeTxtColor: DEFAULT_TIME_TXT_COLOR,
  timeToShow: DEFAULT_TIME_TO_SHOW,
  labelD: "Days",
  labelH: "Hours",
  labelM: "Minutes",
  labelS: "Seconds",
  until: 0,
  size: 15,
};

const styles = StyleSheet.create({
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeTxt: {
    color: 'white',
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCont: {
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
});

module.exports = CountDown;
