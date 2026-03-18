// 追溯系统前端交互逻辑

// DOM元素
const searchForm = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');

// 失踪儿童数据（来源：公安部儿童失踪信息紧急发布平台）
const missingChildrenData = [
    {
        id: 1,
        name: "郑泽文",
        gender: "男",
        birthDate: "2013年9月23日",
        age: "12岁",
        missingDate: "2025年10月16日",
        missingLocation: "甘肃省兰州市榆中县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhengzewen&gender=male&age=child",
        description: "身高163cm，体重113斤，短发。失踪时上身穿黑色连帽棉衣，下身穿红色校裤，红色运动鞋，背黑色书包。",
        contact: "110"
    },
    {
        id: 2,
        name: "董苡柔",
        gender: "女",
        birthDate: "2022年",
        age: "2.5岁",
        missingDate: "2024年8月12日",
        missingLocation: "山西省运城市芮城县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=dongyirou&gender=female&age=child",
        description: "小名十月，走失时穿粉红色衣服，拖鞋。",
        contact: "张寰萌18834355172，董朝放13994899657"
    },
    {
        id: 3,
        name: "王宇泽",
        gender: "男",
        birthDate: "2011年3月27日",
        age: "13岁",
        missingDate: "2024年6月10日",
        missingLocation: "陕西省西安市未央区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangyuze&gender=male&age=child",
        description: "身高1.6米左右，离家出走时穿白色短袖，黑色长裤，黑色鞋子带白边。",
        contact: "110"
    },
    {
        id: 4,
        name: "周依星",
        gender: "女",
        birthDate: "2013年",
        age: "11岁",
        missingDate: "2024年",
        missingLocation: "湖南省娄底市娄星区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhouyixing&gender=female&age=child",
        description: "身高1.52米，100斤左右，娄底口音，讲普通话，外出时身穿蓝色条纹衫和白色外套，牵了一条白色的小狗。",
        contact: "110"
    },
    {
        id: 5,
        name: "韩广灵",
        gender: "女",
        birthDate: "2013年",
        age: "12岁",
        missingDate: "2024年1月30日",
        missingLocation: "吉林省松原市前郭县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=hanguangling&gender=female&age=child",
        description: "短发，身高150cm，体重30公斤，吉林省本地口音，衣着红色羽绒服。",
        contact: "110"
    },
    {
        id: 6,
        name: "任寅赫",
        gender: "男",
        birthDate: "2011年",
        age: "13岁",
        missingDate: "2023年11月10日",
        missingLocation: "河南省许昌市魏都区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=renyinhe&gender=male&age=child",
        description: "短发，身高150cm，体重35公斤，许昌口音。走失时穿白色棉袄上衣，灰色运动裤，白色运动鞋。",
        contact: "15137429272"
    },
    {
        id: 7,
        name: "赵麒桦",
        gender: "男",
        birthDate: "2015年",
        age: "8岁",
        missingDate: "2023年7月1日",
        missingLocation: "海南省海口市龙华区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoqihua&gender=male&age=child",
        description: "身高135cm，体重33KG。身穿上衣绿色短袖，下衣黑色带黄，粉红色拖鞋。",
        contact: "18389606689，符义德警官66599331"
    },
    {
        id: 8,
        name: "余乐",
        gender: "男",
        birthDate: "2010年",
        age: "13岁",
        missingDate: "2023年6月5日",
        missingLocation: "云南省曲靖市宣威市",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=yule&gender=male&age=child",
        description: "失踪时身穿红色校服，黑色裤子。",
        contact: "110"
    },
    {
        id: 9,
        name: "王星惠",
        gender: "女",
        birthDate: "2012年",
        age: "12岁",
        missingDate: "2023年3月11日",
        missingLocation: "海南省海口市琼山区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangxinghui&gender=female&age=child",
        description: "身高约150厘米，紫黑色齐肩短发。出走时身穿黑色短袖上衣，灰色大头拖鞋。",
        contact: "110"
    },
    {
        id: 10,
        name: "韩盈",
        gender: "女",
        birthDate: "2011年",
        age: "12岁",
        missingDate: "2023年3月11日",
        missingLocation: "云南省昆明市西山区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=hanying&gender=female&age=child",
        description: "因学习成绩不理想，经常被父母打骂，已多次离家出走。",
        contact: "110"
    },
    {
        id: 11,
        name: "赵国辉",
        gender: "男",
        birthDate: "2011年",
        age: "12岁",
        missingDate: "2023年2月4日",
        missingLocation: "云南省大理州云龙县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoguohui&gender=male&age=child",
        description: "身高130cm左右，云龙县长新乡白族口音、平头短发、上身着蓝色黑袖拉链夹克，下身着黑色裤子，脚穿绿色胶鞋。",
        contact: "110"
    },
    {
        id: 12,
        name: "赵国庆",
        gender: "男",
        birthDate: "2011年",
        age: "12岁",
        missingDate: "2023年2月4日",
        missingLocation: "云南省大理州云龙县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoguoqing&gender=male&age=child",
        description: "身高130cm左右，云龙县长新乡白族口音、平头短发、上身着黑白横条纹长袖T恤，下身着黑色裤子，脚穿绿色胶鞋。",
        contact: "110"
    },
    {
        id: 13,
        name: "张章程",
        gender: "男",
        birthDate: "2017年",
        age: "6岁",
        missingDate: "2023年2月2日",
        missingLocation: "海南省临高县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangzhangcheng&gender=male&age=child",
        description: "身高约1米，体重约20公斤。离家时身穿黑、黄相间长袖，黑色长裤，没有穿鞋。",
        contact: "110"
    },
    {
        id: 14,
        name: "孙玉峰",
        gender: "男",
        birthDate: "2012年",
        age: "11岁",
        missingDate: "2023年2月1日",
        missingLocation: "河南省南阳市南召县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunyufeng&gender=male&age=child",
        description: "身高140cm，30公斤重，短发，本地口音。走失时上身穿着黑色羽绒服，下穿卡色卫裤。",
        contact: "110"
    },
    {
        id: 15,
        name: "郑益庆",
        gender: "男",
        birthDate: "2020年",
        age: "2.5岁",
        missingDate: "2023年1月10日",
        missingLocation: "海南省临高县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhengyiqing&gender=male&age=child",
        description: "于红华农场红侨分场33队附近走失，走失当日身着黄色外套。",
        contact: "110"
    },
    {
        id: 16,
        name: "何瑞喜",
        gender: "男",
        birthDate: "2010年",
        age: "12岁",
        missingDate: "2022年10月11日",
        missingLocation: "海南省海口市龙华区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=heruixi&gender=male&age=child",
        description: "身高约165cm，55kg，短发。上身穿黑色的短袖T恤，下身穿迷彩裤。",
        contact: "13637645409"
    },
    {
        id: 17,
        name: "王买荣",
        gender: "男",
        birthDate: "2009年",
        age: "13岁",
        missingDate: "2022年8月17日",
        missingLocation: "云南省大理州大理市",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangmairong&gender=male&age=child",
        description: "身高约130厘米，体型偏瘦。离家时上身着红色长袖T恤，下身着深蓝色校裤，白色拖鞋。",
        contact: "110"
    },
    {
        id: 18,
        name: "李兴缘",
        gender: "女",
        birthDate: "2009年",
        age: "13岁",
        missingDate: "2022年9月1日",
        missingLocation: "云南省昆明市西山区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=lixingyuan&gender=female&age=child",
        description: "身高150CM、中等体型、黑色长发。",
        contact: "110"
    },
    {
        id: 19,
        name: "吴旺",
        gender: "男",
        birthDate: "2009年",
        age: "13岁",
        missingDate: "2022年8月21日",
        missingLocation: "云南省保山市隆阳区",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=wuwang&gender=male&age=child",
        description: "身高约150厘米，体型偏瘦。走失时身穿一套蓝色球服，一双棕色凉鞋。",
        contact: "110"
    },
    {
        id: 20,
        name: "李卓城",
        gender: "男",
        birthDate: "2019年",
        age: "3岁",
        missingDate: "2022年",
        missingLocation: "广西壮族自治区梧州市藤县",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=lizhuocheng&gender=male&age=child",
        description: "大眼睛，左手上戴着一个银手环。",
        contact: "110"
    }
];

