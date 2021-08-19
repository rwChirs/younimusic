import Taro from '@tarojs/taro';
// ,{ getCurrentInstance } 

import { View, Image } from '@tarojs/components';

import CommonPageComponent from '../../utils/common/CommonPageComponent';

// import {getRealUrl,getURLParameter,getUrlParams,px2vw,} from '../../utils/common/utils';
// import utils from '../login/util';
// import goPage from './goPage';

// import SkeletionScreen from './components/skeleton-screen';
// import CustomTabBar from '../../components/custom-tab-bar';
// import NavBar from './components/nav-bar';
// import FreshFloatBtn from './components/float-btn'; //返回顶部按钮

import './index.scss';

const app = Taro.getApp().$app;
console.log(app)

/**
 * 首页进入场景
 * 1.第一次打开首页，执行定位逻辑
 *
 * 2.小程序切入后台，再回到前台，走定位逻辑
 *
 * 3.小程序通过分享卡片打开
 *
 */

export default class Home extends CommonPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '送到家',
      windowWidth: 375, // 屏幕宽度
      showGoTop: false, // 是否返回顶部

      isLoad: true,
      navHeight: '',
      pageStyle: {},
    };
  }
  /*******************页面渲染未使用的数据**********************/
  scrollTop = 0;
  loadHeight = 0; // 浮动图高度
  canScrollTop = false;

  /*******************页面渲染未使用的数据**********************/
  /*******************生命周期**********************/
  // componentWillMount() {
  //   app.globalData.tabBar = 0;

  //   // 小程序进入后台监听
  //   wx.onAppHide(() => { });
  //   let clientRect = wx.getMenuButtonBoundingClientRect();
  //   Taro.getSystemInfo().then((res) => {
  //     console.info(`【系统信息】：${JSON.stringify(res)}`);
  //     const model = res.model;
  //     const isIphoneX =
  //       /iphone\sx/i.test(model) ||
  //       (/iphone/i.test(model) && /unknown/.test(model)) ||
  //       /iphone\s11/i.test(model) ||
  //       /iphone\s12/i.test(model);
  //     this.setState({
  //       windowWidth: Taro.getSystemInfoSync().windowWidth,
  //       windowHeight: Taro.getSystemInfoSync().windowHeight,
  //       isIphoneX,
  //       navHeight:
  //         (clientRect.bottom + clientRect.top - res.statusBarHeight) * 2,
  //     });
  //     console.log('navHeight', this.state.navHeight, this.state.windowWidth);
  //   });

  //   获取右侧浮动图位置
  //   wx.createSelectorQuery()
  //     .select('.load-home-cont-hidden')
  //     .boundingClientRect((rect) => {
  //       if (rect) {
  //         this.loadHeight = rect.height;
  //       }
  //     })
  //     .exec();
  // }

  // /**
  //  * 页面加载
  //  */
  // componentDidMount() {
  //   const option = getCurrentInstance().router.params;
  //   console.log('getCurrentInstance', getCurrentInstance().router, option);
  // }

  // /**
  //  * 页面显示
  //  * 0.第一次打开时，不执行楼层加载
  //  * 1.切换地址时，走缓存逻辑
  //  * 2.从后台切入前台走定位逻辑
  //  */
  // componentDidShow() {
  //   this.onPageShow();
  // }

  // /**
  //  * 页面隐藏
  //  */
  // componentDidHide() {
  //   this.onPageHide();
  // }

  // componentWillUnmount() {
  //   Taro.setStorageSync('home_storeId');
  // }

  // /**
  //  * 触底
  //  */
  // onReachBottom() {}

  // /**
  //  * 分享
  //  * @param {} options 分享数据
  //  */
  // onShareAppMessage(options) {
  //   let share = {
  //     title: '由你音乐',
  //     url: '/pages/index/index',
  //   };
  //   if (
  //     options.from === 'button' &&
  //     options.target.dataset.type === 'groupon'
  //   ) {
  //     const shareInfo = options.target.dataset.info.shareInfoWeb;
  //     console.log({
  //       title: shareInfo.shareTitle,
  //       imageUrl: shareInfo.appletImageUrl,
  //       url: shareInfo.appletUrl,
  //     });
  //     share = {
  //       title: shareInfo.shareTitle,
  //       imageUrl: shareInfo.appletImageUrl,
  //       url: `/pages/index/index?returnUrl=${encodeURIComponent(
  //         shareInfo.appletUrl
  //       )}`,
  //     };
  //   }
  //   this.onPageShare({
  //     from: options.from,
  //     ...share,
  //   });
  //   return share;
  // }

  // /**
  //  * 下拉刷新
  //  */
  // onPullDownRefresh() {}

  // /**
  //  * 初始化请求数据
  //  */
  // initData() {}

  // /**
  //  * 跳转商详
  //  * @param {*} skuId 商品id
  //  * @param {*} data 商品数据
  //  */
  // goDetail = (skuId) => {
  //   Taro.navigateTo({
  //     url: `/pages/detail/index?storeId=${this.state.storeId}&skuId=${skuId}&tenantId=${this.state.tenantId}&platformId=${this.state.platformId}`,
  //   });
  // };

  // /**
  //  * 页面滚动事件
  //  * 滚动事件尽可能少的改变state
  //  */
  // onPageScroll = (detail) => {
  //   console.log(detail)
  //   if (detail.scrollTop > this.state.windowHeight && !this.canScrollTop) {
  //     this.canScrollTop = true;
  //   }
  //   if (detail.scrollTop <= this.state.windowHeight && this.canScrollTop) {
  //     this.canScrollTop = false;
  //   }
  //   this.scrollTop = detail.scrollTop;
  // };

  // /**
  //  * 为你推荐刷新
  //  */
  // onRecommendRefresh = () => {};
  
  // //阻止页面滚动
  // preventBodyScrool = () => {
  //   this.setState({
  //     pageStyle: {
  //       position: 'fixed',
  //       height: '100%',
  //       overflow: 'hidden',
  //     },
  //   });
  // };

  // //解除阻止页面滚动
  // bodyScrool = () => {
  //   this.setState({
  //     pageStyle: {},
  //   });
  // };
  
  // /**
  //  * 返回顶部
  //  */
  //  goTop = () => {
  //   Taro.pageScrollTo({
  //     scrollTop: 0,
  //     duration: 0,
  //   });
  // };

  render() {
    const {
      // navHeight,windowWidth,showGoTop, isLoad,
      pageStyle,
    } = this.state;

    return (
      <View className='home' style={pageStyle}>
        {/* <View
          className='top-cover'
          style={{
            backgroundPositionY: `${(navHeight / windowWidth) * 375 - 170}rpx`,
          }}
        >
          <NavBar
            title={' '}
            showBack={false}
          />
        </View> */}
        {/* 长列表前的内容 */}
        {/* <View className='content'></View> */}
        {/* 骨架屏 */}
        {/* {isLoad && <SkeletionScreen />} */}
          
        <Image
          // className='back-product-img'
          src='http://m.qpic.cn/psc?/V52Y80us2CqO3j0smwyw3SzevE21vJxr/ruAMsa53pVQWN7FLK88i5h*MehgkvxmZiuG5Mgkjh79GP8m4UzCgJz5.NUGo4sJuriXX6BS8uCWig9J49lCJBql9g3mwPhdxCalnGsZtVrc!/mnull&bo=0AIABQAAAAABB*c!&rf=photolist&t=5'
          mode='aspectFit'
          lazyLoad
        />
          
        {/* <View className='home-bottom'>
          <CustomTabBar
            selected={0}
            onFlag={this.isFixedTop}
            current
            onSwitchTab={this.onRecommendRefresh.bind(this)}
          />
          {showGoTop && (
            <View
              className='go-top'
              style={{
                bottom: px2vw(470) ,
              }}
            >
              <FreshFloatBtn
                type='top'
                title='顶部'
                color='rgb(94, 100, 109)'
                onClick={this.goTop.bind(this)}
              />
            </View>
          )}
        </View> */}
      </View>
    );
  }
}
