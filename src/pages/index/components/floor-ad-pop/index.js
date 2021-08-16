// import Taro, { Component } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';
import { filterImg, formatDate } from '../../../../utils/common/utils';

export default class FloorAdPop extends Component {
  static defaultProps = {
    isShowFloorAdPop: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      redRunSeconds: 3,
      isShowCountTimeImg: false,
      notCouponImage: true,
    };
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  componentWillReceiveProps(props) {
    if (
      (props.data && props.data.uuid) !==
      (this.props.data && this.props.data.uuid)
    ) {
      this.setState({
        isShow: true,
        redRunSeconds: 3,
        isShowCountTimeImg: false,
        notCouponImage: true,
      });
    }
  }

  //首页是否显示弹屏广告
  isShowFloorAdPopFunc() {
    let isShowAdPopIndex = false;
    const { source, storeId, data } = this.props;
    if (source === 'index') {
      let floorAdPopInfo = Taro.getStorageSync('FloorAdPopInfo');
      if (
        floorAdPopInfo &&
        floorAdPopInfo[storeId] &&
        floorAdPopInfo[storeId].last &&
        floorAdPopInfo[storeId].last === formatDate(new Date()) &&
        floorAdPopInfo[storeId].url === data.image
      ) {
        isShowAdPopIndex = false;
      } else {
        isShowAdPopIndex = true;
      }
      return isShowAdPopIndex;
    }
    return false;
  }

  closeAdPop(ev) {
    ev.stopPropagation();
    const { data, storeId } = this.props;
    if (data && data.popCondition === 2) {
      this.props.onCloseCouponPop();
    } else {
      this.setState({
        isShow: false,
      });
      this.props.onCloseCouponPop();
      const floorAdPopInfo = Taro.getStorageSync('FloorAdPopInfo') || {};
      Taro.setStorageSync('FloorAdPopInfo', {
        ...floorAdPopInfo,
        [storeId]: {
          last: formatDate(new Date()),
          url: data.image,
        },
      });
    }
  }

  goToUrl(data) {
    this.setState(
      {
        notCouponImage: false,
      },
      () => {
        if (data && data.popCondition === 2 && !data.isClickCoupon) {
          this.props.onClick();
        } else {
          if (
            this.props.source === 'index' &&
            data &&
            data.action &&
            data.action.urlType
          ) {
            this.props.onGoToUrl({
              ...data.action,
              target: 3,
              imageUrl: data.image,
            });
          }
        }
      }
    );
  }

  //根据urlType进行页面跳转
  gotoRedRun() {
    if (this.state.redRunSeconds <= 0) {
      this.props.onGotoRedRun(this.state.redRunSeconds);
    }
  }

  startredRunCountDown() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(() => {
      const seconds = this.state.redRunSeconds;
      if (seconds === 0) {
        clearInterval(this.timerId);
        this.setState({
          isShowCountTimeImg: false,
        });
      } else {
        this.setState({
          redRunSeconds: seconds - 1,
        });
      }
    }, 1000);
  }

  imageUpload() {
    this.setState(
      {
        notCouponImage: false,
      },
      () => {
        const { source } = this.props;
        if (source === 'index') return;
        this.setState(
          {
            isShowCountTimeImg: true,
          },
          () => {
            this.startredRunCountDown();
          }
        );
      }
    );
  }

  imageUploadCoupon() {
    this.setState({
      notCouponImage: false,
    });
  }

  btnImg =
    'https://m.360buyimg.com/img/jfs/t1/37419/32/1028/6818/5cb3f13cE5ccd1515/e4333737f5223eb6.png';
  countTimeImgs = [
    'https://m.360buyimg.com/img/jfs/t1/12249/16/9418/2280/5c7f6c9dEfa3fa9fc/e88c546cd9deacda.png',
    'https://m.360buyimg.com/img/jfs/t1/27187/3/9487/4822/5c7f6cf2E8db26ce9/aef00273544d5149.png',
    'https://m.360buyimg.com/img/jfs/t1/32976/31/4306/5334/5c7f6d38Ee01756c0/5d692791c9e03cfe.png',
  ];

  render() {
    const { data, isShowFloorAdPop, successImage, source } = this.props;
    const { redRunSeconds, isShowCountTimeImg, notCouponImage, isShow } =
      this.state;
    let imageUrl = (data && data.image) || successImage;
    return (
      <View
        className='AdPop popup-mask'
        onClick={this.closeAdPop.bind(this)}
        style={{
          display: `${
            source === 'index'
              ? isShow && this.isShowFloorAdPopFunc()
                ? 'block'
                : 'none'
              : isShow && isShowFloorAdPop
              ? 'block'
              : 'none'
          }`,
          visibility: !notCouponImage ? 'visible' : 'hidden',
        }}
      >
        <View className='popup-wrapper'>
          <View className='close' onClick={this.closeAdPop.bind(this)} />
          {data && !data.isFuDaiCoupon && (
            <View
              className='popup-link lazy-load-img'
              onClick={this.goToUrl.bind(this, data)}
            >
              <Image
                className='Image'
                src={filterImg(
                  imageUrl
                    ? imageUrl
                    : data.Looting
                    ? 'https://m.360buyimg.com/img/jfs/t1/105544/15/10677/170458/5e1c8707E56b43d6b/8f9d9642eb8da23a.png'
                    : ''
                )}
                onLoad={this.imageUpload.bind(this)}
                lazyLoad
              />
            </View>
          )}
          {data &&
          data.couponInfoList &&
          data.couponInfoList.length !== 0 &&
          data.popCondition === 2 ? (
            <View
              className='coupon-suc-container lazy-load-img'
              onClick={this.goToUrl.bind(this, data)}
            >
              <Image
                className='Image'
                src={
                  data.image
                    ? filterImg(data.image)
                    : filterImg(
                        'https://m.360buyimg.com/img/jfs/t1/92973/4/8870/100915/5e095976E79ccc532/504760749b28fe50.png'
                      )
                }
                onLoad={this.imageUploadCoupon.bind(this)}
                lazyLoad
              />
              <View className='coupon-list'>
                {data.couponInfoList.map((res, key) => {
                  return (
                    <View className='coupon' key={key.toString()}>
                      <View className='coupon-left'>
                        <Text className='coupon-unit'>￥</Text>
                        <Text className='coupon-money'>{res.amountDesc}</Text>
                      </View>
                      <View className='coupon-right'>
                        <View className='coupon-name'>
                          {res.ruleDescDetail}
                        </View>
                        <View className='coupon-rule'>
                          {res.ruleDescSimple}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View />
          )}
          {source !== 'index' && (
            <View
              className={`${
                redRunSeconds > 0 ? 'count-time-img' : 'count-btn-img'
              }  lazy-load-img`}
              onClick={this.gotoRedRun.bind(this)}
            >
              {redRunSeconds > 0 && isShowCountTimeImg && (
                <View className='count-down-txt'>倒计时</View>
              )}
              {(isShowCountTimeImg || redRunSeconds <= 0) && (
                <Image
                  className='Image'
                  src={`${
                    redRunSeconds > 0
                      ? this.countTimeImgs[redRunSeconds - 1]
                      : this.btnImg
                  }`}
                  onLoad={this.imageUpload.bind(this)}
                  lazyLoad
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
