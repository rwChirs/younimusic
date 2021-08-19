export default {
  plugins: {
    loginPlugin: {
      version: '1.5.0',
      provider: 'wxefe655223916819e',
    },
  },
  pages: [
    'pages/index/index',
    'pages/category/index', //分类
    'pages/my/index',
    'pages/login/index', // 登录过渡页
    'pages/login/login/index', // 登录回调跳转页
    'pages/center-tab-page/index', //中间tab入口文件
  ],
  subpackages: [
    {
      root: 'pages/new-gift/',
      pages: ['index'],
    },
    {
      root: 'pages/detail/',
      pages: [
        'index', //商详
      ],
    },
    {
      root: 'pages/category/sub/',
      pages: ['index'], // 二级分类页
    },
    {
      root: 'pages/h5share/',
      pages: ['index'], // 对外暴露的公共分享页
    },
    {
      root: 'pages/login/index/',
      pages: ['index'],
    },
    {
      root: 'pages/login/web-view/',
      pages: ['web-view'],
    },
    {
      root: 'pages/login/wv-common/',
      pages: ['wv-common'],
    },
    {
      root: 'pages/luck-red-envelopes/',
      pages: ['index'], // 拼手气红包
    },
    {
      root: 'pages/my/concern/',
      pages: ['index'],
    },
    {
      root: 'pages/payCode/',
      pages: ['payCode'],
    },
    {
      root: 'pages/cmCode/', // 加企业微信群中间页
      pages: ['cmCode'],
    },
    {
      root: 'pages/solitaire/list/',
      pages: ['index'],
    },
    {
      root: 'pages/transition/', //引入插件有报错
      pages: ['transition'],
      plugins: {
        wxcaf1c8f8f41ad846: {
          provider: 'wxcaf1c8f8f41ad846',
          version: '1.0.0',
        },
      },
    },
    {
      root: 'pages/web-view/',
      pages: ['web-view'],
    },
    {
      root: 'pages/new-store/',
      pages: ['index'],
      plugins: {
        'live-player-plugin': {
          version: '1.3.0', // 填写该直播组件最新版本号，微信开发者工具调试时可获取最新版本号
          provider: 'wx2b03c6e691cd7370', // 必须填该直播组件appid，该示例值即为直播组件appid
        },
      },
    },
    {
      root: 'pages-mine/',
      pages: [
        'order-list/index', // 订单列表
        'order-detail/index', // 订单详情
        'orderTrack/orderTrack', // 订单物流
        'orderDetailMap/index', // 订单轨迹
        'about/index', // 关于我们
        'customer-service/index', //客户服务
        'invoice/index', // 发票
        'invoice-download/index', // 查看发票
      ],
    },
    {
      root: 'pages-activity/',
      pages: [
        '7club/club-detail/index',
        '7club/club-mine/index',
        '7club/club-rank-detail/index',
        '7club/club-rank-list/index',
        '7club/master/index',
        '7club/notes-detail/index',
        '7club/post-notes/index',
        '7club/topic-detail/index',
        '7club/topic-list/index',
        '7club/video-detail/index',
        'sales/index/index',
        'sales/form/index',
        'sales/success/index',
        'solitaire/cart/index',
        'solitaire/detail/index',
        'solitaire/my-rebate/index',
        'invitation/index', // 邀请有礼
        'invitation/gift/index', // 老版的手机号邀请有礼
        'fight-group/detail/index',
        'fight-group/list/index',
        'fight-group/team-detail/index',
        'fight-group/three-group/index',
        'bill/bill-detail/index',
        'bill/bill-index/index',
      ],
    },
    {
      root: 'pages/address/',
      pages: [
        'list/index', // 地址列表
        'new/index', //新建地址 修改地址
        'search/index', //地址查询
      ],
    },
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: [
        'pages/login/index/',
        'pages/login/wv-common/',
        'pages/login/web-view/',
        'pages/new-gift/',
        'pages/address/',
      ],
    },
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '七鲜',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    color: '#5E646D',
    selectedColor: '#00AB0C',
    borderStyle: 'white',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'images/home.png',
        selectedIconPath: 'images/home-select.png',
        text: '送到家',
      },
      {
        pagePath: 'pages/category/index',
        iconPath: 'images/category.png',
        selectedIconPath: 'images/category-select.png',
        text: '分类',
      },
      {
        pagePath: 'pages/center-tab-page/index',
        iconPath: 'images/club.png',
        selectedIconPath: 'images/club-select.png',
        text: '7CLUB',
      },
      {
        pagePath: 'pages/my/index',
        iconPath: 'images/my.png',
        selectedIconPath: 'images/my-select.png',
        text: '个人中心',
      },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于定位门店地址',
    },
  },
};
