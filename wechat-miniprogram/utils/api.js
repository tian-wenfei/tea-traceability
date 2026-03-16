// api.js - 网络请求模块
const app = getApp();
const apiBaseUrl = app.globalData.apiBaseUrl;

// 网络请求封装（带重试机制）
const request = (url, method = 'GET', data = {}, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiBaseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject({ message: '请求失败', statusCode: res.statusCode });
        }
      },
      fail: (err) => {
        // 最多重试2次
        if (retryCount < 2) {
          console.log('网络请求失败，正在重试...', retryCount + 1);
          // 延迟1000ms后重试
          setTimeout(() => {
            request(url, method, data, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        } else {
          reject({ message: '网络错误', err });
        }
      }
    });
  });
};

// 茶叶追溯相关API
const teaApi = {
  // 根据追溯码查询茶叶信息
  getTeaByTraceCode: async (traceCode) => {
    try {
      const result = await request(`/tea/${traceCode}`);
      return result;
    } catch (error) {
      console.error('查询茶叶信息失败:', error);
      throw error;
    }
  },
  
  // 获取所有茶叶信息（可选功能）
  getAllTea: async () => {
    try {
      const result = await request('/tea');
      return result;
    } catch (error) {
      console.error('获取茶叶列表失败:', error);
      throw error;
    }
  },
  
  // 创建茶叶信息（可选功能，用于管理员）
  createTea: async (teaData) => {
    try {
      const result = await request('/tea/create', 'POST', teaData);
      return result;
    } catch (error) {
      console.error('创建茶叶信息失败:', error);
      throw error;
    }
  }
};

// 模拟数据 - 当网络请求失败时使用
const mockData = [
  {
    "traceCode": "TEA2024000001",
    "name": "西湖龙井",
    "type": "绿茶",
    "origin": "浙江省杭州市",
    "producer": "杭州西湖茶叶有限公司",
    "productionDate": "2024-03-15",
    "harvestDate": "2024-03-10",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-03-10",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "加工",
        "date": "2024-03-11",
        "description": "茶叶加工处理"
      },
      {
        "step": "烘焙",
        "date": "2024-03-12",
        "description": "茶叶烘焙"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-03-14",
      "testResults": "质量检测合格，符合国家标准"
    },
    "packagingInfo": {
      "material": "纸质包装",
      "packageDate": "2024-03-15",
      "packageQuantity": 100
    },
    "distributionInfo": [
      {
        "location": "杭州西湖茶叶有限公司",
        "date": "2024-03-15",
        "status": "包装完成"
      },
      {
        "location": "杭州茶叶批发市场",
        "date": "2024-03-16",
        "status": "运输中"
      },
      {
        "location": "上海茶叶专卖店",
        "date": "2024-03-18",
        "status": "已上架"
      }
    ]
  },
  {
    "traceCode": "TEA2024000002",
    "name": "大红袍",
    "type": "乌龙茶",
    "origin": "福建省武夷山市",
    "producer": "武夷山岩茶有限公司",
    "productionDate": "2024-04-05",
    "harvestDate": "2024-03-28",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-03-28",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "萎凋",
        "date": "2024-03-29",
        "description": "茶叶萎凋处理"
      },
      {
        "step": "做青",
        "date": "2024-03-30",
        "description": "茶叶做青工艺"
      },
      {
        "step": "烘焙",
        "date": "2024-04-02",
        "description": "茶叶烘焙"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-04-04",
      "testResults": "质量检测合格，符合乌龙茶国家标准"
    },
    "packagingInfo": {
      "material": "陶瓷罐装",
      "packageDate": "2024-04-05",
      "packageQuantity": 50
    },
    "distributionInfo": [
      {
        "location": "武夷山岩茶有限公司",
        "date": "2024-04-05",
        "status": "包装完成"
      },
      {
        "location": "福州茶叶批发市场",
        "date": "2024-04-06",
        "status": "运输中"
      },
      {
        "location": "北京茶叶专卖店",
        "date": "2024-04-08",
        "status": "已上架"
      }
    ]
  },
  {
    "traceCode": "TEA2024000003",
    "name": "祁门红茶",
    "type": "红茶",
    "origin": "安徽省祁门县",
    "producer": "祁门红茶有限公司",
    "productionDate": "2024-05-10",
    "harvestDate": "2024-05-05",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-05-05",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "萎凋",
        "date": "2024-05-06",
        "description": "茶叶萎凋处理"
      },
      {
        "step": "揉捻",
        "date": "2024-05-07",
        "description": "茶叶揉捻工艺"
      },
      {
        "step": "发酵",
        "date": "2024-05-08",
        "description": "茶叶发酵工艺"
      },
      {
        "step": "烘干",
        "date": "2024-05-09",
        "description": "茶叶烘干处理"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-05-09",
      "testResults": "质量检测合格，符合红茶国家标准"
    },
    "packagingInfo": {
      "material": "铁罐包装",
      "packageDate": "2024-05-10",
      "packageQuantity": 80
    },
    "distributionInfo": [
      {
        "location": "祁门红茶有限公司",
        "date": "2024-05-10",
        "status": "包装完成"
      },
      {
        "location": "合肥茶叶批发市场",
        "date": "2024-05-11",
        "status": "运输中"
      },
      {
        "location": "广州茶叶专卖店",
        "date": "2024-05-13",
        "status": "已上架"
      }
    ]
  }
];

// 获取模拟数据
const getMockDataByTraceCode = (traceCode) => {
  return mockData.find(item => item.traceCode === traceCode);
};

// 获取本地存储的茶叶数据
const getLocalDataByTraceCode = (traceCode) => {
  try {
    const localData = wx.getStorageSync('teaData') || [];
    return localData.find(item => item.traceCode === traceCode);
  } catch (error) {
    console.error('获取本地存储数据失败:', error);
    return null;
  }
};

module.exports = {
  request,
  teaApi,
  getMockDataByTraceCode,
  getLocalDataByTraceCode
};