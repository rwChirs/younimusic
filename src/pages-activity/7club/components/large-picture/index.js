import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import ClubPageBottom from '../club-page-bottom';
import './index.scss';

export default class LargePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      current: 0,
    };
  }

  componentWillMount() {
    Taro.getSystemInfo().then(res => {
      this.setState({
        windowWidth: res.windowWidth,
      });
    });
    const { current } = this.props.data;
    this.setState({
      current,
    });
  }

  onChange = e => {
    this.setState({
      current: e.detail.current,
    });
  };

  closeLargePic = () => {
    Taro.eventCenter.trigger('close7clubLargePic');
  };

  render() {
    const { data, cartNum, onGoCart, onShowDialog } = this.props;
    const { pictureAspect, isShow } = data;

    const { windowWidth, current } = this.state;
    const h = windowWidth / pictureAspect;
    return (
      <View className='index' style={{ display: isShow ? 'block' : 'none' }}>
        <View className='head'>
          <Image
            className='img'
            src={filterImg(
              'https://m.360buyimg.com/img/jfs/t1/72908/21/8775/349/5d68eb72E1f0156ce/c174e2b1cf8659f7.png!q70.dpg'
            )}
            onClick={this.closeLargePic}
          />
        </View>
        <View className='current'>
          {current + 1}/{data.items.length}
        </View>
        <Swiper
          className='swiper'
          style={{ height: h + 'px' }}
          current={current}
          onChange={this.onChange}
        >
          {data.items.map((item, index) => (
            <SwiperItem key={index}>
              <Image className='img' src={item} mode='aspectFit' />
              <View>{item.image}</View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className='bottom-wrap'>
          <ClubPageBottom
            showLike={false}
            showShare={false}
            onClickRightBtn={onShowDialog}
            onGoCart={onGoCart}
            cartNum={cartNum}
            data={data}
          />
        </View>
      </View>
    );
  }
}
