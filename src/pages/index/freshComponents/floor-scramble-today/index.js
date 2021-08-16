import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, ScrollView, Text } from '@tarojs/components';
import { getSeckillInfo } from '@7fresh/api';
import ProductMore from '../product-more';
import CountDown from '../../components/count-down';
import { filterImg, px2vw } from '../../../../utils/common/utils';
import { commonLogExposure } from '../../../../utils/common/logReport';
import './index.scss';

export default class FloorScrambleToday extends Component {
  static defaultProps = {
    data: {
      image: '',
      items: [],
      action: {},
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      countTime: 0,
    };
  }

  componentWillMount() {
    const { data } = this.props;
    const items = (data && data.items) || [];
    this.setState({
      countTime: Math.ceil(data.remainingTime / 1000),
      items,
    });
    this.floorExposure();
  }

  componentWillUnmount() {
    this._floorIntersectionObserver &&
      this._floorIntersectionObserver.disconnect();
    this._intersectionObserver && this._intersectionObserver.disconnect();
  }

  // 楼层曝光
  floorExposure = () => {
    const {
      data: { floorIndex },
    } = this.props;
    const targetDom = `#floor-scramble-today-${floorIndex}`;
    this._floorIntersectionObserver = Taro.createIntersectionObserver(
      this.$scope
    );
    this._floorIntersectionObserver
      .relativeToViewport({ bottom: 50 })
      .observe(targetDom, () => {
        // 触发监听sku曝光
        this.skuExposure();
        // 移除监听
        this._floorIntersectionObserver.disconnect();
      });
  };

  // 商品曝光
  skuExposure = () => {
    const {
      data: { floorIndex, items, buriedPointVo },
    } = this.props;
    items &&
      items.length > 0 &&
      items.map((item, i) => {
        const targetDom = `#floor-scramble-today-${floorIndex}-${item.skuId}`;
        this._intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        this._intersectionObserver
          .relativeTo(`#floor-scramble-today-${floorIndex}`, { right: 0 })
          .observe(targetDom, () => {
            if (!this[targetDom]) {
              //曝光埋点
              if (buriedPointVo) {
                const expAction = {
                  target: 2,
                  index: i + 1,
                  skuId: item.skuId,
                  floorIndex,
                };
                commonLogExposure({
                  action: expAction, // 曝光动作参数
                  buriedPointVo: buriedPointVo,
                });
                this[targetDom] = true;
              }
            }
          });
      });
  };

  onFinishedCount = () => {
    let params = {
      floorNum: this.props.floorNum,
      floorType: this.props.floorType,
    };
    getSeckillInfo(params).then((res) => {
      this.setState({
        items: res.items,
        countTime: res ? Math.ceil(res.restseckillTime / 1000) : 0,
      });
    });
  };

  onCountDownChange = (time) => {
    this.setState({
      countTime: time,
    });
  };

  onClickProduct = (action, skuId, e) => {
    e.stopPropagation();
    this.props.onGoToUrl({
      ...action,
      target: 2,
      skuId,
      toUrl: action.toUrl ? `${action.toUrl}&clickSkuId=${skuId}` : null,
    });
  };

  onGoToUrl = () => {
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({ ...action, target: 1 });
  };

  onMoreAction = (ev) => {
    ev.stopPropagation();
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({ ...action, target: 5 });
  };

  render() {
    const { data } = this.props;
    const { action, floorIndex } = data;
    const { items } = this.state;
    const clockLogo =
      'm.360buyimg.com/img/jfs/t1/161458/39/5376/1446/601910fcE38426692/84f82370af8d7ea8.png';
    const priceLogo =
      'm.360buyimg.com/img/jfs/t1/154618/30/15476/7105/6007fb65E1e6637df/3959ddffa90dd8da.png';
    const arrow =
      'm.360buyimg.com/img/jfs/t1/161226/23/3606/305/6007fb3cEa7355445/6770803e5c66e042.png';

    return (
      <View className='floor-scramble-today-wrap'>
        <View
          className='floor-scramble-today'
          id={`floor-scramble-today-${floorIndex}`}
          onClick={this.onGoToUrl}
        >
          <View className='outer'>
            <View className='title'>
              <View className='title-left'>
                <Image
                  className='clock-logo'
                  src={filterImg(clockLogo)}
                  alt='七鲜'
                />
                <Text className='name'>{data.firstTitle || '今日值得抢'}</Text>
                <View className='count-down'>
                  {this.state.countTime && (
                    <CountDown
                      width={36}
                      height={32}
                      fontSize={22}
                      background='linear-gradient(180deg,#ffffff 0%,#fcd4a5 100%)'
                      radius={8}
                      color='#ff2600'
                      fontWeight='bold'
                      boxShadow='0px 6px 8px 0px rgba(255,38,0,1)'
                      splitColor='#fff'
                      splitSpace={6}
                      splitFontSize={24}
                      seconds={this.state.countTime}
                      onChange={this.onCountDownChange}
                      onFinishedCount={this.onFinishedCount}
                    />
                  )}
                </View>
              </View>
              <View className='right-text-group'>
                <Text className='desc'>
                  {data.secondTitle || '限量供应，抢完为止'}
                </Text>
                <Image
                  className='icon-logo'
                  src={filterImg(arrow)}
                  alt='七鲜'
                />
              </View>
            </View>
            <View className='floor-scramble-today-goods'>
              <ScrollView
                scrollX
                scrollWithAnimation
                onScrollToLower={this.onMoreAction}
                lowerThreshold={0}
                className='scroll-wrap'
              >
                <View className='floor-scramble-today-list'>
                  {items &&
                    items.length > 0 &&
                    items.map((val, i) => {
                      return (
                        <View
                          className='goods-item-wrap'
                          id={`floor-scramble-today-${floorIndex}-${val.skuId}`}
                          key={i}
                          onClick={this.onClickProduct.bind(
                            this,
                            action,
                            val.skuId
                          )}
                        >
                          <View className='goods-item lazy-load-img'>
                            <Image
                              className='image'
                              src={filterImg(val.imageUrl)}
                              lazyLoad
                            />
                            {/* {val.discountInfo && (
                              <View className='goods-tag'>
                                {val.discountInfo}
                              </View>
                            )} */}
                            <View
                              className='jd-price'
                              style={{
                                backgroundImage: `url(${filterImg(priceLogo)})`,
                              }}
                            >
                              <Text className='jd-price-value'>
                                <Text className='small-text'>¥</Text>
                                {val.jdPrice}
                              </Text>
                              <Text className='old-price'>
                                ￥{val.marketPrice}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  {action &&
                    !!Number(action.urlType) &&
                    items &&
                    items.length >= 5 && (
                      <View onClick={this.onMoreAction}>
                        <ProductMore
                          styleObj={{
                            height: '100%',
                            width: px2vw(92),
                            fontSize: px2vw(22),
                            borderRadius: px2vw(16),
                            overflow: 'hidden',
                          }}
                        />
                      </View>
                    )}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
