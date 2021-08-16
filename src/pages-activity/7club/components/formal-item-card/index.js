import Taro from '@tarojs/taro';
import { Component } from 'react';
import { View, Text } from '@tarojs/components';
import { px2vw } from '../../../../utils/common/utils';
import { logClick } from '../../../../utils/common/logReport';
import User from './user/index';
import TextWithIcon from '../text-with-icon/index';
import MainArea from './main-area/index';
import CardFooter from './card-footer/index';
import FreshProductItem from '../../../../components/product-item';
import RecommendList from './recommend-list';
import './index.scss';

export default class FormalItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oneLine: false,
    };
  }

  componentWillMount() {
    const { item } = this.props;
    this.setState({
      oneLine:
        item &&
        item.type === 8 &&
        item.extData &&
        item.extData.contentType === 6,
    });
  }

  //进去7club详情页
  onGoDetail = () => {
    const { onGoDetail, data } = this.props;
    logClick({ eid: '7FRESH_miniapp_2_1578553760939|22' });
    onGoDetail(data);
  };

  //榜单列表进入商品详情页
  getDetail = (index, skuId, storeId) => {
    const { item, onDetail } = this.props;
    logClick({
      eid: '7FRESH_APP_9_20200811_1597153579446|8',
      eparam: {
        skuId,
        index: index + 1,
        contentId: item && item.extData && item.extData.contentId,
      },
    });
    onDetail(skuId, storeId);
  };

  onChangeCollect = type => {
    const { item, onChangeCollect } = this.props;
    if (
      item &&
      item.type === 8 &&
      item.extData &&
      item.extData.contentType === 6
    ) {
      if (type === 'collect') {
        logClick({
          eid: '7FRESH_APP_9_20200811_1597153579446|12',
          eparam: {
            contentId: item && item.extData && item.extData.contentId,
          },
        });
      }
      if (type === 'like') {
        logClick({
          eid: '7FRESH_APP_9_20200811_1597153579446|13',
          eparam: {
            contentId: item && item.extData && item.extData.contentId,
          },
        });
      }
    }
    onChangeCollect({
      ...this.props.data,
      index: this.props.uniqueId,
      handlerType: type,
    });
  };

  //跳转7club个人中心
  onGoToMine = ev => {
    ev.stopPropagation();
    const { data, onGoToMine } = this.props;
    if (data && data.contentSubType === 1) {
      onGoToMine(data.author);
    } else {
      Taro.showToast({
        title: '该用户尚未开通个人主页',
        icon: 'none',
      });
    }
  };

  onGoToTopicDetail = ev => {
    const { onGoToTopicDetail, data } = this.props;
    ev.stopPropagation();
    onGoToTopicDetail(data);
  };

  // 榜单加车
  onAddCart = (index, ev, data) => {
    ev.stopPropagation();
    const { onAddCart } = this.props;
    const content = this.props.data;
    logClick({
      eid: '7FRESH_APP_9_20200811_1597153579446|9',
      eparam: {
        skuId: data.skuId,
        index: index + 1,
      },
    });
    onAddCart({
      ...data,
      content_id: content.contentId,
      content_name: content.title,
    });
  };

  onRecommendAddCart = data => {
    const content = this.props.data;
    this.props.onAddCart({
      ...data,
      content_id: content.contentId,
      content_name: content.title,
    });
  };

  onSearchDetail = (contentId, ev) => {
    ev.stopPropagation();
    const { onSearchDetail } = this.props;
    logClick({
      eid: '7FRESH_APP_9_20200811_1597153579446|11',
      eparam: { contentId },
    });
    onSearchDetail(contentId);
  };

  //榜单整个条目点击上报埋点
  onRank = () => {
    const { item } = this.props;
    const contentId = item && item.extData && item.extData.contentId;
    logClick({
      eid: '7FRESH_APP_9_20200811_1597153579446|7',
      eparam: { contentId },
    });
  };

  render() {
    const {
      item,
      onGoToProDetail,
      showFooter,
      onFindSimiler,
      hasSimiler,
    } = this.props;
    const { oneLine } = this.state;
    const data = item && item.extData;
    const rank =
      item && item.type === 8 && item.extData && item.extData.contentType === 6
        ? true
        : false;
    const wareRankingList = (data && data.wareRankingList) || [];
    const getRankIcon = i => {
      return i >= 3
        ? wareRankingList[3] && wareRankingList[3].detailRankingImage
        : wareRankingList[i] && wareRankingList[i].detailRankingImage;
    };
    return (
      <View
        className='formal-item-card'
        style={{
          background: rank
            ? 'box-shadow: 0px -1px 0px 0px rgba(246,246,246,1)'
            : ' 0 8px 22px 0 rgba(0, 0, 0, 0.04)',
        }}
      >
        {item && item.type !== 8 && (
          <View className='user-box' onClick={this.onGoToMine.bind(this)}>
            <User
              author={data && data.author}
              isShowDot={data && data.contentSubType === 1}
              line={oneLine}
            />
          </View>
        )}
        {item && item.type === 8 && (
          <View>
            <View onClick={this.onGoDetail.bind(this)}>
              <TextWithIcon
                content={data && data.title}
                styleObj={{
                  fontSize: '32rpx',
                  fontWeight: 'bold',
                  fontFamily: 'PingFangSC-Medium',
                }}
                lineNum={1}
                showRightBtn
                rightBtnText='详情'
              />
              <TextWithIcon
                content={data && data.preface}
                lineNum={5}
                styleObj={{
                  marginBottom: '12rpx',
                  fontSize: '24rpx',
                  color: '#95969F',
                }}
              />
            </View>
            {data && data.contentType === 6 && (
              <View className='rank' onClick={this.onRank}>
                <View className='rank-list'>
                  <View className='block' />
                  {data.wareInfoList &&
                    data.wareInfoList.map((info, index) => {
                      return (
                        <FreshProductItem
                          type={3.5}
                          tagNumber={1}
                          addType={1}
                          key={`${index}`}
                          index={`${index + 1}`}
                          resourceType='rank'
                          data={info}
                          rankIcon={getRankIcon(index)}
                          style={{
                            marginRight: px2vw(20),
                            background: `rgba(255,255,255,1)`,
                            borderRadius: px2vw(12),
                            boxShadow: ` 0px 10px 22px 0px rgba(0,0,0,0.05)`,
                          }}
                          onGoDetail={this.getDetail.bind(this, index)}
                          onAddCart={this.onAddCart.bind(this, index)}
                        />
                      );
                    })}
                  <View
                    className='search-more'
                    onClick={this.onSearchDetail.bind(this, data.contentId)}
                  >
                    查看详情
                    <Text className='more' />
                  </View>
                  <View className='block'></View>
                </View>
              </View>
            )}
          </View>
        )}

        <View onClick={this.onGoDetail.bind(this)}>
          {item && item.type !== 8 && (
            <View>
              <MainArea
                data={data}
                uniqueId={this.props.uniqueId}
                type={data && data.contentType}
                subType={data && data.contentSubType}
              />
              {data && data.title && (
                <TextWithIcon
                  label={data && data.tags}
                  content={data && data.title}
                  styleObj={{
                    fontSize: '32rpx',
                    fontWeight: 'bold',
                    marginTop: '24rpx',
                    fontFamily: 'PingFangSC-Medium',
                  }}
                  lineNum={1}
                />
              )}

              <TextWithIcon
                label={data && data.title ? null : data.tags}
                content={data && data.preface}
                lineNum={data && data.title ? 2 : 3}
                styleObj={{ marginBottom: '12rpx' }}
                isShowAll
              />
            </View>
          )}

          {data && data.topicId && data.topicName && (
            <View
              onClick={this.onGoToTopicDetail.bind(this)}
              className='topic-box'
              style={{
                marginBottom:
                  data && data.wareInfoList && data.wareInfoList.length > 0
                    ? ''
                    : '24rpx',
              }}
            >
              {data && data.topicName}
            </View>
          )}
          {data &&
            data.wareInfoList &&
            data.wareInfoList.length > 0 &&
            item.type !== 8 && (
              <RecommendList
                wareInfoList={data && data.wareInfoList}
                onGoToProDetail={onGoToProDetail}
                onAddCart={this.onRecommendAddCart.bind(this)}
                onFindSimiler={onFindSimiler}
                hasSimiler={hasSimiler}
              />
            )}
          {showFooter && (
            <CardFooter data={data} onChangeCollect={this.onChangeCollect} />
          )}
        </View>
      </View>
    );
  }
}
