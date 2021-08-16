import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import './index.scss';
import FloorEntranceImg from '../components/floor-entrance-img';

export default class FloorEntrance extends Component {
  static defaultProps = {
    data: {
      //门店图片
      image: '',
      //门店名称及营业时间
      firstTitle: '',
      //门店地址
      secondTitle: '',
    },
  };

  getCircleLogo = tenantInfo => {
    let circleLogo = '';
    if (tenantInfo && tenantInfo.circleLogo) {
      circleLogo = tenantInfo.circleLogo;
      if (circleLogo.indexOf('http') === -1) {
        circleLogo = 'https://' + circleLogo;
      }
    }
    return circleLogo;
  };

  render() {
    let pageList = [];
    const { data, onGoToUrl } = this.props;
    const { shopInfoList } = data;
    if (
      shopInfoList &&
      shopInfoList.pageList &&
      shopInfoList.pageList.length > 0
    ) {
      pageList = shopInfoList.pageList;
    }
    // console.log("pageList=",pageList)
    return (
      <View>
        {pageList &&
          pageList.length > 0 &&
          pageList.map((val, i) => {
            return (
              <View
                key={i}
                className='floor-entrance'
                onClick={onGoToUrl.bind(this, val)}
              >
                <FloorEntranceImg
                  entranceImg={val.storeImage}
                  show={val.show}
                />
                <View className='floor-entrance-title'>
                  <View
                    className='floor-entrance-icon'
                    style={{
                      backgroundImage: `url(${this.getCircleLogo(
                        val.tenantInfo
                      )})`,
                    }}
                  ></View>
                  {val.storeName && (
                    <View className='floor-entrance-name'>{val.storeName}</View>
                  )}
                </View>
                {val.address && (
                  <View className='floor-entrance-sub'>{val.address}</View>
                )}
              </View>
            );
          })}
      </View>
    );
  }
}
