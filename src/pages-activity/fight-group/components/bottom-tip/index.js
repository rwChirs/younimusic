import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components';
import CountDown from '../../../../components/count-down';
import './index.scss';
import { userDefaultPicture } from '../../utils/images';

export default class BottomTip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = info => {
    this.props.onClick(info);
  };

  static defaultProps = {
    desc: {},
  };

  stopTouchMove = () => {
    return false;
  };

  render() {
    const { list, desc } = this.props;

    // let message = '';
    // if(desc.cancelType){
    //   if(desc.cancelType===2){
    //     message = '抱歉，商品已抢光';
    //   }else if(desc.cancelType===3){
    //     message = '抱歉，拼团已结束';
    //   }else if(desc.cancelType===4){
    //     message = '抱歉，商品已下架';
    //   }else if(desc.cancelType === 5){
    //     message =  '该地址不在配送范围之内';
    //   }
    // }

    return (
      <View>
        {!desc.cancelType && list && list.length > 0 && (
          <View className='bottom-tip-page'>
            <Swiper
              className='swiper'
              interval={5000}
              duration={1000}
              autoplay
              circular
              vertical
            >
              {list &&
                list.map((info, index) => {
                  return (
                    <SwiperItem
                      className='bottom-tip-main'
                      taroKey={String(index)}
                      key={index}
                      catchtouchmove={this.stopTouchMove}
                    >
                      <Image
                        src={
                          info.memberInfo.avatar
                            ? info.memberInfo.avatar
                            : userDefaultPicture
                        }
                        mode='aspectFit'
                        className='user-img'
                      />
                      <View className='word'>
                        {info.memberInfo.nickname
                          ? info.memberInfo.nickname
                          : ''}
                        的团只差<Text className='red'>{info.needNum}</Text>人
                      </View>
                      <View className='time'>
                        <Text>剩余</Text>
                        <CountDown
                          seconds={(info.endTime - new Date()) / 1000}
                          type='default'
                          marginLeft='0px'
                        />
                      </View>
                      <View
                        className='btn'
                        onClick={this.onClick.bind(this, info)}
                      >
                        跟TA拼
                      </View>
                    </SwiperItem>
                  );
                })}
            </Swiper>
          </View>
        )}
        {/* {  desc.cancelType &&
                <View className="bottom-tip-yellow">
                  {message}
                </View>
            } */}
      </View>
    );
  }
}
