import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Image } from '@tarojs/components';

import './index.scss';

export default class RecipeItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    imgSrc:
      'https://m.360buyimg.com/img/jfs/t1/11977/8/1813/6403/5c0e42faE5eda5d07/353210cb17778a52.png',
    title: '',
    time: '',
    difficult: '',
    toUrl: '',
  };

  gotoInfo = e => {
    e.stopPropagation();
    //TODO页面跳转
    console.log('go to recipe info');
    Taro.navigateTo({
      url: `/pages/bill/bill-detail/index?storeId=${this.props.storeId}&contentId=${this.props.contentId}`,
    });
    // utils.navigateToH5({
    //   page:
    //     this.props.toUrl.replace("http://", "https://").indexOf("http") > -1
    //       ? this.props.toUrl.replace("http://", "https://")
    //       : `https://${this.props.toUrl}`,
    // });
  };

  render() {
    return (
      <View className='recipe-item' onClick={this.gotoInfo}>
        <View className='img-wrap'>
          <Image src={this.props.imgSrc} className='img' />
        </View>
        <View className='txt-wrap'>
          {this.props.title && (
            <View className='title-wrap'>
              <Text className='title'>{this.props.title}</Text>
            </View>
          )}
          {this.props.time && (
            <View className='des-item'>
              时间：
              {this.props.time}
            </View>
          )}
          {this.props.cookBookDifficultInfo && (
            <View className='des-item'>
              {this.props.cookBookDifficultInfo.desc}
            </View>
          )}
        </View>
      </View>
    );
  }
}
