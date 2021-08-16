import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Video, ScrollView } from '@tarojs/components';
import AboutProducts from '../../components/about-products';
import AboutBill from '../../components/about-bill';
import RecommendEvaluation from '../../components/recommend-evaluation';
import TextWithIcon from '../../components/text-with-icon/index';
import User from '../../components/formal-item-card/user/index';

import './index.scss';

export default class ClubDtail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data,
      onGoProDetail,
      onAddCart,
      onGoBillDetail,
      onGo7clubDetail,
    } = this.props;
    const {
      clubDetailInfo = {},
      cookBaseInfoList = [],
      recomendInfoList = [],
      wareInfoList = [],
    } = data;
    return (
      <View className='detail'>
        <View className='detail-top-box'>
          <Video
            autoplay
            initialTime='0'
            loop
            objectFit='contain'
            className='detail-top-video'
            src={clubDetailInfo.videoUrl}
          />
        </View>

        <ScrollView className='scroll-body' scrollY>
          <View className='user-box'>
            <User author={clubDetailInfo.author} />
          </View>
          {clubDetailInfo.title && (
            <TextWithIcon
              label={clubDetailInfo.categoryName}
              content={clubDetailInfo.title}
              styleObj={{
                fontSize: '34rpx',
                fontWeight: 500,
              }}
              lineNum={1}
            />
          )}
          <TextWithIcon
            label={clubDetailInfo.title ? null : clubDetailInfo.categoryName}
            content={clubDetailInfo.preface}
            isCollapse={false}
          />
          {wareInfoList && wareInfoList.length > 0 && (
            <AboutProducts
              data={wareInfoList}
              onGoDetail={onGoProDetail}
              onAddCart={onAddCart}
            />
          )}
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
        </ScrollView>
      </View>
    );
  }
}
