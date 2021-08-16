// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, ScrollView, Image } from '@tarojs/components';
import FloorHeader from '../../components/common-header/index';
import './index.scss';
import ProductMore from '../product-more';
import { px2vw, filterImg } from '../../../../utils/common/utils';

export default class FloorBrandSelected extends Component {
  static defaultProps = {
    data: {
      firstTitle: '品牌甄选',
      secondTitle: '招牌档口',
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
    const { data, onGoToUrl } = this.props;
    const { firstTitle, secondTitle, action, stallInfoList } = data;
    return (
      <View className='page-container'>
        <View onClick={this.goPage.bind(this, action)}>
          <FloorHeader
            firstTitle={firstTitle || '品牌甄选'}
            secondTitle={secondTitle || '招牌档口'}
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
            <View className='items-list'>
              {stallInfoList &&
                stallInfoList.map((val, i) => {
                  return (
                    <View
                      className='items-info'
                      key={i}
                      onClick={onGoToUrl.bind(this, val.action)}
                    >
                      <View className='brand-info'>
                        <View className='brand-logo lazy-load-img'>
                          <Image
                            className='brand-logo-img'
                            src={filterImg(val.stallAboutImgUrl)}
                            lazyLoad
                          />
                        </View>
                        <View className='brand-name'>{val.stallName}</View>
                      </View>
                      <View className='goods-list'>
                        {val.items &&
                          val.items.map((value, j) => {
                            return (
                              <View key={j}>
                                {j <= 1 && (
                                  <View className='goods-wrap'>
                                    <View className='goods-img lazy-load-img'>
                                      <Image
                                        className='goods-img-val'
                                        src={filterImg(value.imageUrl)}
                                        lazyLoad
                                      />
                                    </View>
                                    <View className='goods-price'>
                                      ¥{value.jdPrice}
                                    </View>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  );
                })}

              {action &&
                data.action.toUrl &&
                action.urlType &&
                stallInfoList &&
                stallInfoList.length > 1 && (
                  <View className='brand-items-wrap'>
                    <View
                      className='brand-items-more'
                      onClick={this.goPage.bind(this, action)}
                    >
                      <ProductMore
                        styleObj={{
                          height: px2vw(382),
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
    );
  }
}
