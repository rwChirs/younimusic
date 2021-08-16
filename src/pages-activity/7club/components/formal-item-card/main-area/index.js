import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import { px2vw } from '../../../../../utils/common/utils';
import MultiImg from './multi-img/index';
import VideoArea from './video-area/index';
import './index.scss';
import SingleImg from './single-img';
import SwiperImg from '../../swiper-img';

export default class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, data, subType } = this.props;
    return (
      <View
        className='main-area'
        style={{
          paddingLeft: px2vw(30),
        }}
      >
        {type === 1 &&
        subType === 1 &&
        data.images &&
        data.images.length > 1 ? (
          <SwiperImg data={data.images} radio={data.radio}></SwiperImg>
        ) : type === 3 ? (
          <VideoArea
            // eslint-disable-next-line taro/props-reserve-keyword
            id={this.props.uniqueId}
            uniqueId={this.props.uniqueId}
            data={data}
          />
        ) : type === 5 ? (
          <MultiImg data={data} type={type} imgList={data.images} />
        ) : (
          <SingleImg data={data} />
        )}
      </View>
    );
  }
}
