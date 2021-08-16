import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { filterImg, px2vw } from '../../utils/common/utils';
import NewPersonCoupon from '../new-person-coupon';
import NewPersonStepItem from '../new-person-step-item';
import './index.scss';

class FloorNewPersonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      renderType: null,
    };
  }

  componentDidMount() {
    let _props = this.props;
    this.showTime(_props.data.activityEndTime);
    this.setRenderType(
      _props.data.taskPointList.length,
      _props.data.residueTaskCount
    );
  }

  componentWillUnmount() {
    //清除倒计时组件
    clearInterval(this.timer);
  }

  setRenderType = (all, leftover) => {
    let val = parseInt(all) - parseInt(leftover);
    this.setState({
      renderType: val,
    });
  };

  renderTime() {
    const { day, hour, minute, second } = this.state;
    return `${day}天 ${hour} : ${minute} : ${second}`;
  }

  showTime = (endTime) => {
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

  render() {
    const { show, isHome, onClose, onGetTask, onGoMoreTask, data } = this.props;

    const { renderType } = this.state;
    console.log('renderType', renderType);
    const close =
      'https://m.360buyimg.com/img/jfs/t1/31101/30/2130/3801/5c669c1fE98231e9e/191a2768868a76b6.png';
    const headerImage =
      'm.360buyimg.com/img/jfs/t1/134183/1/14880/25536/5fa276d6E7320a3b9/4e99d19a397f6c36.png';

    console.log('data.taskAwardInfo', data.taskAwardInfo);
    return show ? (
      <View className='info-modal'>
        <View className='info-modal-mask' onClick={onClose}></View>
        <View className='info-modal-content'>
          <View className='info-modal-n'>
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
                  height: px2vw(128),
                  paddingTop: isHome
                    ? renderType >= 3
                      ? px2vw(10)
                      : px2vw(26)
                    : '',
                }}
              >
                <View className='h3s'>{data && data.title}</View>
                {renderType < 3 && isHome && (
                  <View className='subTitle'>{data && data.subTitle}</View>
                )}
                <View className='leftLogo'></View>
              </View>
              {renderType >= 3 && isHome ? (
                <View onClick={onGoMoreTask} className='modal-more'>
                  更多任务&gt;
                </View>
              ) : (
                ''
              )}
            </View>

            {/* 弹窗主体 */}
            <View className='modal-main'>
              {renderType >= 3 ? (
                <View className='coupon-box'>
                  <NewPersonCoupon
                    isModal
                    data={data.taskAwardInfo}
                    couponImg={
                      data.couponBag && data.couponBag.couponImg
                        ? data.couponBag.couponImg
                        : false
                    }
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
              style={{ background: `rgba(255, 248, 248, 1)` }}
            >
              {/* 弹窗尾部 */}
              <View className='modal-footer'>
                {renderType >= 3 ? (
                  <View className='modal-btn' onClick={onGetTask}>
                    领任务
                  </View>
                ) : (
                  <View className='modal-btn' onClick={onGoMoreTask}>
                    去领任务
                  </View>
                )}

                {/* 底部灰色文案 */}
                <View className='time-less'>
                  {renderType && renderType < 3 && isHome ? (
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

export default FloorNewPersonModal;
