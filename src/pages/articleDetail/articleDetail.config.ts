export default definePageConfig({
  navigationBarTitleText: '文章详情',
  enableShareAppMessage: true,
  usingComponents:{
    "mpWeixin": "../../components/mp-weixin/index",
  },
  window:{
    onReachBottomDistance: 100
  }
})
