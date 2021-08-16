import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';

import './index.scss';

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    data: {
      commentSmImages: [],
    },
  };

  transformIntToArray = num => {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(i);
    }
    return arr;
  };

  preview = (index, urls) => {
    Taro.previewImage({
      current: index,
      urls: urls.map(url => (url.indexOf('http') > -1 ? url : 'https:' + url)),
    });
  };

  render() {
    const { data } = this.props;
    const commentSmImages = data.commentSmImages
      ? data.commentSmImages.slice(0, 4)
      : [];
    return (
      <View className='comment-item'>
        <View className='user'>
          <View className='user-info'>
            <View className='user-image'>
              <Image
                className='user-icon'
                src={
                  data.pinImage
                    ? data.pinImage.indexOf('http') > -1
                      ? data.pinImage
                      : 'https:' + data.pinImage
                    : `https://m.360buyimg.com/img/jfs/t7351/109/3906725721/3345/b8e59dd6/59fbd6baN77bc8a77.png!q70`
                }
              />
            </View>
            <View className='user-detail'>
              <View className='name'>{data.nickName || ''}</View>
              <View className='score'>
                <View className='emoji'>
                  {data.score > 2 && <View className='good'>好评</View>}
                  {data.score === 2 && <View className='normal'>中评</View>}
                  {data.score === 1 && <View className='bad'>差评</View>}
                </View>
              </View>
            </View>
          </View>
          {/* <View className="time">{data.createTime}</View> */}
        </View>
        <View className='content'>{data.content}</View>
        <View className='images'>
          {commentSmImages.slice(0, 4).map((image, index) => (
            <View className='image-box' key={index}>
              <Image
                className='image'
                mode='aspectFill'
                onClick={this.preview.bind(
                  this,
                  index,
                  data.commentBigImages
                    ? data.commentBigImages
                    : data.commentImages
                    ? data.commentImages
                    : data.commentSmImages
                )}
                src={filterImg(image)}
              />
              {data.commentSmImages.length > 4 && index === 3 && (
                <View className='image-num'>{`共${data.commentSmImages.length}张`}</View>
              )}
            </View>
          ))}
        </View>
        {!!data.skuDesc && <View className='sku-desc'>{data.skuDesc}</View>}
      </View>
    );
  }
}
