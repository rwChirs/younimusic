export default {
  pages: [
    "pages/index/index",
    "pages/category/index", //分类
    "pages/my/index",
    "pages/center-tab-page/index", //中间tab入口文件
  ],
  subpackages: [
    {
      root: "pages/detail/",
      pages: [
        "index", //商详
      ],
    },
    {
      root: "pages/login/web-view/",
      pages: ["web-view"],
    },
    {
      root: "pages/login/wv-common/",
      pages: ["wv-common"],
    },
    {
      root: "pages/web-view/",
      pages: ["web-view"],
    },
    {
      root: "pages-mine/",
      pages: [
        "orderDetailMap/index", // 订单轨迹
        "about/index", // 关于我们
      ],
    },
    {
      root: "pages-activity/",
      pages: [
        "invitation/index", // 邀请有礼
      ],
    },
  ],
  preloadRule: {
    "pages/index/index": {
      network: "all",
      packages: ["pages/login/wv-common/", "pages/login/web-view/"],
    },
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "由你",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    color: "#5E646D",
    selectedColor: "#00AB0C",
    borderStyle: "white",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "images/home.png",
        selectedIconPath: "images/home-select.png",
        text: "送到家",
      },
      {
        pagePath: "pages/category/index",
        iconPath: "images/category.png",
        selectedIconPath: "images/category-select.png",
        text: "分类",
      },
      {
        pagePath: "pages/my/index",
        iconPath: "images/my.png",
        selectedIconPath: "images/my-select.png",
        text: "个人中心",
      },
    ],
  },
  permission: {
    "scope.userLocation": {
      desc: "您的位置信息将用于定位门店地址",
    },
  },
};
