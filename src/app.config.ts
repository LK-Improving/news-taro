export default defineAppConfig({
  pages: [
    'pages/home/home',
    'pages/my/my'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#e98e97',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    selectedColor: '#e98e97',
    list: [{
      pagePath: 'pages/home/home',
      text: '首页',
      iconPath: './assets/images/主页.png',
      selectedIconPath: './assets/images/主页-selected.png'
    }, {
      pagePath: 'pages/my/my',
      text: '个人',
      iconPath: './assets/images/个人.png',
      selectedIconPath: './assets/images/个人-selected.png'
    }]
  }
})
