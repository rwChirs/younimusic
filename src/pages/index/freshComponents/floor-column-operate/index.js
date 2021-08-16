import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { getPageExposure } from '../../../../utils/common/exportPoint';
import { commonLogExposure } from '../../../../utils/common/logReport';
import './index.scss';
import { filterImg } from '../../../../utils/common/utils';

export default class FloorColumnOperate extends Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    // this.state = {
    //   columnList: [],
    // };
  }

  componentWillMount() {}

  componentDidMount() {
    setTimeout(() => {
      this.floorExposure();
    }, 1000);
  }

  componentWillUnmount() {
    this._floorIntersectionObserver &&
      this._floorIntersectionObserver.disconnect();
    this._intersectionObserver && this._intersectionObserver.disconnect();
  }

  // 楼层曝光
  floorExposure = () => {
    const { data } = this.props;
    data &&
      data.forEach((item) => {
        item &&
          item.forEach((val) => {
            const buriedPointVo = {
              ...val.buriedPointVo,
              columnIndex: val.columnIndex,
            };
            val.buriedPointVo = buriedPointVo;
            getPageExposure({
              obj: this,
              id: `floor-column-operate-${val.columnIndex}-`,
              num: 0,
              eid: val.clsTag,
              data: {
                ...val,
                expAction: {
                  columnIndex: val.columnIndex,
                  target: 1,
                },
              },
              needOldPoints: false,
            });
          });
      });
    this.skuExposure();
  };

  // 商品曝光
  skuExposure = () => {
    const { data } = this.props;
    data &&
      data.map((item) => {
        item &&
          item.length > 0 &&
          item.map((val) => {
            if (item.length === 4) {
              if (val && val.items && val.items.length > 0) {
                const targetDom = `#floor-column-operate-${val.columnIndex}-0`;
                const intersectionObserver = Taro.createIntersectionObserver(
                  this.$scope
                );
                intersectionObserver
                  .relativeToViewport({ bottom: -50 })
                  .observe(targetDom, () => {
                    if (val.buriedPointVo) {
                      const expAction = {
                        target: 2,
                        index: 1,
                        skuId: val.items[0].skuId,
                        columnIndex: val.columnIndex,
                      };
                      commonLogExposure({
                        action: expAction, // 曝光动作参数
                        buriedPointVo: val.buriedPointVo,
                      });
                    }
                  });
              }
            } else {
              val &&
                val.items &&
                val.items.length > 0 &&
                val.items.map((sigal, i) => {
                  const targetDom = `#floor-column-operate-${val.columnIndex}-0`;
                  const intersectionObserver = Taro.createIntersectionObserver(
                    this.$scope
                  );
                  intersectionObserver
                    .relativeToViewport({ bottom: -50 })
                    .observe(targetDom, () => {
                      if (val.buriedPointVo) {
                        const expAction = {
                          target: 2,
                          index: i + 1,
                          skuId: sigal.skuId,
                          columnIndex: val.columnIndex,
                        };
                        commonLogExposure({
                          action: expAction, // 曝光动作参数
                          buriedPointVo: val.buriedPointVo,
                        });
                      }
                    });
                });
            }
          });
      });
  };

  onGoToUrl = (sigal) => {
    const { onGoToUrl } = this.props;
    const { action } = sigal;
    onGoToUrl({ ...action, target: 1, columnIndex: sigal.columnIndex });
  };

  onClickProduct = (sigal, skuId, e) => {
    const { action } = sigal;
    console.log('onGoToUrl', sigal);
    e.stopPropagation();
    this.props.onGoToUrl({
      ...action,
      target: 2,
      skuId,
      columnIndex: sigal.columnIndex,
      toUrl: action.toUrl ? `${action.toUrl}&clickSkuId=${skuId}` : null,
    });
  };

  render() {
    const { data } = this.props;
    const productImg =
      'https://m.360buyimg.com/xstore/s558x558_jfs/t1/61020/6/9171/261979/5d6f18c7E411c3c0d/e2d07bf74504dba2.jpg!wb_100_100_100_100!q70.dpg';
    return (
      <View className='floor-column-operate'>
        {/* 一行2个 */}
        {data &&
          data.length > 0 &&
          data.map((val, i) => {
            return (
              <View
                key={i}
                className={`${val.length === 2 ? 'column-two' : 'column-four'}`}
              >
                {val &&
                  val.length > 0 &&
                  val.map((sigle, j) => {
                    // const buriedPointVo = {
                    //   ...sigle.buriedPointVo,
                    //   floorIndex: j + 1,
                    // };
                    // sigle.buriedPointVo = buriedPointVo;
                    // sigle.floorIndex = j + 1;
                    return (
                      <View
                        key={j.toString()}
                        className='column-sigle-box'
                        id={`floor-column-operate-${sigle.columnIndex}-0`}
                      >
                        {sigle && val.length === 2 && (
                          <View className='column-sigle'>
                            <View onClick={this.onGoToUrl.bind(this, sigle)}>
                              <View className='column-title'>
                                <Text>{sigle.title}</Text>
                                {sigle.imgUrl && (
                                  <Image
                                    className='title-icon'
                                    src={filterImg(sigle && sigle.imgUrl)}
                                    lazyLoad
                                  />
                                )}
                              </View>
                              <View className='second-desc'>
                                {sigle.subTitle ? sigle.subTitle : ''}
                              </View>
                            </View>
                            <View className='column-product'>
                              {sigle &&
                                sigle.hasOwnProperty('items') &&
                                JSON.stringify(sigle.items) !== undefined &&
                                sigle.items.length > 0 && (
                                  <View>
                                    {sigle.items.map((one, m) => {
                                      return (
                                        <Image
                                          key={m.toString()}
                                          className='product-img'
                                          src={
                                            one && one.imageUrl
                                              ? filterImg(one && one.imageUrl)
                                              : filterImg(productImg)
                                          }
                                          // id={`floor-column-operate-${
                                          //   sigle.columnIndex
                                          // }-${one.skuId || i}`}
                                          onClick={this.onClickProduct.bind(
                                            this,
                                            sigle,
                                            one.skuId
                                          )}
                                          lazyLoad
                                        />
                                      );
                                    })}
                                  </View>
                                )}
                            </View>
                          </View>
                        )}
                        {sigle && val.length === 4 && (
                          <View className='column-four-sigle'>
                            <View
                              className='column-title'
                              onClick={this.onGoToUrl.bind(this, sigle)}
                            >
                              {sigle.title}
                            </View>
                            <View className='column-product'>
                              {sigle &&
                                sigle.hasOwnProperty('items') &&
                                JSON.stringify(sigle.items) !== undefined &&
                                sigle.items.length > 0 && (
                                  <View>
                                    <Image
                                      className='product-img'
                                      id={`floor-column-operate-${
                                        sigle.columnIndex
                                      }-${sigle.items[0].skuId || i}`}
                                      src={filterImg(sigle.items[0].imageUrl)}
                                      onClick={this.onClickProduct.bind(
                                        this,
                                        sigle,
                                        sigle.items[0].skuId
                                      )}
                                      lazyLoad
                                    />
                                  </View>
                                )}
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
              </View>
            );
          })}
      </View>
    );
  }
}
