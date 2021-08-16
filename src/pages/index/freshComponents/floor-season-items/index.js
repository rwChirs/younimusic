import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import ProductMore from '../product-more';
import FloorHeader from '../../components/common-header';
import { commonLogExposure } from '../../../../utils/common/logReport';
import { filterImg, px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class FloorSeasonItems extends Component {
  static defaultProps = {
    data: {
      tab: [],
      action: {},
      items: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
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
    const targetDom = `#floor-season-${floorIndex}`;
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
        const targetDom = `#floor-season-${floorIndex}-${item.skuId || i}`;
        this._intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        this._intersectionObserver
          .relativeTo(`#floor-season-${floorIndex}`, { right: 0 })
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
                if (i === 0) {
                  expAction.target = 3;
                  expAction.imageUrl = item.imageUrl;
                }
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

  onSeasonUrl(val, i, ev) {
    ev.stopPropagation();
    const { data } = this.props;
    let { action } = data;
    const ac = val.action;
    action = {
      ...action,
      ...ac,
    };
    if (i === 0) {
      this.props.onGoToUrl({
        ...action,
        target: 3,
        imageUrl: val.imageUrl,
        index: i + 1,
      });
    } else {
      this.onGoToUrl();
    }
  }

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
    const { tab, action, image, floorIndex, items } = data;
    return (
      <View className='Season' id={`floor-season-${floorIndex}`}>
        <View className='Season-container' onClick={this.onGoToUrl}>
          <View className='fastfood-title-container'>
            <FloorHeader
              firstTitle={data.firstTitle || '新品时令'}
              secondTitle={data.secondTitle || '品尝美食正当时'}
              data={action}
            />
          </View>
          <View
            className='Season-main-items-container'
            style={{
              backgroundImage: `url(${image ? filterImg(image) : ''})`,
              backgroundColor: data.backGroudColor || '',
            }}
          >
            <View
              className='Season-main-items-container-title'
              style={{ color: data.titleColor || '#fff' }}
            >
              {tab &&
                tab.length > 0 &&
                tab.map((item, i) => {
                  const title = item.title || '';
                  return (
                    <View
                      key={i}
                      className={`Season-main-items-container-title-item ${
                        i === 0 ? 'today' : ''
                      }`}
                    >
                      <View className='Season-main-items-container-title-item-name'>
                        <Text>{title}</Text>
                      </View>
                      <View className='Season-main-items-container-title-item-date'>
                        {item.subTitle}
                      </View>
                      {i === 0 && tab.length > 1 && (
                        <View
                          className='Season-main-items-container-title-line'
                          style={{ backgroundColor: data.titleColor || '#fff' }}
                        ></View>
                      )}
                    </View>
                  );
                })}
            </View>
            <ScrollView
              scrollX
              scrollWithAnimation
              onScrollToLower={this.onMoreAction}
              lowerThreshold={0}
              className='scroll-wrap'
            >
              <View className='Season-main-items'>
                {items &&
                  items.length > 0 &&
                  items.map((val, i) => {
                    return (
                      <View
                        className='Season-main-items-imgs'
                        id={`floor-season-${floorIndex}-${val.skuId || i}`}
                        key={i}
                        onClick={this.onSeasonUrl.bind(this, val, i)}
                      >
                        <View
                          className={`Season-main-items-img lazy-load-img ${
                            i === 0 ? 'first-img' : ''
                          }`}
                        >
                          <Image
                            className={`${
                              i === 0
                                ? 'first-Image'
                                : 'Season-main-items-Image'
                            }`}
                            src={filterImg(val.imageUrl)}
                            lazyLoad
                          />
                          {i > 0 && (
                            <View className='Season-main-items-name'>
                              {val.skuName}
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                {action &&
                  !!Number(action.urlType) &&
                  data &&
                  data.items &&
                  data.items.length >= 4 && (
                    <View
                      className='Season-main-items-imgs'
                      onClick={this.onMoreAction}
                    >
                      <View className='more-box'>
                        <ProductMore
                          styleObj={{
                            height: '100%',
                            width: '100%',
                            fontSize: px2vw(22),
                            borderRadius: px2vw(16),
                            overflow: 'hidden',
                          }}
                        />
                      </View>
                    </View>
                  )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
