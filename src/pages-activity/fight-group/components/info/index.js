import Taro from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Text } from '@tarojs/components';
import Title from '../title';
import CountDown from '../../../../components/count-down';
import UserTop from '../user-top';
import FightBigButton from '../button';
import { getPwdId, getPtPin } from '../../../../utils/adapter/index';
import './index.scss';

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    payOrderInfo: {},
  };

  onClick = (info, desc) => {
    this.props.onClick(info, desc);
  };

  onOpenTeam = () => {
    this.props.onOpenTeam();
  };

  render() {
    const { info, resource, openType } = this.props;

    const member = info && info.grouponMembers ? info.grouponMembers.length : 0;
    const fightMember =
      info && info.grouponScale - member ? info.grouponScale - member : 0;
    let btnTxt = '',
      oType = '';
    let pin = getPtPin() || getPwdId();
    let time = info && (info.endTime - new Date()) / 1000;

    if (fightMember > 0 && time > 0) {
      if (info && info.grouponMembers && info.grouponMembers.length > 0) {
        for (let i = 0; i < info.grouponMembers.length; i++) {
          if (info.grouponMembers[i].pin === pin) {
            btnTxt = '喊好友参团';
            oType = openType;
          } else {
            oType = '';
            btnTxt = '跟TA拼';
          }
        }
      } else {
        oType = '';
        btnTxt = '跟TA拼';
      }
    } else {
      oType = '';
      btnTxt = '我也要开团';
    }

    return (
      <View className='team-detail-modal-new'>
        {fightMember > 0 ? (
          <View className='main'>
            {time > 0 ? (
              <View>
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
                    seconds={time}
                    width='32.2px'
                    height='29.5px'
                    fontSize='15px'
                    background='linear-gradient(to right, rgb(255,109,109), rgb(253,50,50))'
                    splitColor='#F13E2A'
                    splitSpace='4px'
                    borderRadius='3px'
                    color='#fff'
                  />
                </View>
              </View>
            ) : (
              <View className='title'>
                <Title
                  title='活动结束'
                  isHaveIcon
                  margin={13.4}
                  color='#FE4242'
                  lineWidth={32.2}
                  fontSize={15}
                />
              </View>
            )}
            <View className='desc-info'>
              还差<Text className='red'>{fightMember}</Text>人拼团成功
            </View>
          </View>
        ) : (
          <View className='title-ok'>团长人气太高，此团已满！</View>
        )}

        <View className='fight-user-top'>
          {info && (
            <UserTop
              list={info.grouponMembers}
              type={fightMember}
              resource={resource}
            />
          )}
        </View>
        {btnTxt === '我也要开团' ? (
          <FightBigButton
            btnTxt={btnTxt}
            openType={oType}
            onClick={this.onOpenTeam}
            resource={resource}
          />
        ) : (
          <FightBigButton
            btnTxt={btnTxt}
            openType={oType}
            onClick={this.onClick.bind(this, info)}
            resource={resource}
          />
        )}
      </View>
    );
  }
}
