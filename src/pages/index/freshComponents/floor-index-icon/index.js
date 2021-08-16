import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import { filterImg } from '../../../../utils/common/utils';
import './index.scss';

export default class FreshFloorIndexIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      left: '0',
    };
  }

  iconStyle = () => {
    const { data } = this.props;
    const { showType } = data; // showType: 0: 单行，1: 双行

    // 1:一行不可横滑，2: 一行可横滑，3: 两行不可横滑，4: 两行可横滑
    let type = 1;
    if (data.items && data.items.length) {
      if (showType === 0 && data.items.length === 5) {
        type = 1;
      }
      if (showType === 0 && data.items.length > 5) {
        type = 2;
      }
      if (showType === 1 && data.items.length === 10) {
        type = 3;
      }
      if (showType === 1 && data.items.length > 10) {
        type = 4;
      }
    }

    return type;
  };

  handleScroll = (e) => {
    const { scrollLeft, scrollWidth } = e.target;
    const windowWidth = Taro.getSystemInfoSync().windowWidth;
    const left = `${
      ((scrollLeft / (scrollWidth - windowWidth + 30)) * 100) / 2
    }%`;
    this.setState({ left });
  };

  render() {
    const { data, onClick } = this.props;
    const { showType } = data; // showType: 0: 单行，1: 双行
    const { left } = this.state;

    const type = this.iconStyle();

    const style = {
      1: {
        paddingLeft: 0,
        paddingRight: '5.4%',
        paddingBottom: 0,
      },
      2: {
        paddingLeft: 0,
        paddingRight: '3.7%',
        paddingBottom: Taro.pxTransform(20),
      },
      3: {
        paddingLeft: 0,
        paddingRight: '4.1%',
        paddingBottom: Taro.pxTransform(20),
      },
      4: {
        paddingLeft: 0,
        paddingRight: '3.1%',
        paddingBottom: Taro.pxTransform(20),
      },
    };
    const iconItem =
      data &&
      data.items &&
      data.items.length > 0 &&
      data.items.map((info, i) => {
        // 埋点增加字段,cf[https://cf.jd.com/pages/editpage.action?pageId=313554379]
        const action = {
          ...info.action,
          target: 3,
          imageUrl: info.image,
          index: i + 1,
        };
        return (
          <View
            className='icon-box'
            style={style[type || 1]}
            key={i.toString()}
            id={`floor-scroll-products-${data.floorType}-${data.sort}-${data.skuId}-${i}`}
            onClick={onClick.bind(this, action)}
          >
            <View
              className='img-box'
              style={{
                width: `${Taro.pxTransform(type === 1 ? 108 : 100)}`,
                height: `${Taro.pxTransform(type === 1 ? 108 : 100)}`,
              }}
            >
              <Image
                className='img-self'
                src={filterImg(info.image)}
                width={`${Taro.pxTransform(type === 1 ? 108 : 100)}`}
                height={`${Taro.pxTransform(type === 1 ? 108 : 100)}`}
                alt='icon'
              />
            </View>
            <View
              className='title'
              style={{
                color: data.contentbackGroudColor || 'rgba(71, 71, 72, 1)',
              }}
            >
              {info.title}
            </View>
          </View>
        );
      });

    return (
      <View
        className='floor-index-icon-wrap'
        style={{
          background: data.image
            ? `url(${filterImg(data.image)}) no-repeat`
            : data.backGroudColor || '#fff',
          backgroundSize: '100% 100%',
        }}
      >
        <View
          className={`floor-index-icon-box ${
            showType === 1 ? 'floor-index-icon-box-two' : ''
          }`}
          style={{
            background: showType === 1 ? '#fff' : '',
            paddingBottom:
              type === 4 ? Taro.pxTransform(20) : Taro.pxTransform(0),
          }}
        >
          <ScrollView
            id={`scrollview_${data.floorNum}`}
            lowerThreshold={0}
            scrollX={type === 2 || type === 4}
            scrollWithAnimation
            onScroll={this.handleScroll.bind(this)}
          >
            <View
              className={`floor-index-icon ${
                showType === 1 ? 'floor-index-icon-two' : ''
              }`}
              id={`scrollview_${data.floorNum}`}
            >
              {iconItem}
            </View>
          </ScrollView>
          {(type === 2 || type === 4) && (
            <View className='swipper-line'>
              <View className='swipper-tag' style={{ left }} />
            </View>
          )}
        </View>
      </View>
    );
  }
}
