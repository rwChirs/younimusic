// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';

export default class FloorEntranceImg extends Component {
  static defaultProps = {
    entranceImg:
      'https://m.360buyimg.com/img/jfs/t1/39050/11/13506/5308/5d4946beEa820ed96/c72f45607eb93c67.png',
  };
  constructor(props) {
    super(props);
    this.state = {
      imageStatus: false,
    };
  }

  defaultImg =
    'https://m.360buyimg.com/img/jfs/t1/39050/11/13506/5308/5d4946beEa820ed96/c72f45607eb93c67.png';

  handleImageError() {
    this.setState({ imageStatus: true });
  }

  render() {
    let { entranceImg } = this.props;
    const { imageStatus } = this.state;
    if (imageStatus === true) {
      entranceImg = this.defaultImg;
    }
    return (
      <View>
        <View className='floor-entrance-img-div lazy-load-img'>
          <Image
            src={filterImg(entranceImg)}
            className='floor-entrance-img'
            onError={this.handleImageError.bind(this)}
            mode='aspectFill'
            lazyLoad
          />
        </View>
      </View>
    );
  }
}
