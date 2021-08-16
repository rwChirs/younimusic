import Taro, { getCurrentInstance } from '@tarojs/taro';
import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { px2vw, filterImg } from '../../../../utils/common/utils';
import  NewPersonCoupon  from '../../../../components/new-person-coupon';
import  NewPersonStepItem  from '../../../../components/new-person-step-item';
import './index.scss';

class NewPersonResultModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '0',
      hour: '00',
      minute: '00',
      second: '00',
    };
  }

  static defaultProps = {
    data: {
      taskAwardInfo: {},
      taskPointList: [],
    },
  };

  componentDidMount() {
    const { data } = this.props;
    this.showTime(data.activityEndTime);
  }

  componentWillUnmount() {
    //清除倒计时组件
    clearInterval(this.timer);
  }

  showTime = endTime => {
    let endTimes = endTime;
    this.mathTime(endTimes);
    let mathFuc = this.mathTime;
    this.timer = setInterval(() => {
      endTimes -= 1000;
      mathFuc(endTimes, this.timer);
    }, 1000);
  };

  mathTime = (endTimes, timer) => {
    var lefttime = endTimes, //endtime.getTime(), //距离结束时间的毫秒数
      leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
      lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
      leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
      lefts = Math.floor((lefttime / 1000) % 60); //计算秒数
    if (lefttime > 0) {
      this.setState({
        day: '' + leftd,
        hour: lefth < 10 ? '0' + lefth : lefth,
        minute: leftm < 10 ? '0' + leftm : leftm,
        second: lefts < 10 ? '0' + lefts : lefts,
      });
    } else {
      this.setState({
        day: 0,
        hour: '00',
        minute: '00',
        second: '00',
      });
      if (timer) {
        clearInterval(timer);
      }
    }
  };

  // setRenderType = (all, leftover) => {
  //   let val = parseInt(all, 10) - parseInt(leftover, 10);
  //   this.setState({
  //     renderType: val,
  //   });
  // };

  renderTime() {
    const { day, hour, minute, second } = this.state;
    return `${
      day !== '0' && day !== 0 ? `${day}天` : ''
    } ${hour} : ${minute} : ${second}`;
  }

  showTime = endTime => {
    let endTimes = endTime;
    this.timer = setInterval(() => {
      var lefttime = endTimes, //endtime.getTime(), //距离结束时间的毫秒数
        leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
        lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
        leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
        lefts = Math.floor((lefttime / 1000) % 60); //计算秒数
      endTimes -= 1000;
      if (endTimes > 0) {
        this.setState({
          day: '' + leftd,
          hour: lefth < 10 ? '0' + lefth : lefth,
          minute: leftm < 10 ? '0' + leftm : leftm,
          second: lefts < 10 ? '0' + lefts : lefts,
        });
      } else {
        this.setState({
          day: 0,
          hour: '00',
          minute: '00',
          second: '00',
        });
        clearInterval(this.timer);
      }
    }, 1000);
  };

  mathType = taskList => {
    let num = 0;
    if (taskList && taskList.length > 0) {
      taskList.forEach(element => {
        if (element.taskStatus === 3) {
          num += 1;
        }
      });
    }
    return num;
  };

  onCloseClick = () => {
    const { onClose } = this.props;
    onClose('know');
  };

  render() {
    const { show, isHome, onClose, onGoMoreTask, data } = this.props;
    const { taskAwardInfo } = data;
    const renderType = this.mathType(data.taskPointList);

    const couponImage =
      'm.360buyimg.com/img/jfs/t1/150492/36/5377/4793/5fa2425dEbf1714ee/765f9330d06d67af.png';
    const close =
      'https://m.360buyimg.com/img/jfs/t1/131959/28/20170/691/5fd9fe98E7a3288c4/aef0ef92fe73b948.png';
    const headerImage =
      'https://m.360buyimg.com/img/jfs/t1/134183/1/14880/25536/5fa276d6E7320a3b9/4e99d19a397f6c36.png';
    const fireworks =
      'm.360buyimg.com/img/jfs/t1/154468/32/4721/418152/5fa27a8aEd819399f/a0e4136221596a6f.png';
    const green =
      'm.360buyimg.com/img/jfs/t1/148871/2/19853/1394/5fe2f5dbE8d9c3636/1f3432538a7aac1d.png';
    console.log('【data】', data);
    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask'></View>
        <View
          className='info-modal-fireworks'
          style={{ backgroundImage: `url(${filterImg(fireworks)})` }}
        ></View>
        <View className='info-modal-content'>
          <View className='info-modal-n'>
            {/* 顶部 */}
            {taskAwardInfo && taskAwardInfo.couponInfoWeb && (
              <View className='info-modal-top'>
                <View
                  className='info-left'
                  style={{
                    backgroundImage: `url(${filterImg(couponImage)})`,
                  }}
                >
                  {taskAwardInfo.couponInfoWeb.couponMode === 1 ? (
                    <View className='coupon-content'>
                      <Text>￥</Text>
                      <Text className='large'>
                        {taskAwardInfo.couponInfoWeb.amountDesc}
                      </Text>
                    </View>
                  ) : (
                    <View className='coupon-content'>
                      <Text className='large'>
                        {taskAwardInfo.couponInfoWeb.discount}
                      </Text>
                      <Text>折</Text>
                    </View>
                  )}
                  <Text className='ps'>
                    {taskAwardInfo.couponInfoWeb.channelTypeName}
                  </Text>
                </View>
                <View className='info-right'>
                  <View className='h4s'>
                    <Image className='green-logo' src={filterImg(green)} />
                    {taskAwardInfo.taskName}
                  </View>
                  <View className='section'>{taskAwardInfo.awardText}</View>
                </View>
              </View>
            )}
            {/* 弹窗头部 */}
            <View
              className='modal-header'
              style={{
                backgroundImage: `url(${filterImg(headerImage)})`,
                backgroundColor: '#f08f49',
              }}
            >
              <View
                className='modal-text'
                style={{
                  paddingTop: isHome
                    ? renderType >= 3
                      ? px2vw(10)
                      : px2vw(26)
                    : '',
                }}
              >
                {data && data.subTitle && (
                  <View className='subTitle'>{data.subTitle}</View>
                )}

                <View className='h3s'>{data && data.title}</View>
              </View>
            </View>

            {/* 弹窗主体 */}
            <View className='modal-main'>
              {data.magicAwardInfo ? (
                <View className='coupon-box'>
                  <NewPersonCoupon
                    isModal
                    data={data.taskAwardInfo}
                    couponBag={data.magicAwardInfo ? data.magicAwardInfo : null}
                  />
                </View>
              ) : (
                <View>
                  <NewPersonStepItem data={data} />
                </View>
              )}
            </View>

            <View
              className='main-box'
              style={{ background: `rgba(255, 255, 255, 1)` }}
            >
              {/* 弹窗尾部 */}
              <View className='modal-footer'>
                {data.buttonType === 1 ? (
                  <View
                    className='modal-btn'
                    onClick={this.onCloseClick.bind(this, 'know')}
                  >
                    {data.buttonText}
                  </View>
                ) : (
                  <View className='modal-btn' onClick={onGoMoreTask}>
                    {data.buttonText}
                  </View>
                )}

                {/* 底部灰色文案 */}
                <View className='time-less'>
                  {data.taskCount !== 3 ? (
                    <View>
                      活动倒计时
                      <View className='times'>{this.renderTime()}</View>
                    </View>
                  ) : (
                    ''
                  )}
                </View>
              </View>
            </View>
          </View>
          <View className='close-btn'>
            <Image
              className='lazyload closeImg'
              src={close}
              alt='关闭'
              onClick={onClose}
            />
          </View>
        </View>
      </View>
    ) : (
      ''
    );
  }
}

export default NewPersonResultModal;
