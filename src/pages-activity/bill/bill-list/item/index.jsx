import { Component } from 'react';
import { View, Image } from '@tarojs/components';
import { logClick } from '../../../../utils/common/logReport';
import collect from '../../common';
import reportPoints from '../../reportPoints';
import utils from '../../../../pages/login/util';
import './index.scss';

export default class Item extends Component {
  static defaultProps = {
    data: {
      coverImg: '',
      collectCount: 0,
      title: '',
      recomIndex: '9',
      slogan: '',
      isCollect: true,
    },
    index: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      // hasHalf: false,
      stared: props.data.collect,
      collectCount: props.data.collectCount,
    };
  }

  collect = (contentId, stared, ev) => {
    ev.stopPropagation();
    logClick({
      ev,
      eid: stared ? reportPoints.listCancelCollect : reportPoints.listCollect,
      eparam: { contentId },
    });
    if (this.props.isLogin) {
      collect(this, contentId);
    } else {
      utils.gotoLogin(
        `/pages/bill/bill-detail/index?storeId=${this.storeId}&contentId=${this.contentId}&planDate=${this.planDate}`,
        'redirectTo'
      );
    }
  };
  render() {
    const { data, index, onClick } = this.props;
    const { stared, collectCount } = this.state;
    return (
      <View className='item' onClick={onClick.bind(this, data)}>
        <View className='figure'>
          {data.coverImg && (
            <Image
              className='img'
              src={
                data.coverImg.indexOf('http') > -1
                  ? data.coverImg
                  : `https:${data.coverImg}`
              }
              mode='aspectFill'
            />
          )}
          <View className='number'>{index}</View>
        </View>
        <View className='desc'>
          <View className='title-wrap'>
            <View className='title'>{data.title}</View>
            <View
              className='star-wrap'
              onClick={this.collect.bind(this, data.contentId, stared)}
            >
              <View className={`star ${stared ? 'stared' : 'unstar'}`} />
              <View className={`star-amount ${stared ? 'stared' : 'unstar'}`}>
                {collectCount > 9999 ? '9999+' : collectCount}
              </View>
            </View>
          </View>
          <View className='details'>
            <View className='index'>
              <View className='num'>{data.recomIndex}</View>
              <View className='stars'>
                {data.starLevel && (
                  <View className='star-list'>
                    {parseInt(data.starLevel).map((val, i) => {
                      return (
                        <View className='star-item star-item-full' key={i} />
                      );
                    })}
                    {data.starLevel === 4.5 && (
                      <View className='star-item star-item-half' />
                    )}
                  </View>
                )}
                <View className='stars-txt'>推荐指数</View>
              </View>
            </View>
            <View className='slogan'>{data.slogan}</View>
          </View>
        </View>
      </View>
    );
  }
}
