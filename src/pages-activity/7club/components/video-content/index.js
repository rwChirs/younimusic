import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Video } from '@tarojs/components';
import './index.scss';

export default class VideoArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 667,
      duration: 0,
    };
  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          height: res.windowHeight,
        });
      },
    });
    Taro.eventCenter.on('pause7clubVideo', this.onPause);
    Taro.eventCenter.on('toggle7clubVideoPlay', this.toggleVideoPlay);
  }
  componentDidMount() {
    const targetVideo = 'video';
    this.videoCtx = wx.createVideoContext(targetVideo, this.$scope);
    console.log('this.videoCtx', this.videoCtx);
    Taro.eventCenter.on('7clubvideoUpdate', this.onVideoUpdate);
  }
  componentWillUnmount() {
    Taro.eventCenter.off('pause7clubVideo');
    Taro.eventCenter.off('toggle7clubVideoPlay');
    Taro.eventCenter.off('7clubvideoUpdate');
  }
  onVideoUpdate = value => {
    this.videoCtx.seek((value / 100) * this.state.duration);
  };
  playVideo = () => {
    this.videoCtx.play();
  };
  toggleVideoPlay = isPlaying => {
    if (isPlaying) {
      this.videoCtx.pause();
    } else {
      this.videoCtx.play();
    }
  };
  onPlay = () => {
    console.log('VIDEO PLAYING~');
  };
  onPause = () => {
    console.log('onPauseonPauseonPause');
    this.videoCtx.pause();
  };
  // 视频开始播放，可以获取当前播放时长和视频总时长。
  onTimeUpdate = e => {
    const { duration, currentTime } = e.detail;
    this.setState({
      duration,
    });
    const value = Math.floor((currentTime / duration) * 100);
    Taro.eventCenter.trigger('currentTime', currentTime, duration, value);
  };
  onEneded = () => {
    console.log('video ended!');
  };

  render() {
    const { height } = this.state;
    const { videoUrl } = this.props;
    return (
      <View className='video-content' style={{ height: height + 'px' }}>
        <Video
          src={videoUrl}
          controls={false}
          showFullscreenBtn={false}
          autoplay
          initialTime='0'
          className='video'
          loop
          muted={false}
          onPlay={this.onPlay.bind(this)}
          onEneded={this.onEneded.bind(this)}
          id='video'
          onTimeUpdate={this.onTimeUpdate}
          objectFit='contain'
        />
      </View>
    );
  }
}
