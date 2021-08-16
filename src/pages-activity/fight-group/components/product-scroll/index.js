import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Swiper, SwiperItem } from '@tarojs/components';
import GoTeamEasy from '../go-team-easy';
import GoTeam from '../go-team';
import { px2vw } from '../../../../utils/common/utils';
import './index.scss';

export default class ProductScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = info => {
    this.props.onClick(info);
  };

  static defaultProps = {
    list: [],
    result: [],
    type: '',
  };

  stopTouchMove = () => {
    return false;
  };

  render() {
    let { list, type, resource } = this.props;
    let result = [],
      scrollList = [];

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < list.length; j++) {
        result.push(list[j]);
      }
    }

    for (var a = 0; a < result.length; a += 4) {
      scrollList.push(result.slice(a, a + 4));
    }

    return (
      <View
        className='product-scroll-page'
        style={{ height: resource === 'detail' ? px2vw(640) : px2vw(776) }}
      >
        <View className='page-scroll-mask' />
        <Swiper
          className='swiper'
          interval={4000}
          duration={1000}
          autoplay
          circular
          vertical
        >
          {scrollList &&
            scrollList.map((info, index) => {
              return (
                <SwiperItem
                  className='bottom-tip-main'
                  taroKey={String(index)}
                  key={index}
                  catchtouchmove={this.stopTouchMove}
                >
                  {info &&
                    info.map((item, k) => {
                      return (
                        <View
                          className='go-team-modal'
                          key={k}
                          style={{
                            height:
                              type === 'team-detail'
                                ? `${(100 / 750) * 200}vw`
                                : `${(100 / 750) * 160}vw`,
                          }}
                        >
                          {type === 'team-detail' ? (
                            <GoTeam
                              info={item}
                              onClick={this.onClick.bind(this, item)}
                            />
                          ) : (
                            <GoTeamEasy
                              info={item}
                              onClick={this.onClick.bind(this, item)}
                            />
                          )}
                        </View>
                      );
                    })}
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    );
  }
}
