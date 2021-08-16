import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import FreshServiceCountDown from '../service-count-down';
import './index.scss';

/* 如果当前商品不在配送范围内就返回3，如果在配送范围内，看活动状态是否已经结束，如果结束了返回2，如果没有结束，但是商品没有上架，也返回2，
  status 总共4个状态：0进行中 1未开始 2已结束 3不在配送范围内 */

export default class FreshSolitaireBtn extends Component {
  render() {
    const {
      status,
      startShowStatus,
      buttonText,
      currentPrice,
      money,
      dateTime,
      personStatus, // canLeader的返回值，true是团长，false普通人
      onTimeEnd,
      onGoSolitaireList,
      onGoOrder,
      onGoCart,
      onShare,
      cartNum,
      openType,
    } = this.props;
    // type 控制样式
    const type = personStatus ? true : !!(status === 0 || status === 3);
    const iconObj = {
      home:
        'https://m.360buyimg.com/img/jfs/t1/30716/28/11657/1751/5cb56b09E5348f575/94225db5291f8a8b.png',
      cart:
        '//m.360buyimg.com/img/jfs/t1/96285/37/4741/2034/5de8b677Ec3486db2/f5307513a55cc0e6.png',
    };
    return (
      <View className='solitaire-btn-new'>
        <View className='home' onClick={onGoSolitaireList}>
          <Image
            className='lazyload picture'
            alt='团长首页'
            src={iconObj.home}
          />
          <Text className='title'>团长首页</Text>
        </View>
        <View className='home' onClick={onGoCart}>
          <Image className='lazyload picture' alt='购物车' src={iconObj.cart} />
          {cartNum > 0 && (
            <View className='cart-num'>
              {parseInt(cartNum) <= 99 ? cartNum : '99+'}
            </View>
          )}
          <Text className='title'>购物车</Text>
        </View>

        {personStatus ? (
          <View className='right'>
            {/* 进行中 */}
            {status !== 2 && status !== 1 && (
              <View className='middle' onClick={onGoOrder}>
                <Text className='price'>¥{currentPrice}</Text>
                <Text className='description'>加入购物车</Text>
              </View>
            )}
            {/* 未开始 */}
            {status === 1 && (
              <View className='middle'>
                <View className='next-solitaire'>
                  <Text className='next-title'>距开始剩余</Text>
                  {startShowStatus === 1 ? (
                    <FreshServiceCountDown
                      seconds={dateTime / 1000}
                      triggerStart
                      onTimeEnd={onTimeEnd}
                      background='rgb(166, 29, 28)'
                      color='rgb(255,255,255)'
                      borderRadius={[6, 6, 6, 6]}
                      width={48}
                      height={44}
                      splitColor='rgb(166, 29, 28)'
                      fontSize={30}
                      splitSpace={5}
                      splitFontWeight='normal'
                      splitDayColor='rgb(166, 29, 28)'
                      splitFontSize={16}
                    />
                  ) : (
                    <View className='day'>{dateTime}</View>
                  )}
                </View>
              </View>
            )}

            {status !== 2 && (
              <Button
                className='light-button'
                openType={openType}
                onClick={onShare}
              >
                <Text className='current-price'>{money}</Text>
                <View className='current-desc'>分享赚</View>
              </Button>
            )}
            {status === 2 && (
              <View className='disabled-team-button'>{buttonText}</View>
            )}
          </View>
        ) : (
          <View className='right' style={{ width: '52%' }}>
            {type ? (
              <View
                className='light-button'
                style={{
                  background:
                    status !== 3 || status !== 4
                      ? 'linear-gradient(to right, rgb(255, 220, 124), rgb(255, 183, 102))'
                      : 'rgb(216, 216, 216)',
                }}
                onClick={onGoOrder}
              >
                <Text
                  className='current-price'
                  style={{
                    color:
                      status !== 3 || status !== 4
                        ? 'rgb(121, 47, 37)'
                        : '#8B8D92',
                  }}
                >
                  ¥{currentPrice}
                </Text>
                <Text
                  className='current-desc'
                  style={{
                    color:
                      status !== 3 || status !== 4
                        ? 'rgb(121, 47, 37)'
                        : '#8B8D92',
                  }}
                >
                  加入购物车
                </Text>
              </View>
            ) : (
              <View
                className='disabled-button'
                style={{ width: status === 2 ? '100%' : '50%' }}
              >
                {dateTime && status === 1 && (
                  <View className='next-solitaire'>
                    <Text className='next-title'>距离开始</Text>
                    {startShowStatus === 1 ? (
                      <FreshServiceCountDown
                        seconds={dateTime / 1000}
                        triggerStart
                        onTimeEnd={onTimeEnd}
                        background='rgb(121, 47, 37)'
                        color='rgb(225,225,146)'
                        borderRadius={[5, 5, 5, 5]}
                        width={42}
                        height={40}
                        splitColor='rgb(166, 29, 28)'
                        fontSize={24}
                        splitSpace={5}
                        splitFontWeight='normal'
                        splitDayColor='#000'
                        splitFontSize={16}
                      />
                    ) : (
                      <View className='day'>{dateTime}</View>
                    )}
                  </View>
                )}
                {status === 2 && <View>{buttonText}</View>}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
