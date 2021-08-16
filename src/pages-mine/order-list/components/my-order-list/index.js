import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { filterImg, px2vw } from '../../../../utils/common/utils';
import { theme } from '../../../../common/theme';
import './index.scss';

export default class MyOrderList extends Component {
  constructor(props) {
    super(props);
    const { info } = this.props;
    let minute = '',
      seconds = '';
    if (info && info.remainingPayTime) {
      minute = this.formatDateTime(info.remainingPayTime)[0];
      seconds = this.formatDateTime(info.remainingPayTime)[1];
    }
    this.state = {
      minute: minute,
      seconds: seconds,
    };
  }

  componentWillMount() {
    const { info } = this.props;
    // 如果是去支付状态，进行倒计时 && 不是大客户订单
    if (info.state === 2 && info.remainingPayTime && !info.majorAccount) {
      this.handlerTime(info.remainingPayTime);
    }
  }

  onOrderDetail(info, ev) {
    ev && ev.stopPropagation();
    this.props.onOrderDetail(info);
  }

  onDelete(info, ev) {
    ev && ev.stopPropagation();
    this.props.onDelete(info);
  }

  onGoBuy(info, item, ev) {
    ev && ev.stopPropagation();
    this.props.onGoBuy(info, item);
  }

  formatDateTime = time => {
    let dayOfMil = 24 * 60 * 60 * 1000,
      hourOfMil = 60 * 60 * 1000,
      minOfMil = 60 * 1000,
      secOfMil = 1000,
      hourOffset = time % dayOfMil,
      minuteOffset = hourOffset % hourOfMil,
      seccondOffset = minuteOffset % minOfMil,
      m = Math.floor(minuteOffset / minOfMil),
      s = Math.floor(seccondOffset / secOfMil),
      str = [m < 10 ? '0' + m : m, s < 10 ? '0' + s : s];
    return str;
  };
  
  // 放心购点击跳转
  onFreeBuy = ev => {
    ev && ev.stopPropagation();
    this.props.onFreeBuy();
  };

  // 订单倒计时
  handlerTime = time => {
    if (time) {
      this.countDown = setInterval(() => {
        if (time > 999) {
          time = time - 1000;
          this.setState({
            minute: this.formatDateTime(time)[0],
            seconds: this.formatDateTime(time)[1],
          });
        } else {
          clearInterval(this.countDown);
          this.props.onHandlerTime();
        }
      }, 1000);
    }
  };

