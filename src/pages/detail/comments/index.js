import Taro from '@tarojs/taro'
import React, { Component } from 'react' // Component 是来自于 React 的 API

import { View, Text, Button } from '@tarojs/components';
import { structureLogClick } from '../../../utils/common/logReport';

import CommentItem from './comment-item';
import RpxLine from '../../../components/rpx-line';

import './index.scss';

export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    comments: {},
  };

  getOpenAppUrl = () => {
    const { commentDetail } = this.props;
    // console.log(typeof commentDetail.tenantName === 'string', 'commentDetail');
    let url = `{"category":"jump","des":"productCommentList","supportVersion":"3.2.6","eventId": "detail_evaluate_alertjump","jsonParams":{"tenantName":"${
      commentDetail.tenantName
    }","storeId":"${
      commentDetail.storeId
    }","pageId":"0014","pageName":"小程序商品详情页","clickId":"detail_evaluate_alertjump"},"params":{"skuId":"${
      commentDetail.skuId
    }","storeId":"${commentDetail.storeId}"},"storeId":"${
      commentDetail.storeId
    }","changeAddressWithStoreID":true,"compareStoreId":true,"lat":"${
      commentDetail.lat
    }","lon":"${commentDetail.lon}","tenantName":"${
      commentDetail.tenantName
    }","bigLogo":"${encodeURIComponent(
      commentDetail.bigLogo
    )}","smallLogo":"${encodeURIComponent(
      commentDetail.smallLogo
    )}","circleLogo":"${encodeURIComponent(
      commentDetail.circleLogo
    )}","storeAddress":"${
      commentDetail.address
    }","backProtocol":"${encodeURIComponent(
      `openapp.sevenfresh://virtual?params={"category":"jump","des":"detail","skuId":${commentDetail.skuId},"storeId":${commentDetail.storeId},"changeAddressWithStoreID":true,"params":{"changeAddressWithStoreID": true,"storeId":${commentDetail.storeId}}}`
    )}"}`;
    url = `openapp.sevenfresh://virtual?params=${encodeURIComponent(url)}`;
    return url;
  };

  launchAppError = e => {
    e.stopPropagation(); // 阻止事件冒泡
    const { onErrorLauch } = this.props;
    let imgUrl =
      'https://m.360buyimg.com/img/jfs/t1/122976/6/19216/6278/5fb4e424Eb23d0d63/27591a3a801f4203.png';
    console.log(this.props.appParameter);
    onErrorLauch(imgUrl);
    // Taro.getSystemInfo().then(res => {
    //   if (res.platform === 'ios') {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往App Store搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   } else {
    //     Taro.showModal({
    //       title: '您还未安装app',
    //       content: '请前往应用商店搜索下载七鲜 App',
    //       showCancel: false,
    //       success: result => {
    //         console.log(result);
    //       },
    //     });
    //   }
    // });
    return;
  };

  onClick = labelId => {
    let { evaluationJumpSwitch, commentDetail, buriedExplabel } = this.props;
    structureLogClick({
      eventId: '7FRESH_APP_3_201803231|54',
      pageParam: {
        skuId: commentDetail && commentDetail.skuId,
        touchstone_expids: buriedExplabel,
        skipFlag: evaluationJumpSwitch,
      },
      jsonParam: {
        skuId: commentDetail && commentDetail.skuId,
        touchstone_expids: buriedExplabel,
        skipFlag: evaluationJumpSwitch,
      },
      eparam: {
        touchstone_expids: buriedExplabel,
      },
    });
    if (Taro.getStorageSync('scene') === 1036 && evaluationJumpSwitch) {
    } else {
      this.props.onHandleClick(labelId);
    }
  };

  render() {
    const { comments, evaluationJumpSwitch } = this.props;
    console.log(comments, 'comments');
    return (
      <View className='comments-new'>
        <View className='header-shop'>
          <View className='title-shop'>商品评价</View>
          {comments && comments.positiveRate && (
            <View
              className='right-area'
              onClick={this.onClick.bind(this, 'ALL')}
            >
              <Text className='em'>{`好评度${comments.positiveRate}%`}</Text>
              <View className='arrow' />
            </View>
          )}
        </View>
        <View className='comment-labels'>
          {comments &&
            comments.commentLabelList &&
            comments.commentLabelList.length > 0 &&
            comments.commentLabelList.map(label => {
              return (
                <View
                  className='comment-label'
                  key={label.labelId}
                  onClick={this.onClick.bind(this, label.labelId)}
                >
                  {label.labelName}
                </View>
              );
            })}
        </View>
        {comments &&
        comments.commentList &&
        comments.commentList.length > 0 &&
        comments.commentList.length > 0 ? (
          comments.commentList.map((comment, index) => {
            return (
              <View className='comment-item' key={index}>
                <RpxLine />
                <CommentItem data={comment} />
              </View>
            );
          })
        ) : (
          <View className='no-comment'>
            <Text>暂无评价</Text>
          </View>
        )}
        {comments && comments.commentList && comments.commentList.length >= 2 && (
          <View className='comment-footer'>
            {/* <View
              className='comment-btn'
              onClick={this.onClick.bind(this, 'ALL')}
            >
              查看全部评价
            </View> */}
            <Button
              openType={`${evaluationJumpSwitch ? 'launchApp' : ''}`}
              className='comment-btn'
              appParameter={this.getOpenAppUrl()}
              onClick={this.onClick.bind(this, 'ALL')}
              onError={this.launchAppError}
              hover-class='none'
            >
              查看全部评价
            </Button>
          </View>
        )}
      </View>
    );
  }
}
