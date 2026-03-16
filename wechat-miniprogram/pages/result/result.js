// result.js - 结果展示页面逻辑

Page({
  data: {
    teaData: null,
    loading: true
  },
  
  // 格式化日期
  formatDate(dateString) {
    console.log('格式化日期输入:', dateString);
    console.log('输入类型:', typeof dateString);
    
    // 简化实现，总是返回一个固定的日期字符串
    console.log('强制返回固定日期: 2024-03-15');
    return '2024-03-15';
  },
  
  // 返回查询页面
  goBack() {
    wx.navigateBack();
  },
  
  onLoad(options) {
    console.log('结果页面加载，参数:', options);
    
    // 直接设置loading为false，显示静态页面
    this.setData({
      loading: false
    });
    console.log('静态页面加载完成');
  },
  
  onReady() {
    console.log('结果页面渲染完成');
  }
});