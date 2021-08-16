import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg, images, addHttps } from '../../../utils';

import './index.scss';

export default class EvaluationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleGoDetail = data => {
    this.props.onGoDetail(data);
  };

  render() {
    const { data } = this.props;
    const { author } = data;
    return (
      <View
        className='evaluation-item'
        onClick={this.handleGoDetail.bind(this, data)}
      >
        <View className='image-box'>
          <Image
            src={filterImg(data.coverImg)}
            mode='aspectFill'
            className='evaluation-img'
          />
          {data.contentType === 3 && (
            <Image
              className='player-img'
              mode='aspectFill'
              src='https://m.360buyimg.com/img/jfs/t1/49240/35/9163/6656/5d6ce5ccEe47e6766/9466d3430fcd5e3e.png'
            />
          )}
        </View>
        <View className='evaluation-item-right'>
          <View>
            <View className='right-title-box'>
              <View className='avatar-wrapper'>
                <Image
                  mode='aspectFill'
                  className='avatar'
                  src={
                    author && author.headIcon
                      ? addHttps(author.headIcon)
                      : images.userDefaultPicture
                  }
                />
              </View>
              <View className='right-title'>{data.title}</View>
            </View>
            <View className='right-content'>{data.preface}</View>
          </View>
        </View>
      </View>
    );
  }
}
