import Taro from '@tarojs/taro';
import { Component } from 'react';
import { Slider, View, Image, Text } from '@tarojs/components';
import { filterImg, logClick } from '../../utils';
import { VD_PAUSE, VD_SLIDER } from '../../reportPoints';
import './index.scss';

export default class VideoControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '',
      duration: '',
      value: 0,
      isPlaying: true,
    };
  }

  componentWillMount() {
    Taro.eventCenter.on('currentTime', this.getCurrentTime);
  }
  componentWillUnmount() {
    Taro.eventCenter.off('currentTime');
  }
  formatSeconds = seconds => {
    let theTime = parseInt(seconds);
    let second = 0;
    let minute = 0;
    // let hour = 0;
    let result = '';
    if (theTime < 60) result = '00:' + (theTime < 10 ? '0' + theTime : theTime);
    else {
      minute = parseInt(theTime / 60);
      second = theTime % 60;
      result =
        (minute < 10 ? '0' + minute : minute) +
        ':' +
        (second < 10 ? '0' + second : second);
    }
    return result;
  };
  getCurrentTime = (cur, dur, value) => {
    //console.log("video control", currentTime);
    const currentTime = this.formatSeconds(cur);
    const duration = this.formatSeconds(dur);
    // console.log(currentTime, "播放进度");
    // console.log(value, "value");
    this.setState({
      currentTime,
      duration,
      //isPlaying: true,
      value,
    });
  };
  onChange = e => {
    e.stopPropagation();
    this.sliderChange(e.detail.value);
  };
  sliderChange = value => {
    logClick({ eid: VD_SLIDER });
    Taro.eventCenter.trigger('7clubvideoUpdate', value);
  };
  togglePlay = e => {
    e.stopPropagation();
    if (this.state.isPlaying) {
      logClick({ eid: VD_PAUSE });
    }
    this.setState(
      {
        isPlaying: !this.state.isPlaying,
      },
      () => {}
    );
    console.log('切换播放状态', this.state.isPlaying);
    Taro.eventCenter.trigger('toggle7clubVideoPlay', this.state.isPlaying);
  };
  onClick = e => {
    e.stopPropagation();
  };

  render() {
    const { currentTime, duration, value, isPlaying } = this.state;
    return (
      <View className='video-control'>
        <Slider
          className='progress-bar'
          step={1}
          min={0}
          max={100}
          blockSize={10}
          activeColor='#FFFFFF'
          backgroundColor='rgba(216,216,216,0.7)'
          onChange={this.onChange}
          //onChanging={this.onChanging.bind(e)}
          value={value}
          onClick={this.onClick}
        />
        <View className='control-area'>
          <View className='play-btn' onClick={this.togglePlay}>
            <Image
              className='play-img'
              style={{ display: this.props.showPlay ? 'block' : 'none' }}
              src={`${
                isPlaying
                  ? filterImg(
                      'https://m.360buyimg.com/img/jfs/t1/55044/14/9068/181/5d663162Edc2d060e/f3a1b290bdf02ef7.png!q70.dpg'
                    )
                  : filterImg(
                      'https://m.360buyimg.com/img/jfs/t1/75432/34/8575/395/5d663236E568f198c/c8627ad167444c15.png!q70.dpg'
                    )
              }`}
            />
          </View>
          <View
            className='time'
            style={{ display: this.props.showPlay ? 'block' : 'none' }}
          >
            <Text className='text'>{currentTime}</Text>
            <Text className='text'>/</Text>
            <Text className='text'>{duration}</Text>
          </View>
        </View>
      </View>
    );
  }
}
