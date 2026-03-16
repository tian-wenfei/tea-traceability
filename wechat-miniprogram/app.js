// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
  },
  globalData: {
    apiBaseUrl: 'http://192.168.1.203:3000/api',
    userInfo: null
  }
})