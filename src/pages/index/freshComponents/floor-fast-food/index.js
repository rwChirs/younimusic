import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import ProductMore from '../product-more/index';
import FloorHeader from '../../components/common-header/index';

import './index.scss';
import { px2vw } from '../../../../utils/common/utils';
import {
  logClick,
  commonLogExposure,
} from '../../../../utils/common/logReport';
import ProductItem from '../../../../components/product-item';

export default class FloorFastFood extends Component {
  static defaultProps = {
    data: {
      group: [{ image: '', items: [] }],
      firstTitle: '',
      secondTitle: '',
      action: {},
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      index:
        props.data && props.data.selectedIndex
          ? parseFloat(props.data.selectedIndex)
          : 0,
      scrollLeft: '',
    };
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
    const targetDom = `#floor-fast-food-${floorIndex}`;
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
      data: { floorIndex, buriedPointVo, group },
    } = this.props;
    const { index } = this.state;
    const tabName = group && group[index] && group[index].title;
    group &&
      group[index] &&
      group[index].items.length > 0 &&
      group[index].items.map((item, i) => {
        const targetDom = `#floor-fast-food-${floorIndex}-${item.skuId}`;
        this._intersectionObserver = Taro.createIntersectionObserver(
          this.$scope
        );
        this._intersectionObserver
          .relativeTo(`#floor-fast-food-${floorIndex}`, { right: 0 })
          .observe(targetDom, () => {
            if (!this[targetDom]) {
              //曝光埋点
              if (buriedPointVo) {
                const expAction = {
                  target: 2,
                  index: i + 1,
                  skuId: item.skuId,
                  tabName: tabName,
                  tabIndex: index + 1,
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

  changeIndex = (i, val, ev) => {
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    }
    if (i === this.state.index) {
      return;
    }
    console.log('changeIndex', i);
    this.setState(
      {
        index: i,
      },
      () => {
        // 重点：点击后向左滑动
        this.setState(
          {
            scrollLeft: 0,
          },
          () => {
            this.setState({
              scrollLeft: '',
            });
            this.skuExposure();
          }
        );
      }
    );
    this.props.onGoToUrl({
      urlType: '0',
      target: 7,
      tabName: val.title,
      tabIndex: i + 1,
    });
    if (val && val.clsTag) {
      logClick({ eid: val.clsTag });
    }
  };

  getStyle = (i, index, dataArr) => {
    if (
      i.toString() === (dataArr.length - 1).toString() &&
      i.toString() === index.toString()
    ) {
      return { paddingRight: px2vw(17), paddingLeft: 0 };
    }
    if (
      i.toString() !== (dataArr.length - 1).toString() &&
      i.toString() === index.toString()
    ) {
      return { padding: 0 };
    }
    if (i.toString() === (dataArr.length - 1).toString()) {
      return { paddingRight: px2vw(50) };
    }
    return {};
  };

  onGoToUrl = () => {
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({ ...action, target: 1 });
  };

  handleProClick = (val, j, ev) => {
    console.log('餐桌点击', val, j);
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    }
    const {
      data: { action, group },
    } = this.props;
    const { index } = this.state;
    this.props.onGoToUrl({
      ...action,
      skuId: val.skuId,
      index: j + 1,
      target: 2,
      tabName: group && group[index] && group[index].title,
      tabIndex: index + 1,
    });
  };

  onMoreAction = (ev) => {
    ev.stopPropagation();
    const {
      data: { action },
    } = this.props;
    this.props.onGoToUrl({ ...action, target: 5 });
  };

  render() {
    const { data, windowWidth } = this.props;
    const { index, scrollLeft } = this.state;
    const {
      group,
      firstTitle,
      secondTitle,
      action,
      floorIndex,
      // contentbackGroudColor,
    } = data;
    this.max = group ? (group.length > 4 ? 4 : group.length) : 0;
    const renderCon =
      group &&
      group.length > 0 &&
      group.map((val, i) => {
        return (
          <View
            key={i}
            id={`item${i}`}
            className='fastfood-main-title-val'
            taroKey={String(i)}
            style={this.getStyle(i, index, group)}
            onClick={this.changeIndex.bind(this, i, val)}
          >
            <View
              className={`title-txt ${
                i == index ? 'fastfood-main-title-val-txt' : ''
              }`}
            >
              <Text>{val.title}</Text>
            </View>
          </View>
        );
      });
    return (
      <View
        className='fastfood'
        id={`floor-fast-food-${floorIndex}`}
        onClick={this.onGoToUrl}
      >
        <View className='fastfood-container'>
          <View className='fastfood-title-container'>
            <FloorHeader
              firstTitle={firstTitle || '精致三餐'}
              secondTitle={secondTitle || '总有一款是你的菜'}
              data={action}
              onGoToUrl={this.onGoToUrl}
            />
          </View>
          <View
            className='fastfood-content'
            style={{
              backgroundImage: `url(${
                group && group[index] ? group[index].image : ''
              })`,
            }}
          >
            <ScrollView
              scrollX
              scrollIntoView={`item${parseInt(index / 4) * 4}`}
            >
              <View className='fastfood-main-title'>{renderCon}</View>
            </ScrollView>
            <ScrollView
              scrollX
              className='scroll-wrap'
              scrollWithAnimation
              onScrollToLower={this.onMoreAction}
              lowerThreshold={0}
              scrollLeft={scrollLeft}
            >
              <View className='list-box'>
                {group &&
                group[index] &&
                group[index].items &&
                group[index].items.length > 0
                  ? group[index].items.map((val, j) => {
                      return (
                        <View
                          className='product-item-wrap'
                          id={`floor-fast-food-${floorIndex}-${val.skuId}`}
                          key={j}
                          style={{
                            marginRight:
                              j === group[index].items.length - 1
                                ? px2vw(14)
                                : px2vw(7),
                          }}
                          onClick={this.handleProClick.bind(this, val, j)}
                        >
                          <ProductItem
                            windowWidth={windowWidth}
                            type={3}
                            data={val}
                            isCart
                            onGoDetail={this.handleProClick.bind(this, val, j)}
                            itemStyle={{
                              height: px2vw(298),
                              borderRadius: px2vw(16),
                            }}
                            priceUnitStyle={{
                              marginTop: 2 + 'px',
                            }}
                            isShowUnit
                            tagListStyle={{
                              display: 'none',
                            }}
                          />
                        </View>
                      );
                    })
                  : null}
                {action &&
                  !!Number(action.urlType) &&
                  group &&
                  group[index] &&
                  group[index].items &&
                  group[index].items.length >= 4 && (
                    <View
                      className='fastfood-main-items-wrap'
                      onClick={this.onMoreAction}
                    >
                      <View className='fastfood-main-items-more'>
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
