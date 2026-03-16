// index.js - 查询页面逻辑
const { teaApi, getMockDataByTraceCode, getLocalDataByTraceCode } = require('../../utils/api');

Page({
  data: {
    traceCode: '',
    loading: false,
    message: '',
    messageType: ''
  },
  
  // 追溯码输入绑定
  bindTraceCodeInput(e) {
    this.setData({
      traceCode: e.detail.value
    });
  },
  
  // 显示消息
  showMessage(message, type = 'error') {
    this.setData({
      message,
      messageType: type
    });
    
    // 3秒后自动清除消息
    setTimeout(() => {
      this.setData({
        message: '',
        messageType: ''
      });
    }, 3000);
  },
  
  // 查询茶叶信息
  async searchTea() {
    const { traceCode } = this.data;
    
    if (!traceCode) {
      this.showMessage('请输入追溯码', 'error');
      return;
    }
    
    this.setData({ loading: true, message: '', messageType: '' });
    
    try {
      // 尝试从后端API查询
      const result = await teaApi.getTeaByTraceCode(traceCode);
      
      if (result && result.data) {
        // 查询成功，跳转到结果页面
        wx.navigateTo({
          url: `/pages/result/result?teaData=${encodeURIComponent(JSON.stringify(result.data))}`
        });
      } else {
        // API查询失败，尝试使用模拟数据
        this.showMessage('网络查询失败，尝试使用本地数据', 'warning');
        this.tryMockData(traceCode);
      }
    } catch (error) {
      console.error('API查询失败，尝试使用模拟数据:', error);
      
      // 根据错误类型显示不同的提示
      if (error.message && error.message.includes('网络')) {
        this.showMessage('网络连接失败，请检查网络设置后重试', 'error');
      } else if (error.statusCode) {
        this.showMessage(`服务器错误 (${error.statusCode})，尝试使用本地数据`, 'warning');
      } else {
        this.showMessage('查询失败，尝试使用本地数据', 'warning');
      }
      
      // API查询失败，尝试使用模拟数据
      this.tryMockData(traceCode);
    } finally {
      this.setData({ loading: false });
    }
  },
  
  // 尝试使用模拟数据
  tryMockData(traceCode) {
    // 尝试使用模拟数据
    const mockTea = getMockDataByTraceCode(traceCode);
    
    if (mockTea) {
      console.log('使用模拟数据:', mockTea);
      console.log('模拟数据中的日期字段:');
      console.log('productionDate:', mockTea.productionDate);
      console.log('harvestDate:', mockTea.harvestDate);
      console.log('加工步骤日期:', mockTea.processingSteps?.map(step => step.date));
      
      // 使用模拟数据
      wx.navigateTo({
        url: `/pages/result/result?teaData=${encodeURIComponent(JSON.stringify(mockTea))}`
      });
    } else {
      // 尝试使用本地存储数据
      const localTea = getLocalDataByTraceCode(traceCode);
      
      if (localTea) {
        console.log('使用本地存储数据:', localTea);
        console.log('本地存储数据中的日期字段:');
        console.log('productionDate:', localTea.productionDate);
        console.log('harvestDate:', localTea.harvestDate);
        console.log('加工步骤日期:', localTea.processingSteps?.map(step => step.date));
        
        // 使用本地存储数据
        wx.navigateTo({
          url: `/pages/result/result?teaData=${encodeURIComponent(JSON.stringify(localTea))}`
        });
      } else {
        this.showMessage('未找到该茶叶信息，请检查追溯码是否正确', 'error');
      }
    }
  },
  
  // 重置表单
  resetForm() {
    this.setData({
      traceCode: '',
      message: '',
      messageType: ''
    });
  },
  
  // 扫一扫功能
  scanCode() {
    wx.scanCode({
      success: (res) => {
        // 扫码成功，获取扫码结果
        const traceCode = res.result;
        this.setData({ traceCode });
        this.searchTea();
      },
      fail: (err) => {
        console.error('扫码失败:', err);
        this.showMessage('扫码失败，请重试', 'error');
      }
    });
  },
  
  // 图片加载失败处理
  handleImageError(e) {
    console.error('图片加载失败:', e);
    // 图片加载失败时，不做特殊处理，因为我们已经有了渐变背景作为 fallback
  },
  
  onLoad() {
    console.log('查询页面加载');
  }
});
