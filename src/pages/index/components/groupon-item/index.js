// import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text, Button } from '@tarojs/components';
import LazyLoadImage from '../../../../components/render-html/lazy-load-image';
import './index.scss';

export default class GrouponItem extends Component {
  static defaultProps = {
    info: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = (e) => {
    e.stopPropagation();
    if (this.props.info.buttonOption !== 3) {
      this.props.onGoDetail(this.props.info.action);
    }
  };

  onGoDetail(action) {
    this.props.onGoDetail(action);
  }

  render() {
    const { info = {} } = this.props;
    let {
      groupImage,
      grouponTitle,
      skuIntroduce = '',
      memberCount,
      groupSaleNum,
      grouponPrice,
      basePrice,
      buttonOption,
      buttonText,
      grouponSign,
      grouponSignDesc,
    } = info;
    let title = '';
    if (grouponTitle && grouponTitle.indexOf('】') > -1) {
      title = grouponTitle.split('】')[1];
    } else {
      title = grouponTitle;
    }

    return (
      <View
        className='fight-list-product'
        style={{
          marginBottom: '20rpx',
        }}
        onClick={this.onGoDetail.bind(this, info.action)}
      >
        <View className='img'>
          <LazyLoadImage width={140} height={140} src={groupImage} />
        </View>
        <View className='right'>
          <View>
            <View className='title'>
              {grouponSignDesc && (
                <Text
                  className='new'
                  style={{
                    background:
                      grouponSign === 1 || grouponSign === 4
                        ? 'linear-gradient(90deg, #ff6d6d, #fd3232)'
                        : 'linear-gradient(118.57deg, rgba(255,154,0,1) 0%,rgba(255,197,63,1) 100%)',
                  }}
                >
                  {grouponSignDesc}
                </Text>
              )}
              <Text className='name'>{title}</Text>
            </View>

            <View className='desc'>{skuIntroduce}</View>
            <View className='team'>
              <Text className='user'>{memberCount ? memberCount : 0}人团</Text>
              <Text className='alreadyNum'>
                已拼{groupSaleNum ? groupSaleNum : 0}件
              </Text>
            </View>
          </View>
          <View className='bottom'>
            <View className='left-price'>
              <View className='top'>
                <Text className='icon'>¥</Text>
                <Text className='red'>{grouponPrice ? grouponPrice : 0.0}</Text>
              </View>
              <View className='left-base'>
                单买价
                <Text className='txt'>¥{basePrice ? basePrice : 0.0}</Text>
              </View>
            </View>
            <Button
              onClick={this.onClick}
              openType={buttonOption === 3 ? 'share' : ''}
              dataInfo={info}
              dataType='groupon'
              className={
                buttonOption === 5
                  ? 'button disabled'
                  : buttonOption === 3
                  ? 'button visited'
                  : 'button ok'
              }
            >
              {buttonText
                ? buttonText === '立即开团'
                  ? '去拼团'
                  : buttonText
                : '去拼团'}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
