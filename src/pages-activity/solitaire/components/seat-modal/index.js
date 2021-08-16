import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import FreshSeatContain from '../seat-contain';
import FreshSeatTitle from '../seat-title';
import FreshProductButton from '../../../../components/product-button'
import { px2vw, iosTrouchFn } from '../../../../utils/common/utils';
import './index.css';

export default class SeatModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      platform: '',
    };
  }

  static defaultProps = {
    title: '',
    list: [],
    current: {},
  };

  static propTypes = {};

  componentDidMount() {
    //修复iOS橡皮筋问题
    this.isIosStopScroll();
  }

  isIosStopScroll = () => {
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          platform: res.platform,
        }),
          () => {
            if (this.state.platform === 'ios') {
              var divEl = document.getElementById('seatModalList');
              if (divEl) {
                iosTrouchFn(divEl);
              }
            }
          };
      },
    });
  };

  onScrollToLowerFuc = () => {
    const { onScrollToLower } = this.props;
    if (onScrollToLower && typeof onScrollToLower === 'function') {
      onScrollToLower();
    }
  };

  render() {
    let { title, list, total, current, show, onClose } = this.props;
    return (
      <View className='seat-modal' style={{ display: show ? 'block' : 'none' }}>
        <View className='modal' onTouchMove={this.touchMove} />
        <View className='main' style={{ height: px2vw(860) }}>
          <View className='header' onTouchMove={this.touchMove}>
            {total && (
              <FreshSeatTitle
                title={title}
                isHaveFlower
                subtitle={`已接龙${total}个席位`}
              />
            )}
          </View>
          <View className='contain' id='seatModalList'>
            {/* <FreshSeatContain
              list={list}
              current={current}
              show={show}
              onScrollToLower={this.onScrollToLowerFuc.bind(this)}
            /> */}
          </View>

          <View className='footer' style={{ zIndex: 2 }}>
            <View style={{ width: '100%' }}>
              <FreshProductButton
                name='关闭'
                borderRadius={[0, 0, 0, 0]}
                color='rgb(154, 81, 52)'
                width='100%'
                onClick={onClose}
                background='linear-gradient(to right, rgb(255, 220, 124), rgb(255, 183, 102))'
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
