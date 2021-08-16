import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import FormalItemCard from '../formal-item-card/index';
import './index.scss';

export default class ContentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      listData,
      onGoToProDetail,
      onGoDetail,
      onDetail,
      onGoToMine,
      onGoToPosition,
      onAddCart,
      onChangeCollect,
      onGoToTopicDetail,
      index,
      onSearchDetail,
      onFindSimiler,
      hasSimiler,
    } = this.props;
    return (
      <View className='content-list'>
        {listData &&
          listData['list' + index] &&
          listData['list' + index].length > 0 &&
          listData['list' + index].map((item, i) => {
            return (
              <View key={i.toString()}>
                {item && item.extData && item.extData.position > -1 ? (
                  <View
                    className='image-box'
                    onClick={onGoToPosition.bind(
                      this,
                      item && item.extData && item.extData.action
                    )}
                  >
                    <Image
                      className='image'
                      alt=''
                      src={item && item.extData && item.extData.image}
                      style={{
                        width: px2vw(690),
                        height: px2vw(
                          690 /
                            ((item &&
                              item.extData &&
                              item.extData.pictureAspect) ||
                              4.31)
                        ),
                      }}
                    />
                  </View>
                ) : (
                  <FormalItemCard
                    item={item}
                    uniqueId={i}
                    key={i.toString()}
                    // id={`formalCard${index}`}
                    onGoToProDetail={onGoToProDetail}
                    onGoToTopicDetail={onGoToTopicDetail}
                    onGoDetail={onGoDetail}
                    onDetail={onDetail}
                    onGoToMine={onGoToMine}
                    onAddCart={onAddCart}
                    onChangeCollect={onChangeCollect}
                    onSearchDetail={onSearchDetail}
                    onFindSimiler={onFindSimiler}
                    hasSimiler={hasSimiler}
                  />
                )}
              </View>
            );
          })}
      </View>
    );
  }
}
