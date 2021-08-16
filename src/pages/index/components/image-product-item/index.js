// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class ImageProductItem extends Component {
  static defaultProps = {
    itemStyle: {},
    data: {},
  };

  onGoToUrl = () => {
    const { data, onGoToUrl } = this.props;
    onGoToUrl(data.action);
  };

  render() {
    const { data, itemStyle } = this.props;
    return (
      <View className='product-item' style={itemStyle} onClick={this.onGoToUrl}>
        <Image className='image' src={filterImg(data.image)} mode='aspectFit' />
      </View>
    );
  }
}
