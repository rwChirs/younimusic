import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Image, ScrollView } from '@tarojs/components';
import { getRealValue } from '../../../../utils/common/utils';
import './index.scss';
import AboutBill from '../about-bill';
import AboutProducts from '../about-products';
import RecommendEvaluation from '../recommend-evaluation';

export default class FloatingContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      isActive: true,
      scrollIntoViewId: 'aboutProducts',
    };
  }
  tabTop = getRealValue(442);

  onScroll = () => {
    this.$scope
      .createSelectorQuery()
      .select('.relative-recom')
      .boundingClientRect(rect => {
        //console.log("获取顶部topSearch位置", rect,this.tabTop);
        if (rect && rect.bottom) {
          let top = rect.top;
          if (top <= this.tabTop) {
            this.setState({
              isActive: false,
            });
          } else {
            this.setState({
              isActive: true,
            });
          }
        }
      })
      .exec();
  };
  scrollToView = scrollIntoViewId => {
    //const isActive = !this.state.isActive;
    console.log('this  scrollView', this.state);
    this.setState({
      scrollIntoViewId,
    });
  };
  onCloseDialog = () => {
    console.log('closeDialog');
    this.props.onCloseDialog();
  };

  render() {
    const { isActive, scrollIntoViewId } = this.state;
    const {
      data,
      onGoProDetail,
      onAddCart,
      onGoBillDetail,
      onGo7clubDetail,
    } = this.props;
    const { cookBaseInfoList, recomendInfoList, wareInfoList } = data;
    return (
      <View>
        <View className='tab-pro-rel'>
          <View
            className={`text ${isActive ? 'active' : ''} ${
              wareInfoList && wareInfoList.length > 0 ? 'show' : ''
            }`}
            onClick={this.scrollToView.bind(this, 'aboutProducts')}
          >
            提到的商品
            <View className='after' />
          </View>
          <View
            className={`text ${isActive ? '' : 'active'} ${
              cookBaseInfoList || recomendInfoList ? 'show' : ''
            }`}
            onClick={this.scrollToView.bind(this, 'relativeRecom')}
          >
            相关推荐
            <View className='after' />
          </View>
          <View className='close'>
            <Image
              className='img'
              src='https://m.360buyimg.com/img/jfs/t1/44903/7/9057/726/5d662c92Eec748a3a/527aff7fb553d4ea.png'
              onClick={this.onCloseDialog}
            />
          </View>
        </View>
        <ScrollView
          className='scrollview'
          scrollY
          scrollWithAnimation
          //onScrollToUpper={this.onScrollToUpper.bind(this)}
          onScroll={this.onScroll}
          scrollIntoView={scrollIntoViewId}
        >
          {wareInfoList && wareInfoList.length > 0 && (
            <View id='aboutProducts'>
              <AboutProducts
                data={wareInfoList}
                onGoDetail={onGoProDetail}
                onAddCart={onAddCart}
              />
            </View>
          )}
          <View className='relative-recom' id='relativeRecom'>
            {cookBaseInfoList && cookBaseInfoList.length > 0 && (
              <AboutBill
                data={cookBaseInfoList}
                onGoBillDetail={onGoBillDetail}
              />
            )}
            {recomendInfoList && recomendInfoList.length > 0 && (
              <RecommendEvaluation
                data={recomendInfoList}
                onGoDetail={onGo7clubDetail}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
