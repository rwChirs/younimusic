// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView } from '@tarojs/components';
import ProductItem from '../../../../components/product-item';
import FloorHeader from '../../components/common-header/index';
import { px2vw, filterImg } from '../../../../utils/common/utils';
import './index.scss';
import ProductMore from '../product-more';

export default class FloorQualitySelected extends Component {
  static defaultProps = {
    data: {
      firstTitle: '品质精选',
      secondTitle: '每日更新',
    },
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  goPage(action, ev) {
    ev.stopPropagation();
    if (action.urlType) this.props.onGoToUrl(action);
  }

  render() {
    const { data, onGoDetail, onAddCart, windowWidth, onGoToUrl } = this.props;
    const { firstTitle, secondTitle, action } = data;
    return (
      <View
        className='page-container'
        style={{
          backgroundImage:
            data && data.image ? `url(${filterImg(data.image)})` : 'unset',
        }}
      >
        <View onClick={this.goPage.bind(this, action)}>
          <FloorHeader
            firstTitle={firstTitle || '品质精选'}
            secondTitle={secondTitle || '每日更新'}
            data={action}
          />
        </View>
        <View className='page-main no-scroll-bar'>
          <ScrollView
            className='scroll-wrap'
            scrollX
            scrollWithAnimation
            onScrollToLower={onGoToUrl.bind(this, action)}
          >
            <View className='page-items'>
              {data &&
                data.items &&
                data.items.map((val, i) => {
                  return (
                    <ProductItem
                      key={i}
                      type={3}
                      windowWidth={windowWidth}
                      data={val}
                      onGoDetail={onGoDetail}
                      onAddCart={onAddCart}
                      itemStyle={{
                        width: px2vw(266),
                        height: px2vw(352),
                        marginRight: px2vw(10),
                        marginLeft: i === 0 ? 0 : px2vw(10),
                        borderRadius: px2vw(16),
                      }}
                      imgStyle={{
                        width: px2vw(266),
                        height: px2vw(266),
                      }}
                      isShowTagNotAtImg
                      tagListStyle={{
                        display: 'none',
                      }}
                      isShowItemAd
                      isShowUnit={false}
                      isShowMarketPrice
                      adStyle={{
                        width: px2vw(232),
                        height: px2vw(42),
                        textAlign: 'left',
                      }}
                    />
                  );
                })}
              {action &&
                data.action.toUrl &&
                action.urlType &&
                data &&
                data.items &&
                data.items.length > 2 && (
                  <View className='quality-items-wrap'>
                    <View
                      className='quality-items-more'
                      onClick={this.goPage.bind(this, action)}
                    >
                      <ProductMore
                        styleObj={{
                          width: '100%',
                          height: px2vw(350),
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
    );
  }
}