  render() {
    const { info } = this.props;
    const { minute, seconds } = this.state;
    let status = false;
    if (info && info.stateButtons) {
      for (let i = 0; i < info.stateButtons.length; i++) {
        if (
          info.stateButtons[i].buttonId !== 10 &&
          info.stateButtons[i].buttonId !== 11
        ) {
          status = true;
        }
      }
    }
    const deletePicture =
      'https://m.360buyimg.com/img/jfs/t1/74984/5/4043/546/5d22ebf3E4d8a1750/fbe69f31bda49793.png';
    return (
      info && (
        <View
          className='my-order-list'
          onClick={this.onOrderDetail.bind(this, info)}
        >
          <View className='my-order-title'>
            <View className='left'>
              <Image
                src={filterImg(
                  info && info.tenantInfo && info.tenantInfo.circleLogo,
                  'shoplogo'
                )}
                className='shopImg'
                mode='aspectFit'
                lazy-load
              />
              <Text className='shopName'>
                {info && info.tenantInfo && info.tenantInfo.tenantName}
              </Text>
            </View>
            <View className='right'>
              {/* state:1:新订单;2:等待付款;3:已付款;4:暂停下传;5:等待拣货;6:等待发货;7:配送中;8:待自提;9:完成 */}
              <View
                className='status'
                style={{
                  color:
                    info.state === 2 ||
                    info.state === 3 ||
                    info.state === 5 ||
                    info.state === 8
                      ? theme.color
                      : '#252525',
                }}
              >
                {info.stateTitle}
              </View>
              <View className='split-line' />
              <Image
                src={filterImg(deletePicture)}
                onClick={this.onDelete.bind(this, info)}
                className='deletePicture'
                mode='aspectFit'
                lazy-load
              />
            </View>
          </View>

          {info && info.periodList && (
            <View className='period-cont'>
              <Text
                className='showPeriodInfo'
                style={{ background: theme.btnColor }}
              >
                {info.periodList.showPeriodInfo}
              </Text>
              <Text className='date'>{info.periodList.showPeriodSendData}</Text>
            </View>
          )}

          <View className='my-order-goods'>
            {info && info.skuInfoWebList.length > 1 ? (
              <View className='my-order-panel'>
                <View className='goods-list-cont'>
                  <View className='goods-list'>
                    {info.skuInfoWebList &&
                      info.skuInfoWebList.map((value, index) => {
                        return (
                          <View className='item' key={index.toString()}>
                            <Image
                              src={filterImg(value.imageUrl)}
                              className='good-img'
                            />
                          </View>
                        );
                      })}
                  </View>
                </View>
                {/* <View className='goods-mask'>
                  <View className='goods-white'></View>
                  {info.skuInfoWebList.length}个物品
                </View> */}
              </View>
            ) : (
              <View className='my-order-only'>
                {info && info.skuInfoWebList && (
                  <View className='goods-only'>
                    <Image
                      src={filterImg(info.skuInfoWebList[0].imageUrl)}
                      className='good-img'
                      mode='aspectFit'
                      lazy-load
                    />
                    <View className='goods-only-sku'>
                      {info.skuInfoWebList[0].skuName && (
                        <View className='skuName'>
                          {info.skuInfoWebList[0].skuName}
                        </View>
                      )}
                      {info.skuInfoWebList[0].saleSpecDesc && (
                        <View className='skuRule'>
                          规格：{info.skuInfoWebList[0].saleSpecDesc}
                        </View>
                      )}
                      {((info.periodList &&
                        info.skuInfoWebList &&
                        info.skuInfoWebList[0].serviceTag) ||
                        (info.skuInfoWebList &&
                          info.skuInfoWebList[0].tasteInfo)) && (
                        <View className='serviceTag'>
                          {info.periodList &&
                            info.skuInfoWebList &&
                            info.skuInfoWebList[0].serviceTag &&
                            `加工：${info.periodList &&
                              info.skuInfoWebList &&
                              info.skuInfoWebList[0].serviceTag}`}
                          {info.skuInfoWebList[0].tasteInfo}
                        </View>
                      )}
                       <View className='sku-total'>
                        <View className='sku-price'>
                          {info.skuInfoWebList[0].jdPrice}
                        </View>
                        <View className='sku-buyunit'>
                          {info.skuInfoWebList[0].buyUnit}
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                <View className='goods-number'>x1</View>
              </View>
            )}
          </View>
          <View className='my-order-price'>
            <View className='order-price-left'>
              {info && info.easyBuy && (
                <View
                  className='order-easy-buy'
                  onClick={this.onFreeBuy.bind(this)}
                >
                  <View className='left-con' />
                  本单支持放心购服务
                  <View className='right-con' />
                </View>
              )}
            </View>

            <View className='order-price-right'>
              <Text className='grey'>
                共{info.skuInfoWebList.length}种 实付款：
              </Text>
              <Text className='red'>
                <Text className='litter'>¥</Text>
                <Text className='big'>{info.shouldPrice}</Text>
              </Text>
            </View>
          </View>
          <View
            className='my-order-bottom'
            style={{
              borderTop: status ? '1px solid rgba(0,0,0,0.05)' : 'none',
            }}
          >
            {info &&
              info.stateButtons.map((item, index) => {
                return (
                  <View key={index}>
                    {info.state !== 2 &&
                      item.buttonId !== 6 &&
                      item.buttonId !== 8 &&
                      item.buttonId !== 9 &&
                      item.buttonId !== 10 &&
                      item.buttonId !== 11 &&
                      item.buttonId !== 12 &&
                      item.buttonId !== 13 &&
                      item.buttonId !== 14 && (
                        <View
                          className='my-order-btn'
                          style={{
                            borderColor: '#898989',
                            color: '#252525',
                          }}
                          onClick={this.onGoBuy.bind(this, info, item)}
                        >
                          {item.buttonText}
                        </View>
                      )}
                    {/* {info.state === 2 && item.buttonId === 1 && ( */}
                    {info.state === 2 && (
                      <View
                        className='my-green-order-btn'
                        style={{
                          width: !info.majorAccount ? px2vw(184) : px2vw(110),
                        }}
                        onClick={this.onGoBuy.bind(this, info, item)}
                      >
                        {item.buttonText}
                        {minute}
                        {minute ? ':' : ''}
                        {seconds}
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        </View>
      )
    );
  }
}
