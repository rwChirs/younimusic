import Taro,{getCurrentInstance} from '@tarojs/taro';
import { View } from '@tarojs/components';
import { getClubCategoryListV2, addCart, changeClubCollect } from '@7fresh/api';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import MasterCard from '../components/master-card';
import PreviousSplit from '../components/previous-split';
import NoMore from '../components/no-more';
import FloorAddCart from '../../../components/floor-add-cart';
import {
  getUserStoreInfo,
  utils,
  getShareImage,
  get7clubPath,
  images,
  goProDetail,
  logClick,
  exportPoint,
  isLogined,
} from '../utils';
import { ML, ML_LIKE, ML_SHARE } from '../reportPoints';
import Loading from '../../../components/loading';
import { onGoToMine } from '../common/common';
import './index.scss';

const app = Taro.getApp().$app;

export default class Master extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryIds: '',
      refinement: '',
      isLoading: true,
      masterList: [],
      hasMore: false,
      page: 1,
      totalPage: 1,
      storeId: 0,
    };
  }
 
  componentWillMount() {
    console.log('master', app.globalData);
    const routerParams = getCurrentInstance().router.params || {};
    exportPoint(getCurrentInstance().router);
    //先隐藏转发功能
    Taro.hideShareMenu();
    if (routerParams.name) {
      Taro.setNavigationBarTitle({
        title: routerParams.name,
      });
    }

    this.setState(
      {
        name: routerParams.name,
        categoryIds: JSON.parse(routerParams.categoryIds || '[]'),
        refinement: routerParams.refinement || '',
        storeId: routerParams.storeId,
      },
      () => {
        this.getStoreId();
      }
    );
  }

  componentDidShow() {
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  getStoreId = () => {
    const { storeId = '', lat = '', lon = '' } = getCurrentInstance().router.params;

    //三公里定位
    getUserStoreInfo(storeId, lon, lat, '', 3)
      .then(res => {
        if (res.storeId) {
          this.initData();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getList = page => {
    const params = {
      categoryIds: this.state.categoryIds,
      page,
    };
    getClubCategoryListV2(this.state.storeId, params)
      .then(res => {
        console.log('res---->>>', res);
        if (res.success) {
          this.setState({
            isLoading: false,
            masterList:
              page === 1
                ? res.dataInfoList
                : [...this.state.masterList, ...res.dataInfoList],
            page: res.page,
            totalPage: res.totalPage,
            hasMore: res.page !== res.totalPage,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * 检查是否登录
   */
  checkIsLogin = () => {
    return isLogined();
  };

  initData = () => {
    this.getList(1);
  };

  triggerClubCollect = option => {
    console.log('收藏', option);
    logClick({ eid: ML_LIKE });
    if (!this.checkIsLogin()) {
      utils.redirectToLogin(
        `/pages-activity/7club/master/index?categoryIds=${
          this.state.categoryIds
        }&name=${this.state.name || ''}&refinement=${this.state.refinement ||
          ''}`,
        'redirectTo'
      );
      return;
    }
    if (this.changeCollecting) return;
    const params = {
      contentId: option.contentId,
      contentType: option.contentType,
      //操作类型 SEE(1, "浏览"),SHARE(2, "分享"),COLLECT(3, "收藏"),LIKE(4, "点赞"),CANCEL_COLLECT(5, "取消收藏"),CANCEL_LIKE(6, "取消点赞");
      opType:
        option.handlerType === 'collect'
          ? option.collect
            ? 5
            : 3
          : option.ifLike
          ? 6
          : 4,
    };
    this.changeCollecting = true;
    changeClubCollect(this.state.storeId, params)
      .then(res => {
        this.changeCollecting = false;
        console.log('7club收藏', res);
        if (res.success) {
          let txt =
            option.handlerType === 'collect'
              ? option.collect
                ? '取消收藏成功'
                : '收藏成功'
              : option.ifLike
              ? '取消点赞'
              : '谢谢你的赞~';
          Taro.showToast({
            title: txt,
            icon: 'none',
          });
          let masterList = this.state.masterList;
          if (option.handlerType === 'collect') {
            masterList[option.index].extData.collect = !option.collect;
            masterList[option.index].extData.collectRandom = !option.collect
              ? Math.ceil(Math.random() * 100)
              : -1;
            masterList[option.index].extData.collectCount = res.collectSum;
          } else {
            masterList[option.index].extData.ifLike = !option.ifLike;
            masterList[option.index].extData.likeRandom = !option.ifLike
              ? Math.ceil(Math.random() * 100)
              : -1;
            masterList[option.index].extData.likeCount = res.collectSum;
          }

          this.setState({
            masterList,
          });
        }
      })
      .catch(err => {
        this.changeCollecting = false;
        console.log('7club收藏-err', err);
      });
  };

  onReachBottom() {
    //加载更多
    const { page, totalPage } = this.state;
    if (page < totalPage) {
      this.getList(page + 1);
    }
  }

  handleGoDetail = option => {
    console.log('club详情', option);
    if (option.contentType === 3) {
      Taro.showModal({
        title: '提示',
        content: '小程序暂不支持视频播放',
      });
      return;
    }
    logClick({ eid: ML, eparam: { contentId: option.contentId } });
    Taro.navigateTo({
      url: get7clubPath(option),
    });
  };

  //跳转推荐商品详情
  onGoToProDetail = option => {
    goProDetail(option);
  };

  //跳转话题详情页
  onGoToTopicDetail = id => {
    Taro.navigateTo({
      url: `/pages-activity/7club/topic-detail/index?topicId=${id}`,
    });
  };

  /**
   * 转发事件
   */
  onShareAppMessage(option) {
    logClick({ eid: ML_SHARE, eparam: { contentId: option.contentId } });
    console.log('7club转发事件', option);
    if (option.from === 'button') {
      let shareInfo = option.target.dataset.shareInfo || {};
      return {
        title: shareInfo.title,
        imageUrl: getShareImage(shareInfo),
        path: get7clubPath(shareInfo),
      };
    } else {
      return {
        title: '7CLUB',
        imageUrl: images.shareDefaultImg,
        path: `/pages/center-tab-page/index`,
      };
    }
  }

  //加车 是否弹框/直接加车
  onAddCart = option => {
    console.log('加车', option);
    if (!option.addCart) {
      return;
    }
    if (option.isPop === true) {
      this.setState({
        addCartPopData: option,
      });
    } else {
      this._addCart(option);
    }
  };

  //加车
  _addCart = params => {
    addCart({
      data: {
        wareInfos: {
          skuId: params.skuId,
          buyNum: params.startBuyUnitNum,
          startBuyUnitNum: params.startBuyUnitNum,
          serviceTagId: params.serviceTagId || 0,
          selectedTasteInfoIds: params.selectedTasteInfoIds || {},
        },
        storeId: this.state.storeId,
      },
    })
      .then(res => {
        Taro.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
        });
        this.setState({
          addCartPopData: '',
        });
      })
      .catch(err => console.log(err));
  };

  /**
   * 称重商品取消加车
   */
  onCloseAddCartPop = e => {
    if (e && e.stopPropagation) {
      // 防止冒泡
      e.stopPropagation();
    } else {
      window.event.cancelBubble = true;
    }
    this.setState({
      addCartPopData: '',
    });
  };

  /**
   * 跳转7club个人中心
   */
  onGoToMine = (author, ev) => {
    ev.stopPropagation();
    onGoToMine(author);
  };

  render() {
    const { isLoading, masterList, hasMore, addCartPopData } = this.state;
    return (
      <View className='master'>
        {isLoading && <Loading tip='加载中...' />}
        {!isLoading &&
          masterList &&
          masterList.length > 0 &&
          masterList.map((master, index) => {
            return (
              <View key={index} className={index > 0 ? 'mb-20' : ''}>
                <MasterCard
                  size='big'
                  index={index}
                  isCurrent={index === 0}
                  data={master}
                  onClick={this.handleGoDetail.bind(this)}
                  onChangeCollect={this.triggerClubCollect}
                  onGoToProDetail={this.onGoToProDetail}
                  onGoToTopicDetail={this.onGoToTopicDetail}
                  onAddCart={this.onAddCart}
                  onGoToMine={this.onGoToMine}
                />
                {index === 0 && masterList.length > 1 && <PreviousSplit />}
              </View>
            );
          })}
        {!hasMore && <NoMore />}

        <FloorAddCart
          show={addCartPopData?true:false}
          data={addCartPopData}
          onAddCart={this._addCart}
          onClose={this.onCloseAddCartPop}
        />
      </View>
    );
  }
}
