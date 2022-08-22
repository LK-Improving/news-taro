export default defineAppConfig({
  pages: [
    'pages/search/search',
    'pages/articleDetail/articleDetail',
    'pages/Login/login',
    'pages/register/register',
    'pages/publish/publish',
    'pages/my/my',
    'pages/home/home'
    
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#e98e97',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    selectedColor: '#e98e97',
    list: [{
      pagePath: 'pages/home/home',
      text: '首页',
      iconPath: './assets/images/tabBar/主页.png',
      selectedIconPath: './assets/images/tabBar/主页-selected.png'
    }, {
      pagePath: 'pages/my/my',
      text: '我的',
      iconPath: './assets/images/tabBar/个人.png',
      selectedIconPath: './assets/images/tabBar/个人-selected.png'
    }]
  }
})
