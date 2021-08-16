// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class ChangeBusinessesLayer extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.timer = null;
  }

  componentDidMount() {
    const { onHandelShow } = this.props;
    this.timer = setTimeout(() => {
      //Taro.setStorageSync('isShowChangeBusinessesLayer', 2);
      onHandelShow();
    }, 2500);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const { newImg, originalImg, storeName } = this.props;
    return (
      <View>
        {newImg && originalImg && (
          <View>
            <View className='change-businesses-layer' />
            <View className='change-businesses'>
              <View className='businesses-logo'>
                <View className='new-businesses lazy-load-img'>
                  <Image className='new-businesses-img' src={newImg} lazyLoad />
                </View>
                <View className='original-businesses lazy-load-img'>
                  <Image
                    className='original-businesses-img'
                    src={filterImg(originalImg)}
                    lazyLoad
                  />
                </View>
              </View>
              <View className='change-tip'>
                <View className='change-tip-top'>{`为您切换至${storeName}店铺`}</View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
