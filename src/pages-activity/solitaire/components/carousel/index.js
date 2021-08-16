import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class FreshCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPreview = (index, e) => {
    this.props.onPreview(index, e);
  };

  render() {
    const { imgList } = this.props;
    const productDefaultPicture =
      'https://m.360buyimg.com/img/jfs/t1/10366/26/8278/700/5c3455c6E7713217b/bf369c461fca9fd9.png';
    return (
      <View className='carousel-page'>
        <View
          className='carousel-left-picture'
          onClick={this.onPreview.bind(this, 0)}
        >
          <Image
            src={imgList[0] ? imgList[0] : productDefaultPicture}
            mode='aspectFit'
            lazyLoad
            className='img'
          />
        </View>
        <View className='carousel-right-picture'>
          <View
            className='carousel-right-shadow'
            onClick={this.onPreview.bind(this, 3)}
          />
          <View className='carousel-right-length'>共{imgList.length}张</View>
          {imgList &&
            imgList
              .concat(
                Array &&
                  Array.apply(null, {
                    length: 4 - imgList.length > 0 ? 4 - imgList.lengt : 0,
                  })
              )
              .map((info, index) => {
                return (
                  <View key={index} onClick={this.onPreview.bind(this, index)}>
                    {index > 0 && index < 4 && (
                      <Image
                        src={info || productDefaultPicture}
                        width={208}
                        height={208}
                        mode='aspectFit'
                        lazyLoad
                        className='img'
                      />
                    )}
                  </View>
                );
              })}
        </View>
      </View>
    );
  }
}
