export default {
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/my/index',
  ],
  
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '由你音乐',
    navigationBarTextStyle: 'black'
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
        text: '动态发布',
      },
      {
        pagePath: 'pages/category/index',
        text: '往期回顾',
      },
      {
        pagePath: 'pages/my/index',
        text: '关于我们',
      },
    ],
  },
}
