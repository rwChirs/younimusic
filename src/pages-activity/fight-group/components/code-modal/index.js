import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Image, Text } from '@tarojs/components';
import { FreshProductItemBtn } from '../../../../components/product-item-btn';
import { fightSquare, close } from '../../utils/images';
import { getExposure } from '../../../../utils/common/exportPoint';
import GoTeamEasy from '../go-team-easy';
import './index.scss';

export default class CodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static defaultProps = {};

  componentDidMount() {
    this.newCouponExposure();
  }

  newCouponExposure = () => {
    const params = {
      eid: '7FRESH_APP_9_20200811_1597153579446|77',
    };
    getExposure(params);
  };

  onClick = info => {
    this.props.onClick(info);
  };

  onClose = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  render() {
    const { type, show, img, list, desc, totalAmount } = this.props;
    let teamList = [];
    if (desc && desc.indexOf('br') > -1) {
      teamList = desc.split('br');
    }

    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' />
        <View
          className='info-modal-content'
          style={{
            top:
              type === 4 || type === 3 || type === 5 || type === 7
                ? '80px'
                : type === 1
                ? '200px'
                : '20px',
            left: 0,
          }}
        >
          {type === 1 && (
            <View className='info-modal-wx'>
              <View className='info-modal-wx-title'>需要在小程序上拼团哦</View>
              <View className='info-modal-wx-sub-title'>长按识别小程序码</View>
              <Image className='info-modal-wx-img' src={img} />
            </View>
          )}
          {type === 3 && (
            <View className='info-modal-team'>
              <View className='info-modal-team-title'>
                <View className='info-modal-team-leftLine'>
                  <View className='info-modal-team-line-circle-l' />
                </View>
                <View className='info-modal-team-content'>邀新团</View>
                <View className='info-modal-team-rightLine'>
                  <View className='info-modal-team-line-circle-r' />
                </View>
              </View>
              {teamList &&
                teamList.map((info, index) => {
                  return (
                    <View className='info-modal-team-desc' key={index}>
                      {info}
                    </View>
                  );
                })}
              <View className='info-team-btn'>
                <FreshProductButton
                  name='我知道了'
                  borderRadius={['0', '44rpx', '44rpx', '44rpx']}
                  color='rgb(255, 255, 255)'
                  width='400'
                  onClick={this.onClose.bind(this)}
                  background='linear-gradient(to right, rgb(255, 109, 109), rgb(253, 50, 50))'
                  boxShadow='0 5px 10px 0 rgba(255, 109, 109, 0.4)'
                />
              </View>
            </View>
          )}
          {type === 4 && (
            <View className='square-modal'>
              <View className='title'>
                <Image
                  src={fightSquare}
                  onClick={this.onClose.bind(this)}
                  className='title-img'
                />
              </View>
              <View className='content-list'>
                {list &&
                  list.map((info, index) => {
                    return (
                      <View className='go-team-modal' key={index}>
                        <GoTeamEasy
                          info={info}
                          onClick={this.onClick.bind(this, info)}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          )}

          {type === 5 && (
            <View className='new-coupon'>
              <View className='new-amount'>
                ￥ <Text className='new-amount-count'>{totalAmount}</Text>
              </View>
              <View className='new-info'>新·人·专·享·券</View>
              <View className='new-get' onClick={this.onClick.bind(this)}>
                一键领取
              </View>
            </View>
          )}

          {type === 6 && (
            <View className='remind'>
              <Image
                className='remind-pic'
                src='//m.360buyimg.com/img/jfs/t1/155946/40/5403/123243/5ffbc250E7d8e27b2/690b588c62c276e9.png'
                alt=''
              />
            </View>
          )}

          {type === 7 && (
            <View className='restart' onClick={this.onClose.bind(this)}>
              <View className='title'>开启失败</View>
              <Image
                className='restart-pic'
                src='//m.360buyimg.com/img/jfs/t1/156504/3/5388/98666/5ffbd41eE7c2df09b/1a5796a5ad5fae5b.png'
                alt=''
              />
              <View className='notice'>
                您未勾选“
                <Text className='always'>总保持以上选择，不再询问</Text>”
              </View>
              <View className='restart-but'>重新开启</View>
            </View>
          )}

          {type === 1 ||
            type === 3 ||
            (type === 4 && (
              <View className='close-btn'>
                <Image
                  src={close}
                  onClick={this.onClose.bind(this)}
                  className='close-btn-img'
                />
              </View>
            ))}
        </View>
      </View>
    ) : null;
  }
}
