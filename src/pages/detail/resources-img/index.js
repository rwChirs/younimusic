import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API
import { View, Image } from '@tarojs/components';
import { px2vw } from '../../../utils/common/utils';
import './index.scss';

export default class ResourcesImg extends Component {
  onClick = () => {
    const { data, onClick } = this.props;
    const items = data && data[0];
    onClick && onClick(items);
  };

  render() {
    const { data } = this.props;
    const items = data && data[0];
    const pictureAspect = items && items.pictureAspect;
    let height = '';
    if (pictureAspect) {
      height = 750 / pictureAspect;
    }
    return (
      <View
        className='container'
        style={{
          height: height ? px2vw(height) : px2vw(200),
        }}
      >
        <Image
          className='img'
          style={{
            height: height ? px2vw(height) : px2vw(200),
          }}
          src={items.image}
          alt=''
          onClick={this.onClick.bind(this)}
        />
      </View>
    );
  }
}
