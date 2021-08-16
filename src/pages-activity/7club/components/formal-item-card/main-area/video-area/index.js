import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import './index.scss';
import { filterImg, images, px2vw } from '../../../../utils';

export default class VideoArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPoster: true,
    };
  }

  componentDidMount() {}

  render() {
    const { showPoster } = this.state;
    const { data } = this.props;
    let radioTmp = Number(data && data.width) / Number(data && data.high);
    return data ? (
      // 宽>高时 ==》 宽:690, 计算高
      // 宽<高时 ==》 最大高度400，计算宽
      <View
        className='video-area'
        style={{
          width:
            Number(data.width) > Number(data.high)
              ? px2vw(690)
              : Number(data.high) > 400
              ? px2vw(800 * radioTmp)
              : px2vw(Number(data.high) * 2 * radioTmp),
          height:
            Number(data.width) > Number(data.high)
              ? px2vw(690 / radioTmp)
              : Number(data.high) > 400
              ? px2vw(800)
              : px2vw(Number(data.high) * 2),
        }}
      >
        <Image
          className='cover-img'
          mode='aspectFill'
          src={filterImg(
            data.coverImg ||
              (data.images && data.images[0]) ||
              images.default7clubImg
          )}
          style={{ display: showPoster ? 'block' : 'none' }}
        />
        <Image
          className='player-img'
          src='https://m.360buyimg.com/img/jfs/t1/49240/35/9163/6656/5d6ce5ccEe47e6766/9466d3430fcd5e3e.png'
          style={{ display: showPoster ? 'block' : 'none' }}
        />
      </View>
    ) : (
      <View></View>
    );
  }
}
