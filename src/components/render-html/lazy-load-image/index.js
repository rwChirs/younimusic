import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';

export default class LazyLoadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageWidth: 0,
      imageHeight: 0,
    };
  }

  imageLoad = e => {
    this.setState({
      imageWidth: e.detail.width,
      imageHeight: e.detail.height,
    });
  };

  render() {
    const { src, width } = { ...this.props };
    const { imageWidth, imageHeight } = this.state;
    return (
      <View style='font-size: 0;'>
        <Image
          src={(src.indexOf('http') > -1 ? src : `https:${src}`).replace(
            '.webp',
            ''
          )}
          lazyLoad
          style={`width: ${width}px; height: ${(width / imageWidth) *
            imageHeight}px;`}
          onLoad={this.imageLoad}
        />
      </View>
    );
  }
}
