import Taro,{ getCurrentInstance } from '@tarojs/taro';
import {
  getSolitaireCartService,
  updateSolitaireCartService,
  batchUpdateSolitaireCartService,
  deleteSolitaireCartService,
} from '@7fresh/api';
import { View, Text, Image } from '@tarojs/components';
import CommonPageComponent from '../../../utils/common/CommonPageComponent';
import FreshFloatBtn from '../../../components/float-btn';
import FreshBottomLogo from '../../../components/bottom-logo';
import FreshFloatLayout from './float-layout';
import FreshCartGoodsList from './cart-goods-list';
import FreshCartGoodsButton from './cart-goods-btn';
import FreshModal from '../../../components/fresh-modal';
import utils from '../../../pages/login/util';
import { h5Url, px2vw } from '../../../utils/common/utils';
import { logClick } from '../../../utils/common/logReport';
import { exportPoint } from '../../../utils/common/exportPoint';
import { theme } from '../../../common/theme';
import './index.scss';

//加入购物车为默认勾选状态 添加置顶操作

export default class SolitaireCart extends CommonPageComponent {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      isPageEmptyContainer: false,
      suitPromotions: [],
      invalidWareInfos: [],
      realCount: 0,
      allCheckBool: false,
      iPhoneX: false,
      isBottomSub: false,
      reduceTotalPrice: 0,
      scrollHeight: 0,
      discountTotalPrice: 0,
      baseTotalPrice: 0,
      scrollTop: 0,
      isCheckAll: false,
      isCheck: false,
      isDeleteModal: false,
      isLoad: false,
      count: 0,
      lbsData: Taro.getStorageSync('addressInfo') || {},
      storeId: '',
      tenantId:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').tenantId) ||
        1,
      lat:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').lat) ||
        '',
      lon:
        (Taro.getStorageSync('addressInfo') &&
          Taro.getStorageSync('addressInfo').lon) ||
        '',
      showCheckboxFalseArr: [],
      editTxt: '编辑',
      commanderPin: '',
      opType: 1, //1是运营团长 0是普通团长
      activityId: '',
      tipList: [],
      descInfo: '',
      modelInfo: {},
      source: '',
    };
  }

  componentWillMount() {
    exportPoint(getCurrentInstance().router);
    Taro.getSystemInfo({
      success: res => {
        this.setState({
          scrollHeight: res.windowHeight,
        });
      },
    });
    const { commanderPin, source, opType } = getCurrentInstance().router.params;
    this.setState({
      commanderPin,
      optype:
        opType === 'null' ||
        opType === 'undefined' ||
        opType === '<Undefined>' ||
        opType === undefined ||
        opType === ''
          ? 1
          : opType,
      source,
    });
  }

  componentDidShow() {
    const { lbsData } = this.state;
    this.setState(
      {
        storeId: lbsData.storeId,
        tenantId: lbsData.tenantId,
        lat: lbsData.lat,
        lon: lbsData.lon,
      },
      () => {
        //判断用户是否登录
        this.init();
      }
    );
    this.onPageShow();
  }

  componentDidHide() {
    this.onPageHide();
  }

  //页面滚动
  onPageScroll = e => {
    this.setState({
      scrollTop: e.scrollTop,
    });
  };

  init = () => {
    const { storeId, tenantId, lat, lon } = this.state;
    const params = {
      storeId,
      tenantId,
      lat,
      lon,
      platformId: 1,
    };
    getSolitaireCartService(params)
      .then(data => {
        if (data && data.success) {
          this.cartShow(data);
          this.fillCart(data);
        } else {
          if (data.code === 3) {
            utils.gotoLogin(`/pages-activity/solitaire/cart/index`, 'redirectTo');
            return;
          }
          if (data && data.msg) {
            Taro.showToast({
              title: data.msg,
              icon: 'none',
            });
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //购物车渲染
  cartShow = data => {
    // 有效商品
    if (
      data.suitPromotions &&
      data.suitPromotions.length > 0 &&
      data.allCartWaresNumber > 0
    ) {
      this.setState({
        isBottomSub: true,
        isPageEmptyContainer: false,
      });
      data.suitPromotions.map(value => {
        value.wareInfos.map(val => {
          if (
            !val.showCheckbox &&
            this.state.showCheckboxFalseArr.indexOf(val.inCartId) < 0
          ) {
            let arr = this.state.showCheckboxFalseArr;
            arr.push(val.inCartId);
            this.setState({ showCheckboxFalseArr: arr });
          }
        });
      });
    } else if (data.invalidWareInfos && data.invalidWareInfos.length > 0) {
      this.setState({
        invalidWareInfos: data.invalidWareInfos,
      });
    } else {
      this.setState({ isPageEmptyContainer: true });
    }
  };

  //购物车数据渲染
  fillCart = data => {
    let list = (data && data.suitPromotions) || []; //促销分组信息
    // 数据处理
    //1、加价购商品信息
    if (data.addMoneySkuInfo && JSON.stringify(data.addMoneySkuInfo) !== '{}') {
      list.addMoneySkuInfo = data.addMoneySkuInfo;
    }
    //2、促销显示的文本与标签
    if (data.showTexts && data.showTexts.length > 0) {
      list.showTexts = data.showTexts[0];
    }

    let invalidList = data.invalidWareInfos || [];
    if (list && list.length > 0) {
      for (let i in list) {
        for (let j in list[i].wareInfos) {
          if (
            list[i].wareInfos[j].status === 1 ||
            list[i].wareInfos[j].status === 5
          ) {
            invalidList.push(list[i].wareInfos[j]);
            list.splice(i, 1);
          }
        }
      }
    }

    this.setState(
      {
        suitPromotions: list, //可用商品
        invalidWareInfos: invalidList,
        commanderPin: data.commanderPin || this.state.commanderPin,
        activityId: data.activityId,
      },
      () => {
        this.onSetCheck();
      }
    );

    // 3、字段渲染
    this.storeId = data.storeId || '';

    let allCheckBool = true;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let wareInfos = list[i].wareInfos;
        for (let j = 0; j < wareInfos.length; j++) {
          if (wareInfos[j].status === 2 && wareInfos[j].check === 0) {
            allCheckBool = false;
            break;
          }
        }
      }
    }
    this.setState({
      discountTotalPrice: data.discountTotalPrice || '0.00', //优惠价格
      baseTotalPrice: data.baseTotalPrice || '0.00', //商品优惠前价格
      reduceTotalPrice: data.reduceTotalPrice || '0.00', //优惠后价格
      count: data.checkedWaresNumber > 99 ? '99+' : data.checkedWaresNumber,
      realCount: data.checkedWaresNumber, //所有选中商品数 h5
      allCheckBool: allCheckBool,
    });
  };

  //右上角编辑
  onEdit = e => {
    logClick({ e, eid: '7FRESH_miniapp_2_1578553760939|4' });
    if (this.state.editTxt === '编辑') {
      this.setState({
        editTxt: '完成',
      });
    } else {
      this.setState({
        editTxt: '编辑',
      });
    }
  };

  //进入商品详情页
  onGoDetail = info => {
    const { activityId, commanderPin, storeId } = this.state;
    Taro.navigateTo({
      url: `/pages-activity/solitaire/detail/index?activityId=${activityId}&commanderPin=${commanderPin}&skuId=${info.skuId}&storeId=${storeId}`,
    });
  };

  //打开问号的弹层
  onQuestion = (info, e) => {
    e.stopPropagation();
    this.setState({
      isShow: true,
      tipList: info,
    });
  };

  //设置选中交互
  onSetCheck = () => {
    const { suitPromotions } = this.state;
    let flag = true,
      isCheck = false;
    for (let i in suitPromotions) {
      for (let j in suitPromotions[i].wareInfos) {
        if (suitPromotions[i].wareInfos[j].check === 0) {
          flag = false;
        } else {
          isCheck = true;
        }
      }
    }
    this.setState({
      isCheckAll: flag,
      isCheck: isCheck,
    });
  };

  //商品单选
  onChoose = info => {
    this.onSetCheck();

    let check;
    if (info.check === 1) {
      check = 0;
    } else {
      check = 1;
    }
    this.updateCartList(info, info.buyNum, check);
  };

  //更新单个商品 触发了更新就选中
  updateCartList = (info, number, check) => {
    this.setState({
      isLoad: true,
    });
    const { storeId, tenantId, lat, lon } = this.state;
    const params = {
      storeId,
      tenantId,
      platformId: 1,
      lat,
      lon,
      cartUpdateSku: {
        skuId: info.skuId,
        skuNum: number,
        check: check,
      },
    };
    updateSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.setState({
            isLoad: false,
          });
          this.cartShow(res);
          this.fillCart(res);
          this.onSetCheck();
        } else if (res && res.message) {
          Taro.showToast({
            title: res && res.message,
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  onMinus = (info, e) => {
    logClick({
      e,
      eid: '7FRESH_miniapp_2_1578553760939|3',
      eparam: {
        skuId: info.skuId,
        buyNum:
          info.buyNum - info.stepBuyUnitNum > 0
            ? info.buyNum - info.stepBuyUnitNum
            : 0,
      },
    });
    if (
      info.buyNum - info.stepBuyUnitNum > 0 &&
      info.buyNum > info.startBuyUnitNum
    ) {
      this.updateCartList(info, info.buyNum - info.stepBuyUnitNum, 1);
    } else {
      this.setState({
        isDeleteModal: true,
        descInfo: '确定删除商品吗？',
        modelInfo: info,
      });
    }
  };

  onPlus = (info, e) => {
    logClick({
      e,
      eid: '7FRESH_miniapp_2_1578553760939|2',
      eparam: {
        skuId: info.skuId,
        buyNum: info.buyNum + info.stepBuyUnitNum,
      },
    });
    this.updateCartList(info, info.buyNum + info.stepBuyUnitNum, 1);
  };

  //全选
  onAllChecked = e => {
    this.setState({
      isLoad: true,
    });

    logClick({ e, eid: '7FRESH_miniapp_2_1551092070962|100' });
    const {
      storeId,
      tenantId,
      lat,
      lon,
      suitPromotions,
      isCheckAll,
    } = this.state;

    let list = suitPromotions,
      skuIds = [];
    for (let i in list) {
      for (let j in list[i].wareInfos) {
        if (!isCheckAll) {
          list[i].wareInfos[j].check = 1;
        } else {
          list[i].wareInfos[j].check = 0;
        }
        skuIds.push({
          skuId: list[i].wareInfos[j].skuId,
          skuNum: list[i].wareInfos[j].buyNum,
          check: list[i].wareInfos[j].check,
        });
      }
    }

    if (skuIds === [null]) {
      skuIds = null;
    }

    const params = {
      storeId,
      tenantId,
      lat,
      lon,
      platformId: 1,
      cartUpdateSkuList: skuIds,
    };
    batchUpdateSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.cartShow(res);
          this.fillCart(res);

          this.setState({
            isCheckAll: !isCheckAll,
            count: !isCheckAll ? list.length : 0,
            isLoad: false,
          });
        } else if (res && res.message) {
          Taro.showToast({
            title: res && res.message,
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        if (err) {
          Taro.showToast({
            title: err,
            icon: 'none',
          });
          return;
        }
      });
  };

  //提交
  onSubmit = e => {
    const {
      storeId,
      activityId,
      commanderPin,
      suitPromotions,
      count,
    } = this.state;
    if (count === 0) {
      return;
    }
    const params = {
      solitaireRequest: {
        activityId,
        commanderPin,
      },
    };

    let skuList = [];
    for (let i in suitPromotions) {
      for (let j in suitPromotions[i].wareInfos) {
        if (suitPromotions[i].wareInfos[j].check === 1) {
          skuList.push(suitPromotions[i].wareInfos[j].skuId);
        }
      }
    }

    logClick({
      e,
      eid: '7FRESH_miniapp_2_1578553760939|5',
      eparam: { skuIds: skuList },
    });

    const orderUrl = `${h5Url}/order.html?storeId=${storeId}&nowBuy=15&from=miniapp&newResource=solitaire&nowBuyData=${encodeURIComponent(
      JSON.stringify(params)
    )}`;
    utils.navigateToH5({ page: orderUrl });
  };

  //关闭购买说明
  handleClose = () => {
    this.setState({
      isShow: false,
    });
  };

  //删除
  onDelete = info => {
    const { storeId, tenantId, lat, lon, isCheck, isCheckAll } = this.state;
    let suitPromotions = this.state.suitPromotions;
    let skuIds = [];
    if (info == 'deleteAll') {
      if (!isCheck && !isCheckAll) {
        return;
      }
      for (let i in suitPromotions) {
        for (let j in suitPromotions[i].wareInfos) {
          if (suitPromotions[i].wareInfos[j].check === 1) {
            skuIds.push(suitPromotions[i].wareInfos[j].skuId);
          }
        }
      }
    } else if (info.skuId) {
      skuIds = [info.skuId];
    }

    if (skuIds === [null]) {
      skuIds = null;
    }

    const params = {
      storeId,
      tenantId,
      platformId: 1,
      lat,
      lon,
      skuIds: skuIds,
    };
    deleteSolitaireCartService(params)
      .then(res => {
        if (res && res.success) {
          this.cartShow(res);
          this.fillCart(res);
          this.setState({
            modelInfo: {},
            isDeleteModal: false,
          });
        } else if (res && res.message) {
          Taro.showToast({
            title: res && res.message,
            icon: 'none',
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //确认清除
  onConfirm = () => {
    const {
      storeId,
      tenantId,
      lat,
      lon,
      invalidWareInfos,
      modelInfo,
      descInfo,
    } = this.state;
    if (descInfo === '确定删除商品吗？') {
      this.onDelete(modelInfo);
    } else {
      let skuIds = [];
      invalidWareInfos.forEach(value => {
        skuIds.push(value.skuId);
      });
      if (skuIds === [null]) {
        skuIds = null;
      }
      const params = {
        storeId,
        tenantId,
        lat,
        lon,
        skuIds,
        platformId: 1,
      };
      deleteSolitaireCartService(params)
        .then(res => {
          if (res && res.success) {
            //关闭弹框
            this.onCancel();
            //刷新页面
            this.cartShow(res);
            this.fillCart(res);
          } else if (res && res.message) {
            Taro.showToast({
              title: res && res.message,
              icon: 'none',
            });
            return;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  //清除失效商品
  onRemoveInvalidGoods = () => {
    //确认清除弹框
    this.setState({
      isDeleteModal: true,
      descInfo: '确认清除无效商品',
    });
  };

  //关闭清除弹框
  onCancel = () => {
    this.setState({
      isDeleteModal: false,
    });
  };

  //去首页逛逛
  goToList = e => {
    logClick({ e, eid: '7FRESH_miniapp_2_1578553760939|1' });
    Taro.navigateTo({
      url: `/pages/solitaire/list/index?storeId=${this.state.storeId}&commanderPin=${this.state.commanderPin}&opType=${this.state.optype}`,
    });
  };

  //置顶
  goTop = () => {
    this.setState({
      scrollTop: 0,
    },()=>{
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
    });
  };

  render() {
    const {
      isPageEmptyContainer,
      suitPromotions,
      invalidWareInfos,
      realCount,
      allCheckBool,
      iPhoneX,
      isBottomSub,
      reduceTotalPrice,
      discountTotalPrice,
      baseTotalPrice,
      isCheckAll,
      isCheck,
      count,
      editTxt,
      isShow,
      isDeleteModal,
      scrollTop,
      scrollHeight,
      tipList,
      descInfo,
      isLoad,
    } = this.state;

    return (
      <View className='solitaire-cart' onPageScroll={this.onPageScroll}>
        {/** loading */}
        {isLoad && (
          <View className='loading'>
            <Image
              className='img-component'
              src='https://m.360buyimg.com/img/jfs/t1/16530/28/5534/2087/5c3ea619Ed9139020/ec77553c350f4d29.png'
              mode='aspectFit'
              lazyLoad
            />
          </View>
        )}

        {!isPageEmptyContainer && suitPromotions && suitPromotions.length > 0 && (
          <View
            className='solitaire-cart-edit'
            onClick={this.onEdit.bind(this)}
          >
            {editTxt}
          </View>
        )}

        {/* 拖底 */}
        <View
          className='solitaire-cart-bottom'
          style={{
            display: isPageEmptyContainer ? 'block' : 'none',
          }}
        >
           <View className='page-empty-container'>
              <View className='empty-main'>
                <View className='empty-img'>
                  <Image
                    src='//m.360buyimg.com/img/jfs/t1/67078/14/4798/78563/5d2ed772E80141eca/c54b050ff18cbe71.png'
                    className='img'
                    mode='aspectFit'
                  />
                </View>
                <View className='empty-txt'>
                  <Text className='word'>购物车是空的，快去挑选商品吧</Text>
                </View>
                <View className='to-index-btn'  onClick={this.goToList.bind(this)}>
                  <Text className='word'>去团长首页</Text>
                </View>
              </View>
            </View>
        </View>
        <View
          className='solitaire-cart-container'
          style={{
            display: !isPageEmptyContainer ? 'block' : 'none',
          }}
        >
          {/* 可选商品 */}
          <View className='cart-items-main'>
            {suitPromotions &&
              suitPromotions.length > 0 &&
              suitPromotions.map((value, index) => {
                return (
                  <FreshCartGoodsList
                    data={value}
                    key={index}
                    noneBorder
                    isHasBorder={false}
                    onGoDetail={this.onGoDetail.bind(this)}
                    onQuestion={this.onQuestion.bind(this)}
                    onChoose={this.onChoose.bind(this)}
                    onPlus={this.onPlus.bind(this)}
                    onMinus={this.onMinus.bind(this)}
                  />
                );
              })}
          </View>

          {invalidWareInfos && invalidWareInfos.length > 0 && (
            <View className='white-bg'>
              <View className='solitaire-invalid-title'>
                <Text>
                  {invalidWareInfos.length}件因库存/配送范围失效的商品
                </Text>
                <Text
                  className='blue'
                  onClick={this.onRemoveInvalidGoods.bind(this)}
                >
                  清除失效商品
                </Text>
              </View>
              <View className='invalid-main'>
                <View className='items-list'>
                  {invalidWareInfos.map((value, index) => {
                    return (
                      <FreshCartGoodsList
                        type='invalid'
                        data={value}
                        noneBorder
                        key={index}
                        onGoDetail={this.onGoDetail.bind(this)}
                        isHasBorder
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          <View className='bottom-logo-position'>
            <FreshBottomLogo />
          </View>

          {/* 去结算 */}
          {editTxt === '编辑' &&
            !isPageEmptyContainer &&
            suitPromotions &&
            suitPromotions.length > 0 && (
              <FreshCartGoodsButton
                realCount={realCount}
                allCheckBool={allCheckBool}
                iPhoneX={iPhoneX}
                isBottomSub={isBottomSub}
                reduceTotalPrice={reduceTotalPrice}
                discountTotalPrice={discountTotalPrice}
                baseTotalPrice={baseTotalPrice}
                isCheckAll={isCheckAll}
                isCheck={isCheck}
                count={count}
                onAllChecked={this.onAllChecked.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
              />
            )}

          {/* 全选删除 */}
          {editTxt === '完成' &&
            !isPageEmptyContainer &&
            suitPromotions &&
            suitPromotions.length > 0 && (
              <View
                className={`bottom-edit ${
                  this.state.realCount === 0
                    ? 'no-check'
                    : allCheckBool
                    ? 'checked'
                    : 'no-check'
                }`}
                style={{
                  bottom: iPhoneX ? px2vw(100) : 0,
                }}
              >
                <View
                  className='left-part'
                  onClick={this.onAllChecked.bind(this)}
                >
                  <View className='label'>
                    <Text
                      className={
                        isCheckAll ? 'check checked' : 'check no-check'
                      }
                    ></Text>
                    <Text className='check-txt'>全选</Text>
                  </View>
                </View>
                <View
                  className='right-part'
                  onClick={this.onDelete.bind(this, 'deleteAll')}
                >
                  <Text
                    className={
                      isCheckAll || isCheck ? 'delete delete-active' : 'delete'
                    }
                  >
                    删除
                  </Text>
                </View>
              </View>
            )}
        </View>

        <FreshFloatLayout
          title='购买说明'
          isOpened={isShow}
          customStyle={{
            height: px2vw(600),
          }}
          onClose={this.handleClose.bind(this)}
        >
          <View className='content-wrapper'>
            {tipList &&
              tipList.map((info, index) => {
                return (
                  <View key={`tip-${index}`} className='tip-list'>
                    {info}
                  </View>
                );
              })}
          </View>
        </FreshFloatLayout>

        <FreshModal
          show={isDeleteModal}
          width={560}
          height={200}
          desc={descInfo}
          type={2}
          confirmTxt='确定'
          cancelTxt='取消'
          borderRadius='10px'
          descStyle='height:44px;line-height:44px;margin-top:13px;font-size:14px'
          rBtnStyle={`border-radius: 0 0 10px 0;color:${theme.color};background:#fff;border-left:1px solid #edeef2`}
          lBtnStyle='border-radius: 0   0  10px 0;'
          onConfirm={this.onConfirm.bind(this)}
          onCancel={this.onCancel.bind(this)}
        />

        {/** 返回首页& 返回顶部 */}
        {scrollTop !== 0 && scrollTop > scrollHeight / 2 && (
          <View className='goTop'>
            <FreshFloatBtn
              type='top'
              title='顶部'
              color='rgb(121,47,37)'
              borderColor='rgba(121,47,37,0.3)'
              onClick={this.goTop.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}
