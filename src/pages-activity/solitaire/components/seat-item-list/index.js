import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View } from '@tarojs/components';
import FreshSeatAvatar from '../seat-avatar';
import FreshSeatItem from '../seat-item';
import { filterDescription } from '../../../../utils/common/utils';
import './index.scss';

export default class FreshSeatItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { list } = this.props;
    return (
      <View
        className='seat-item-list'
        style={{
          paddingBottom: `${Taro.pxTransform(20)}`,
        }}
      >
        {list &&
          list.map((info, index) => (
            <View
              style={{
                paddingTop: `${Taro.pxTransform(20)}`,
                marginBottom:
                  index === list.length - 1 ? `${Taro.pxTransform(20)}` : 0,
                display: 'flex',
                flexDirection: 'row',
              }}
              key={`item${index}`}
            >
              <View
                style={{
                  width: `${Taro.pxTransform(72)}`,
                  height: `${Taro.pxTransform(72)}`,
                  boxSizing: 'border-box',
                  marginRight: `${Taro.pxTransform(10)}`,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FreshSeatAvatar
                  text={info.title}
                  type={info.sort}
                  img={info.avatarUrl}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <FreshSeatItem
                  name={info.sort === 0 ? info.title : info.hidePin}
                  time={info.orderTime}
                  piece={info.orderNum}
                  info={filterDescription(info.recommendText, 35)}
                  type={info.type}
                  width={
                    info.width ? `${info.width}px` : `${Taro.pxTransform(538)}`
                  }
                />
              </View>
            </View>
          ))}
      </View>
    );
  }
}
