import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class SearchEmpty extends Component {
  render() {
    const {
      imgUrl,
      goHome,
      showButton,
      batchId,
      lineOne,
      lineTwo,
    } = this.props;
    return (
      <View
        className='search-empty'
        style={{
          marginTop: showButton ? '25%' : 0,
        }}
      >
        <View className='container'>
          <View className='img'>
            <Image
              className='img-info'
              src={imgUrl}
              alt='七鲜'
              mode='aspectFit'
              lazyLoad
            />
          </View>
          <View className='txt'>
            {!batchId && <View>{lineOne || '没有找到商品哦~'}</View>}
            <View>
              {lineTwo ||
                (!batchId ? `换个词再试试吧` : `抱歉，没有相关的结果`)}
            </View>
          </View>
          {showButton === true && !batchId && (
            <View className='btn' onClick={goHome}>
              去首页逛逛
            </View>
          )}
        </View>
      </View>
    );
  }
}