// 失踪儿童展示功能
class MissingChildrenSlider {
    constructor(sideId, startIndex) {
        this.sideId = sideId;
        this.currentIndex = startIndex;
        this.data = missingChildrenData;
        this.total = this.data.length;

        this.elements = {
            flipCard: document.getElementById(`${sideId}FlipCard`),
            photo: document.getElementById(`${sideId}ChildPhoto`),
            name: document.getElementById(`${sideId}ChildName`),
            detail: document.getElementById(`${sideId}ChildDetail`),
            indicator: document.getElementById(`${sideId}PageIndicator`)
        };

        this.init();
    }

    init() {
        this.displayChild();
        this.startAutoFlip();
        this.addClickHandler();
    }

    displayChild() {
        const child = this.data[this.currentIndex];

        // 设置图片，添加错误处理
        this.elements.photo.onerror = () => {
            // 如果图片加载失败，使用默认占位图
            this.elements.photo.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='148' height='140' viewBox='0 0 148 140'%3E%3Crect width='148' height='140' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3E${child.name}%3C/text%3E%3C/svg%3E`;
        };
        this.elements.photo.src = child.photo;
        this.elements.photo.alt = `${child.name}的照片`;

        this.elements.name.textContent = `${child.name}，${child.age}`;
        this.elements.detail.innerHTML = `
            ${child.gender} | ${child.missingLocation}<br>
            失踪日期: ${child.missingDate}<br>
            <small>${child.description.substring(0, 35)}...</small>
        `;
        this.elements.indicator.textContent = `${this.currentIndex + 1}/${this.total}`;

        // 更新背面联系方式
        const backSide = this.elements.flipCard.querySelector('.flip-card-back .help-info');
        if (backSide) {
            const hotlineElems = backSide.querySelectorAll('.hotline');
            if (hotlineElems.length >= 2 && child.contact) {
                hotlineElems[0].textContent = `联系电话: ${child.contact}`;
            }
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.total;
        this.animateFlip(() => this.displayChild());
    }

    animateFlip(callback) {
        const card = this.elements.flipCard;
        card.classList.add('page-turning');

        // 在动画中间点更新内容
        setTimeout(() => {
            if (callback) callback();
        }, 300);

        // 动画结束后移除类
        setTimeout(() => {
            card.classList.remove('page-turning');
        }, 600);
    }

    startAutoFlip() {
        // 每5秒自动翻页
        this.interval = setInterval(() => {
            this.next();
        }, 5000);
    }

    addClickHandler() {
        // 点击卡片翻转显示背面信息
        this.elements.flipCard.addEventListener('click', () => {
            this.elements.flipCard.classList.toggle('flipped');
        });
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// 初始化失踪儿童展示
let leftSlider, rightSlider;

function initMissingChildrenSliders() {
    // 左侧从第1个开始
    leftSlider = new MissingChildrenSlider('left', 0);
    // 右侧从第3个开始（错开显示）
    rightSlider = new MissingChildrenSlider('right', 2);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMissingChildrenSliders);
} else {
    initMissingChildrenSliders();
}

// 模拟数据 - 直接嵌入到JavaScript中
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

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 显示消息
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 插入到结果区域顶部
    if (resultSection && resultSection.style.display === 'block') {
        resultContent.insertBefore(messageDiv, resultContent.firstChild);
    } else {
        // 如果结果区域未显示，显示在搜索框下方
        const searchCard = document.querySelector('.search-card');
        if (searchCard) {
            searchCard.appendChild(messageDiv);
        } else if (resultContent) {
            resultContent.insertBefore(messageDiv, resultContent.firstChild);
        }
    }
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 显示茶叶信息
function displayTeaInfo(tea) {
    if (!resultContent) return;
    
    resultContent.innerHTML = `
        <div class="tea-info">
            <h3>${tea.name}</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>追溯码</strong>
                    ${tea.traceCode}
                </div>
                <div class="info-item">
                    <strong>茶叶类型</strong>
                    ${tea.type}
                </div>
                <div class="info-item">
                    <strong>产地</strong>
                    ${tea.origin}
                </div>
                <div class="info-item">
                    <strong>生产商</strong>
                    ${tea.producer}
                </div>
                <div class="info-item">
                    <strong>生产日期</strong>
                    ${formatDate(tea.productionDate)}
                </div>
                <div class="info-item">
                    <strong>采摘日期</strong>
                    ${formatDate(tea.harvestDate)}
                </div>
            </div>
            
            <h4 class="section-title">加工步骤</h4>
            ${tea.processingSteps && tea.processingSteps.length > 0 ? `
                <ul class="steps-list">
                    ${tea.processingSteps.map(step => `
                        <li>
                            <strong>${step.step}</strong>
                            <p>日期: ${formatDate(step.date)}</p>
                            ${step.description ? `<p>${step.description}</p>` : ''}
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>暂无加工步骤信息</p>'}
            
            <h4 class="section-title">质量检测</h4>
            <div class="info-item">
                <strong>检测结果</strong>
                ${tea.qualityTest?.passed ? '通过' : '未通过'}
            </div>
            <div class="info-item">
                <strong>检测日期</strong>
                ${formatDate(tea.qualityTest?.testDate)}
            </div>
            ${tea.qualityTest?.testResults ? `
                <div class="info-item">
                    <strong>检测详情</strong>
                    ${tea.qualityTest.testResults}
                </div>
            ` : ''}
            
            <h4 class="section-title">包装信息</h4>
            <div class="info-grid">
                <div class="info-item">
                    <strong>包装材料</strong>
                    ${tea.packagingInfo?.material}
                </div>
                <div class="info-item">
                    <strong>包装日期</strong>
                    ${formatDate(tea.packagingInfo?.packageDate)}
                </div>
                <div class="info-item">
                    <strong>包装数量</strong>
                    ${tea.packagingInfo?.packageQuantity}
                </div>
            </div>
            
            <h4 class="section-title">物流信息</h4>
            ${tea.distributionInfo && tea.distributionInfo.length > 0 ? `
                <ul class="distribution-list">
                    ${tea.distributionInfo.map(info => `
                        <li>
                            <strong>${info.location}</strong>
                            <p>日期: ${formatDate(info.date)}</p>
                            <p>状态: ${info.status}</p>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>暂无物流信息</p>'}
        </div>
    `;
    
    if (resultSection) {
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 查询茶叶信息
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const traceCodeInput = document.getElementById('traceCode');
        const traceCode = traceCodeInput ? traceCodeInput.value.trim() : '';
        
        if (!traceCode) {
            showMessage('请输入追溯码', 'error');
            return;
        }
        
        try {
            // 从localStorage获取用户添加的数据
            const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
            
            // 合并数据
            const allData = [...mockData, ...userAddedData];
            
            // 查找匹配的追溯码
            const tea = allData.find(item => item.traceCode === traceCode);
            
            if (tea) {
                displayTeaInfo(tea);
            } else {
                showMessage('未找到该茶叶信息', 'error');
                if (resultSection) {
                    resultSection.style.display = 'none';
                }
            }
        } catch (error) {
            showMessage('查询失败，请重试', 'error');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
        }
    });
}

// 重置查询
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (searchForm) {
            searchForm.reset();
        }
        if (resultSection) {
            resultSection.style.display = 'none';
        }
        if (resultContent) {
            resultContent.innerHTML = '';
        }
    });
}
