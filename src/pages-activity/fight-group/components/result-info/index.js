import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Button } from '@tarojs/components';
import Title from '../title';
import CountDown from '../../../../components/count-down';
import UserTop from '../user-top';
import './index.scss';

export default class ResultInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    payOrderInfo: {},
  };

  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    const { endTime, payOrderInfo, resource, openType } = this.props;

    let fightMember =
      payOrderInfo &&
      payOrderInfo.groupInfoWeb &&
      payOrderInfo.groupInfoWeb.needCount;
    return (
      <View className='result-detail-modal'>
        {fightMember > 0 && endTime ? (
          <View className='main'>
            <View className='title'>
              <Title
                title='距结束'
                isHaveIcon
                margin={13.4}
                color='#FE4242'
                lineWidth={32.2}
                fontSize={15}
              />
            </View>
            <View className='time'>
              <CountDown
                seconds={payOrderInfo.groupInfoWeb.endTime / 1000}
                width='32.2px'
                height='29.5px'
                fontSize='15px'
                background='linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))'
                splitColor='#F13E2A'
                splitSpace='4px'
                borderRadius='3px'
              />
            </View>
            <View className='desc-info'>
              还差<Text className='red'>{fightMember}</Text>人拼团成功
            </View>
          </View>
        ) : (
          <View className='title-ok'>团长人气太高，此团已满！</View>
        )}

        <View className='fight-user-top'>
          {payOrderInfo && (
            <UserTop
              list={
                payOrderInfo &&
                payOrderInfo.groupInfoWeb &&
                payOrderInfo.groupInfoWeb.grouponMemberInfos
                  ? payOrderInfo.groupInfoWeb.grouponMemberInfos
                  : []
              }
              type={fightMember}
              resource={resource}
            />
          )}
        </View>
        <Button
          style={{
            fontSize: '36rpx',
            fontFamily:
              resource === 'result'
                ? 'PingFangSC-Regular'
                : 'PingFangSC-Medium',
          }}
          className='fight-big-btn'
          openType={openType}
          onClick={this.onClick}
        >
          喊好友参团
        </Button>
      </View>
    );
  }
}
