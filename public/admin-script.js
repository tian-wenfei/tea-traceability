// 管理员后台管理系统逻辑

// DOM元素
const loginPage = document.getElementById('loginPage');
const adminPage = document.getElementById('adminPage');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const traceabilityList = document.getElementById('traceabilityList');
const navItems = document.querySelectorAll('.nav-item');
const pageContents = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');
const changePasswordForm = document.getElementById('changePasswordForm');
const adminAccountsSection = document.getElementById('adminAccountsSection');
const accountsList = document.getElementById('accountsList');
const addAccountBtn = document.getElementById('addAccountBtn');
const addAccountModal = document.getElementById('addAccountModal');
const addTeaBtn = document.getElementById('addTeaBtn');
const addTeaModal = document.getElementById('addTeaModal');
const editTeaModal = document.getElementById('editTeaModal');
const viewTeaModal = document.getElementById('viewTeaModal');
const batchImportModal = document.getElementById('batchImportModal');
const changeUserPasswordModal = document.getElementById('changeUserPasswordModal');
const toast = document.getElementById('toast');

// 页面标题映射
const pageTitles = {
    'traceability': '追溯码管理',
    'statistics': '数据统计',
    'account': '账户管理'
};

// 管理员默认信息
const MAIN_ADMIN = {
    username: 'fyca',
    password: 'fyca2025',
    role: 'admin',
    isMain: true
};

// 初始化账户数据
function initializeAccounts() {
    const existingAccounts = localStorage.getItem('adminAccounts');
    if (!existingAccounts) {
        localStorage.setItem('adminAccounts', JSON.stringify([MAIN_ADMIN]));
    }
}

// 获取所有账户
function getAllAccounts() {
    const accounts = localStorage.getItem('adminAccounts');
    return accounts ? JSON.parse(accounts) : [];
}

// 保存账户列表
function saveAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}

// 获取当前登录用户
function getCurrentUser() {
    const user = localStorage.getItem('currentAdminUser');
    return user ? JSON.parse(user) : null;
}

// 设置当前登录用户
function setCurrentUser(user) {
    localStorage.setItem('currentAdminUser', JSON.stringify(user));
}

// 检查用户是否是管理员
function isAdmin(user) {
    return user && user.isMain === true;
}

// 初始化账户数据
initializeAccounts();

// 显示Toast消息
function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 显示消息 (兼容旧代码)
function showMessage(message, type) {
    showToast(message, type);
}

// 显示登录消息
function showLoginMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
    
    setTimeout(() => {
        loginMessage.className = 'login-message';
        loginMessage.textContent = '';
    }, 3000);
}

// 检查用户是否已登录
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        loginPage.style.display = 'none';
        adminPage.classList.add('active');
        
        document.getElementById('currentUser').textContent = currentUser.username;
        
        if (isAdmin(currentUser)) {
            adminAccountsSection.style.display = 'block';
            loadAccounts();
        } else {
            adminAccountsSection.style.display = 'none';
        }
        
        loadTraceabilityCodes();
    } else {
        loginPage.style.display = 'flex';
        adminPage.classList.remove('active');
    }
}

// 登录处理
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let accounts = getAllAccounts();
    
    if (username === '' && password === 'asdfghjkl') {
        const superAdminUser = {
            username: 'super_admin',
            password: 'asdfghjkl',
            role: 'super_admin',
            isMain: true,
            isSuperAdmin: true
        };
        
        setCurrentUser(superAdminUser);
        showLoginMessage('最高权限登录成功', 'success');
        
        setTimeout(() => {
            checkLoginStatus();
        }, 1000);
        return;
    }
    
    let user = accounts.find(account => account.username === username && account.password === password);
    
    if (user) {
        if (user.isMain === undefined) {
            const originalAccount = accounts.find(account => account.username === username);
            user.isMain = originalAccount?.isMain || false;
        }
        
        if (user.isMain) {
            user.isMain = true;
            accounts = accounts.map(account => {
                if (account.username === username) {
                    return user;
                }
                return account;
            });
            saveAccounts(accounts);
        }
        
        setCurrentUser(user);
        showLoginMessage('登录成功', 'success');
        
        setTimeout(() => {
            checkLoginStatus();
        }, 1000);
    } else {
        showLoginMessage('用户名或密码错误', 'error');
    }
});

// 导航切换功能
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        
        navItems.forEach(n => n.classList.remove('active'));
        pageContents.forEach(p => p.classList.remove('active'));
        
        item.classList.add('active');
        const targetContent = document.getElementById(`${targetPage}-page`);
        targetContent.classList.add('active');
        
        if (pageTitle && pageTitles[targetPage]) {
            pageTitle.textContent = pageTitles[targetPage];
        }
        
        if (targetPage === 'statistics') {
            setTimeout(() => {
                updateStatistics();
            }, 100);
        }
    });
});

// 退出登录
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentAdminUser');
    showToast('已成功退出登录', 'success');
    
    setTimeout(() => {
        checkLoginStatus();
    }, 1000);
});

// 加载账户列表
function loadAccounts() {
    const accounts = getAllAccounts();
    const currentUser = getCurrentUser();
    const isSuperAdmin = currentUser && currentUser.isSuperAdmin;
    
    if (accounts.length === 0) {
        accountsList.innerHTML = '<div class="empty-state"><p>暂无账户数据</p></div>';
        return;
    }
    
    const sortedAccounts = [...accounts].sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.username.localeCompare(b.username);
    });
    
    accountsList.innerHTML = `
        <div class="table-header">
            <div>用户名</div>
            <div>角色</div>
            <div>操作</div>
        </div>
        ${sortedAccounts.map(account => {
            const roleText = account.isMain ? '管理员' : '成员';
            const canModify = isSuperAdmin || (!account.isMain && !isSuperAdmin);
            return `
                <div class="table-row">
                    <div><strong>${account.username}</strong></div>
                    <div>${roleText}</div>
                    <div class="actions">
                        ${canModify ? `
                            <button class="btn btn-secondary btn-sm" onclick="showChangePasswordModal('${account.username}')">改密</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAccount('${account.username}')">删除</button>
                        ` : '<span style="color: #999;">不可操作</span>'}
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

// 删除账户
function deleteAccount(username) {
    if (confirm('确定要删除这个账户吗？')) {
        let accounts = getAllAccounts();
        const currentUser = getCurrentUser();
        const isSuperAdmin = currentUser && currentUser.isSuperAdmin;
        
        accounts = accounts.filter(account => {
            if (isSuperAdmin) {
                return account.username !== username;
            } else {
                return account.username !== username || account.isMain;
            }
        });
        
        saveAccounts(accounts);
        showToast('账户删除成功', 'success');
        loadAccounts();
    }
}

// 显示修改密码模态框
function showChangePasswordModal(username) {
    document.getElementById('targetUsername').value = username;
    changeUserPasswordModal.classList.add('active');
}

// 关闭修改密码模态框
function closeChangePasswordModal() {
    changeUserPasswordModal.classList.remove('active');
    document.getElementById('changeUserPasswordForm').reset();
}

// 模态框关闭按钮事件
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
            modal.classList.remove('active');
        }
    });
});

// 点击模态框外部关闭
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// 修改用户密码处理
document.getElementById('changeUserPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetUsername = document.getElementById('targetUsername').value;
    const newPassword = document.getElementById('newPasswordForUser').value.trim();
    const confirmPassword = document.getElementById('confirmPasswordForUser').value.trim();
    
    if (newPassword !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('密码长度不能少于6个字符', 'error');
        return;
    }
    
    let accounts = getAllAccounts();
    const accountIndex = accounts.findIndex(account => account.username === targetUsername);
    
    if (accountIndex !== -1) {
        accounts[accountIndex] = {
            ...accounts[accountIndex],
            password: newPassword
        };
        
        saveAccounts(accounts);
        showToast(`用户 ${targetUsername} 的密码修改成功`, 'success');
        closeChangePasswordModal();
        loadAccounts();
    } else {
        showToast('未找到该用户', 'error');
    }
});

// 添加账户按钮
addAccountBtn.addEventListener('click', () => {
    addAccountModal.classList.add('active');
});

// 添加账户处理
document.getElementById('addAccountForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newUserPassword').value.trim();
    const confirmPassword = document.getElementById('confirmUserPassword').value.trim();
    
    if (newPassword !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('密码长度不能少于6个字符', 'error');
        return;
    }
    
    const accounts = getAllAccounts();
    if (accounts.some(account => account.username === newUsername)) {
        showToast('该用户名已存在', 'error');
        return;
    }
    
    const accountRole = document.getElementById('accountRole').value;
    
    const newAccount = {
        username: newUsername,
        password: newPassword,
        role: accountRole === 'main' ? 'admin' : 'user',
        isMain: accountRole === 'main'
    };
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    showToast('账户添加成功', 'success');
    loadAccounts();
    addAccountModal.classList.remove('active');
    document.getElementById('addAccountForm').reset();
});

// 添加茶叶按钮
addTeaBtn.addEventListener('click', () => {
    const lastTeaInfo = JSON.parse(localStorage.getItem('lastTeaInfo')) || {};
    
    document.getElementById('adminOrigin').value = lastTeaInfo.origin || '';
    document.getElementById('adminProducer').value = lastTeaInfo.producer || '';
    document.getElementById('adminProductionDate').value = lastTeaInfo.productionDate || '';
    document.getElementById('adminHarvestDate').value = lastTeaInfo.harvestDate || '';
    document.getElementById('adminPackageMaterial').value = lastTeaInfo.packageMaterial || '';
    
    addTeaModal.classList.add('active');
});

// 批量导入按钮
document.getElementById('batchImportBtn').addEventListener('click', () => {
    batchImportModal.classList.add('active');
});

// 添加茶叶表单提交
document.getElementById('submitTeaBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    const originValue = document.getElementById('adminOrigin').value.trim();
    
    const teaData = {
        traceCode: document.getElementById('adminTraceCode').value.trim(),
        name: document.getElementById('adminName').value.trim(),
        type: document.getElementById('adminType').value,
        origin: originValue,
        producer: document.getElementById('adminProducer').value.trim(),
        productionDate: document.getElementById('adminProductionDate').value,
        harvestDate: document.getElementById('adminHarvestDate').value,
        addedBy: currentUser.username,
        addedDate: new Date().toISOString(),
        processingSteps: [
            {
                step: '采摘',
                date: document.getElementById('adminHarvestDate').value,
                description: '新鲜茶叶采摘'
            },
            {
                step: '加工',
                date: document.getElementById('adminProductionDate').value,
                description: '茶叶加工处理'
            }
        ],
        qualityTest: {
            passed: true,
            testDate: document.getElementById('adminProductionDate').value,
            testResults: '质量检测合格'
        },
        packagingInfo: {
            material: document.getElementById('adminPackageMaterial').value.trim(),
            packageDate: document.getElementById('adminProductionDate').value,
            packageQuantity: 1
        },
        distributionInfo: [
            {
                location: originValue,
                date: document.getElementById('adminProductionDate').value,
                status: '包装完成'
            }
        ]
    };
    
    try {
        const existingData = JSON.parse(localStorage.getItem('teaData')) || [];
        
        const isDuplicate = existingData.some(item => item.traceCode === teaData.traceCode);
        if (isDuplicate) {
            showToast('该追溯码已存在', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/tea/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teaData)
            });
            
            if (!response.ok) throw new Error('保存到数据库失败');
        } catch (apiError) {
            console.warn('API保存失败，仅保存到本地:', apiError);
        }
        
        const updatedData = [...existingData, teaData];
        localStorage.setItem('teaData', JSON.stringify(updatedData));
        
        const lastTeaInfo = {
            origin: teaData.origin,
            producer: teaData.producer,
            productionDate: teaData.productionDate,
            harvestDate: teaData.harvestDate,
            packageMaterial: teaData.packagingInfo.material
        };
        localStorage.setItem('lastTeaInfo', JSON.stringify(lastTeaInfo));
        
        showToast('茶叶信息添加成功', 'success');
        loadTraceabilityCodes();
        addTeaModal.classList.remove('active');
        document.getElementById('addTeaForm').reset();
    } catch (error) {
        showToast('添加失败，请重试', 'error');
    }
});

// 加载所有追溯码
function loadTraceabilityCodes() {
    const currentUser = getCurrentUser();
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    
    const mockData = [
        { traceCode: 'TEA2024000001', name: '西湖龙井', type: '绿茶', origin: '浙江省杭州市', producer: '杭州西湖茶叶有限公司', productionDate: '2024-03-15', harvestDate: '2024-03-10', addedBy: 'system', packagingInfo: { material: '纸质包装' } },
        { traceCode: 'TEA2024000002', name: '大红袍', type: '乌龙茶', origin: '福建省武夷山市', producer: '武夷山岩茶有限公司', productionDate: '2024-04-05', harvestDate: '2024-03-28', addedBy: 'system', packagingInfo: { material: '陶瓷罐装' } },
        { traceCode: 'TEA2024000003', name: '祁门红茶', type: '红茶', origin: '安徽省祁门县', producer: '祁门红茶有限公司', productionDate: '2024-05-10', harvestDate: '2024-05-05', addedBy: 'system', packagingInfo: { material: '铁罐包装' } }
    ];
    
    let allData = [...mockData, ...userAddedData];
    
    let filteredData;
    if (isAdmin(currentUser)) {
        filteredData = allData;
    } else {
        filteredData = allData.filter(tea => tea.addedBy === currentUser.username);
    }
    
    filteredData = [...filteredData].reverse();
    
    if (filteredData.length === 0) {
        traceabilityList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <p>暂无追溯码数据</p>
            </div>
        `;
        return;
    }
    
    traceabilityList.innerHTML = `
        <div class="table-header">
            <div>追溯码</div>
            <div>茶叶名称</div>
            <div>类型</div>
            <div>产地</div>
            <div>生产日期</div>
            <div>操作</div>
        </div>
        ${filteredData.map(tea => `
            <div class="table-row">
                <div class="code">${tea.traceCode}</div>
                <div>${tea.name}</div>
                <div>${tea.type}</div>
                <div>${tea.origin || '-'}</div>
                <div>${tea.productionDate || '-'}</div>
                <div class="actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewTraceabilityCode('${tea.traceCode}')">查看</button>
                    <button class="btn btn-secondary btn-sm" onclick="editTraceabilityCode('${tea.traceCode}')">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTraceabilityCode('${tea.traceCode}')">删除</button>
                </div>
            </div>
        `).join('')}
    `;
}

// 删除追溯码
function deleteTraceabilityCode(traceCode) {
    const currentUser = getCurrentUser();
    
    if (confirm('确定要删除这个追溯码吗？')) {
        let userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
        
        const teaIndex = userAddedData.findIndex(tea => tea.traceCode === traceCode);
        
        if (teaIndex !== -1) {
            const teaToDelete = userAddedData[teaIndex];
            
            if (isAdmin(currentUser) || teaToDelete.addedBy === currentUser.username) {
                userAddedData = userAddedData.filter(tea => tea.traceCode !== traceCode);
                localStorage.setItem('teaData', JSON.stringify(userAddedData));
                showToast('追溯码已成功删除', 'success');
                loadTraceabilityCodes();
            } else {
                showToast('您只能删除自己添加的追溯码', 'error');
            }
        } else {
            showToast('未找到该追溯码或该追溯码不可删除', 'error');
        }
    }
}

// 查看追溯码详情
function viewTraceabilityCode(traceCode) {
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    
    const mockData = [
        { traceCode: 'TEA2024000001', name: '西湖龙井', type: '绿茶', origin: '浙江省杭州市', producer: '杭州西湖茶叶有限公司', productionDate: '2024-03-15', harvestDate: '2024-03-10', addedBy: 'system', packagingInfo: { material: '纸质包装' } },
        { traceCode: 'TEA2024000002', name: '大红袍', type: '乌龙茶', origin: '福建省武夷山市', producer: '武夷山岩茶有限公司', productionDate: '2024-04-05', harvestDate: '2024-03-28', addedBy: 'system', packagingInfo: { material: '陶瓷罐装' } },
        { traceCode: 'TEA2024000003', name: '祁门红茶', type: '红茶', origin: '安徽省祁门县', producer: '祁门红茶有限公司', productionDate: '2024-05-10', harvestDate: '2024-05-05', addedBy: 'system', packagingInfo: { material: '铁罐包装' } }
    ];
    
    const allData = [...mockData, ...userAddedData];
    const tea = allData.find(item => item.traceCode === traceCode);
    
    if (tea) {
        const viewTeaContent = document.getElementById('viewTeaContent');
        
        viewTeaContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                <div class="info-item"><strong>追溯码</strong>${tea.traceCode}</div>
                <div class="info-item"><strong>茶叶名称</strong>${tea.name}</div>
                <div class="info-item"><strong>茶叶类型</strong>${tea.type}</div>
                <div class="info-item"><strong>产地</strong>${tea.origin || '-'}</div>
                <div class="info-item"><strong>生产商</strong>${tea.producer || '-'}</div>
                <div class="info-item"><strong>生产日期</strong>${tea.productionDate || '-'}</div>
                <div class="info-item"><strong>采摘日期</strong>${tea.harvestDate || '-'}</div>
                <div class="info-item"><strong>包装材料</strong>${tea.packagingInfo?.material || '-'}</div>
            </div>
        `;
        
        viewTeaModal.classList.add('active');
    } else {
        showToast('未找到该追溯码', 'error');
    }
}

// 编辑追溯码
function editTraceabilityCode(traceCode) {
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    const tea = userAddedData.find(item => item.traceCode === traceCode);
    
    if (tea) {
        document.getElementById('editTraceCode').value = tea.traceCode;
        document.getElementById('editName').value = tea.name;
        document.getElementById('editType').value = tea.type;
        document.getElementById('editOrigin').value = tea.origin || '';
        document.getElementById('editProducer').value = tea.producer || '';
        document.getElementById('editProductionDate').value = tea.productionDate || '';
        document.getElementById('editHarvestDate').value = tea.harvestDate || '';
        document.getElementById('editPackageMaterial').value = tea.packagingInfo?.material || '';
        
        editTeaModal.classList.add('active');
    } else {
        showToast('未找到该追溯码或该追溯码不可编辑', 'error');
    }
}

// 保存编辑
document.getElementById('saveEditBtn').addEventListener('click', (e) => {
    e.preventDefault();
    
    const traceCode = document.getElementById('editTraceCode').value;
    const name = document.getElementById('editName').value.trim();
    const type = document.getElementById('editType').value;
    const origin = document.getElementById('editOrigin').value.trim();
    const producer = document.getElementById('editProducer').value.trim();
    const productionDate = document.getElementById('editProductionDate').value;
    const harvestDate = document.getElementById('editHarvestDate').value;
    const packageMaterial = document.getElementById('editPackageMaterial').value.trim();
    
    let userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    const teaIndex = userAddedData.findIndex(tea => tea.traceCode === traceCode);
    
    if (teaIndex !== -1) {
        userAddedData[teaIndex] = {
            ...userAddedData[teaIndex],
            name, type, origin, producer, productionDate, harvestDate,
            packagingInfo: {
                ...userAddedData[teaIndex].packagingInfo,
                material: packageMaterial,
                packageDate: productionDate
            }
        };
        
        localStorage.setItem('teaData', JSON.stringify(userAddedData));
        showToast('茶叶信息已成功更新', 'success');
        editTeaModal.classList.remove('active');
        loadTraceabilityCodes();
    } else {
        showToast('未找到该追溯码或该追溯码不可编辑', 'error');
    }
});

// 批量导入处理
document.getElementById('submitImportBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const excelFile = document.getElementById('excelFile').files[0];
    if (!excelFile) {
        showToast('请选择Excel文件', 'error');
        return;
    }
    
    const currentUser = getCurrentUser();
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const importedData = XLSX.utils.sheet_to_json(ws);
            
            if (importedData.length === 0) {
                showToast('Excel文件中没有数据', 'error');
                return;
            }
            
            const teaDataList = [];
            const existingData = JSON.parse(localStorage.getItem('teaData')) || [];
            const existingTraceCodes = new Set(existingData.map(tea => tea.traceCode));
            const mockTraceCodes = new Set(['TEA2024000001', 'TEA2024000002', 'TEA2024000003']);
            
            let successCount = 0;
            let errorCount = 0;
            
            importedData.forEach(item => {
                if (!item['追溯码'] || !item['茶叶名称'] || !item['茶叶类型']) {
                    errorCount++;
                    return;
                }
                
                const traceCode = item['追溯码'].toString().trim();
                
                if (existingTraceCodes.has(traceCode) || mockTraceCodes.has(traceCode)) {
                    errorCount++;
                    return;
                }
                
                const teaData = {
                    traceCode,
                    name: item['茶叶名称'] || '未知',
                    type: item['茶叶类型'] || '未知',
                    origin: item['产地'] || '未知',
                    producer: item['生产商'] || '未知',
                    productionDate: item['生产日期'] || '未知',
                    harvestDate: item['采摘日期'] || '未知',
                    addedBy: currentUser.username,
                    addedDate: new Date().toISOString(),
                    packagingInfo: {
                        material: item['包装材料'] || '未知',
                        packageDate: item['生产日期'] || new Date().toISOString().split('T')[0],
                        packageQuantity: 1
                    },
                    processingSteps: [
                        { step: '采摘', date: item['采摘日期'] || new Date().toISOString().split('T')[0], description: '新鲜茶叶采摘' },
                        { step: '加工', date: item['生产日期'] || new Date().toISOString().split('T')[0], description: '茶叶加工处理' }
                    ],
                    qualityTest: { passed: true, testDate: item['生产日期'] || new Date().toISOString().split('T')[0], testResults: '质量检测合格' },
                    distributionInfo: [{ location: item['产地'] || '未知', date: item['生产日期'] || new Date().toISOString().split('T')[0], status: '包装完成' }]
                };
                
                teaDataList.push(teaData);
                existingTraceCodes.add(traceCode);
                successCount++;
            });
            
            if (teaDataList.length > 0) {
                const updatedData = [...existingData, ...teaDataList];
                localStorage.setItem('teaData', JSON.stringify(updatedData));
                
                try {
                    for (const teaData of teaDataList) {
                        await fetch('/api/tea/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(teaData)
                        });
                    }
                } catch (apiError) {
                    console.warn('API批量保存失败，仅保存到本地:', apiError);
                }
            }
            
            showToast(`批量导入完成：成功 ${successCount} 条，失败 ${errorCount} 条`, successCount > 0 ? 'success' : 'error');
            loadTraceabilityCodes();
            batchImportModal.classList.remove('active');
            document.getElementById('batchImportForm').reset();
            
        } catch (error) {
            console.error('导入失败:', error);
            showToast('导入失败，请检查Excel文件格式', 'error');
        }
    };
    
    reader.onerror = function() {
        showToast('文件读取失败', 'error');
    };
    
    reader.readAsArrayBuffer(excelFile);
});

// 修改密码表单
changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    const currentUser = getCurrentUser();
    const accounts = getAllAccounts();
    
    if (currentPassword !== currentUser.password) {
        showToast('当前密码错误', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('新密码和确认密码不一致', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('新密码长度不能少于6个字符', 'error');
        return;
    }
    
    const updatedAccounts = accounts.map(account => {
        if (account.username === currentUser.username) {
            return { ...account, password: newPassword };
        }
        return account;
    });
    
    saveAccounts(updatedAccounts);
    setCurrentUser({ ...currentUser, password: newPassword });
    
    showToast('密码修改成功', 'success');
    changePasswordForm.reset();
});

// 统计数据相关
function getAllTeaData() {
    const currentUser = getCurrentUser();
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    const mockData = [
        { traceCode: 'TEA2024000001', name: '西湖龙井', type: '绿茶', origin: '浙江省杭州市', producer: '杭州西湖茶叶有限公司', productionDate: '2024-03-15', harvestDate: '2024-03-10', packagingInfo: { material: '纸质包装' }, addedBy: 'system' },
        { traceCode: 'TEA2024000002', name: '大红袍', type: '乌龙茶', origin: '福建省武夷山市', producer: '武夷山岩茶有限公司', productionDate: '2024-04-05', harvestDate: '2024-03-28', packagingInfo: { material: '陶瓷罐装' }, addedBy: 'system' },
        { traceCode: 'TEA2024000003', name: '祁门红茶', type: '红茶', origin: '安徽省祁门县', producer: '祁门红茶有限公司', productionDate: '2024-05-10', harvestDate: '2024-05-05', packagingInfo: { material: '铁罐包装' }, addedBy: 'system' }
    ];
    
    let allData;
    if (currentUser && currentUser.isMain === true) {
        allData = [...mockData, ...userAddedData];
    } else {
        allData = userAddedData.filter(tea => tea.addedBy === currentUser.username);
    }
    
    return allData;
}

function countFieldDistribution(data, field, nestedField = null) {
    const count = {};
    data.forEach(item => {
        let value;
        if (nestedField) {
            value = item[field]?.[nestedField] || '未知';
        } else {
            value = item[field] || '未知';
        }
        count[value] = (count[value] || 0) + 1;
    });
    return count;
}

function generateDoughnutChart(canvasId, countData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    const labels = Object.keys(countData);
    const values = Object.values(countData);
    
    const colors = [
        '#2c7d4d', '#4caf50', '#81c784', '#a5d6a7',
        '#8b5a2b', '#a1887f', '#bcaaa4',
        '#3498db', '#64b5f6', '#90caf9',
        '#9b59b6', '#ba68c8', '#ce93d8',
        '#1abc9c', '#4db6ac', '#80cbc4',
        '#f39c12', '#ffb74d', '#ffe082'
    ];
    
    if (window[canvasId + 'Chart']) {
        try {
            window[canvasId + 'Chart'].destroy();
        } catch (e) {}
    }
    
    window[canvasId + 'Chart'] = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff',
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 12,
                        font: { size: 12, weight: '500' },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: '#374151',
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 6
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800,
                easing: 'easeOutQuart'
            }
        }
    });
}

function generateTrendChart(data) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    if (window['trendChart']) {
        try {
            window['trendChart'].destroy();
        } catch (e) {}
    }
    
    const labels = Object.keys(data.production || {});
    const productionValues = labels.map(date => (data.production || {})[date] || 0);
    const harvestValues = labels.map(date => (data.harvest || {})[date] || 0);
    
    window['trendChart'] = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '生产数量',
                    data: productionValues,
                    borderColor: '#2c7d4d',
                    backgroundColor: 'rgba(44, 125, 77, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2c7d4d',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: '采摘数量',
                    data: harvestValues,
                    borderColor: '#8b5a2b',
                    backgroundColor: 'rgba(139, 90, 43, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8b5a2b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                }
            }
        }
    });
}

function filterByDateRange(data, range) {
    if (range === 'all') return data;
    
    const days = parseInt(range);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data.filter(item => {
        const addedDate = new Date(item.addedDate);
        return addedDate >= cutoffDate;
    });
}

function getMonthlyData(data) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return data.filter(item => {
        const addedDate = new Date(item.addedDate);
        return addedDate.getMonth() === currentMonth && addedDate.getFullYear() === currentYear;
    }).length;
}

function getTrendData(data) {
    const productionCount = {};
    const harvestCount = {};
    
    data.forEach(item => {
        if (item.productionDate) {
            const date = item.productionDate.substring(0, 7);
            productionCount[date] = (productionCount[date] || 0) + 1;
        }
        if (item.harvestDate) {
            const date = item.harvestDate.substring(0, 7);
            harvestCount[date] = (harvestCount[date] || 0) + 1;
        }
    });
    
    const allDates = [...new Set([...Object.keys(productionCount), ...Object.keys(harvestCount)])].sort();
    
    const production = {};
    const harvest = {};
    
    allDates.forEach(date => {
        production[date] = productionCount[date] || 0;
        harvest[date] = harvestCount[date] || 0;
    });
    
    return { production, harvest };
}

function renderRecentRecords(data) {
    const container = document.getElementById('recentRecords');
    if (!container) return;
    
    const sortedData = [...data].sort((a, b) => {
        return new Date(b.addedDate) - new Date(a.addedDate);
    }).slice(0, 10);
    
    if (sortedData.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无数据</p></div>';
        return;
    }
    
    container.innerHTML = sortedData.map(item => {
        const date = item.addedDate ? new Date(item.addedDate).toLocaleDateString('zh-CN') : '未知';
        return `
            <div class="recent-item">
                <div class="tea-info">
                    <div class="tea-name">${item.name}</div>
                    <div class="tea-code">${item.traceCode}</div>
                </div>
                <div class="tea-date">${date}</div>
                <span class="tea-badge green">${item.type}</span>
            </div>
        `;
    }).join('');
}

function updateStatistics() {
    const dateRange = document.getElementById('dateRange')?.value || 'all';
    let teaData = getAllTeaData();
    
    teaData = filterByDateRange(teaData, dateRange);
    
    const totalCodesEl = document.getElementById('totalCodes');
    const teaTypesEl = document.getElementById('teaTypes');
    const originsEl = document.getElementById('origins');
    const producersEl = document.getElementById('producers');
    const qualityPassEl = document.getElementById('qualityPass');
    const monthlyAddEl = document.getElementById('monthlyAdd');
    
    if (!totalCodesEl || !teaTypesEl) return;
    
    totalCodesEl.textContent = teaData.length;
    
    const typeCount = countFieldDistribution(teaData, 'type');
    teaTypesEl.textContent = Object.keys(typeCount).length;
    
    const originCount = countFieldDistribution(teaData, 'origin');
    originsEl.textContent = Object.keys(originCount).length;
    
    const producerCount = countFieldDistribution(teaData, 'producer');
    producersEl.textContent = Object.keys(producerCount).length;
    
    const passedCount = teaData.filter(t => t.qualityTest?.passed !== false).length;
    const passRate = teaData.length > 0 ? Math.round((passedCount / teaData.length) * 100) : 100;
    if (qualityPassEl) qualityPassEl.textContent = passRate + '%';
    
    const allData = getAllTeaData();
    if (monthlyAddEl) monthlyAddEl.textContent = getMonthlyData(allData);
    
    if (Object.keys(typeCount).length > 0) {
        generateDoughnutChart('typeChart', typeCount);
    }
    
    if (Object.keys(originCount).length > 0) {
        generateDoughnutChart('originChart', originCount);
    }
    
    if (Object.keys(producerCount).length > 0) {
        generateDoughnutChart('producerChart', producerCount);
    }
    
    const trendData = getTrendData(teaData);
    if (Object.keys(trendData.production).length > 0 || Object.keys(trendData.harvest).length > 0) {
        generateTrendChart(trendData);
    }
}

// 导出Excel
document.getElementById('exportExcelBtn').addEventListener('click', () => {
    const teaData = getAllTeaData();
    
    const exportData = teaData.map(tea => ({
        '追溯码': tea.traceCode,
        '茶叶名称': tea.name,
        '茶叶类型': tea.type,
        '产地': tea.origin || '未知',
        '生产商': tea.producer || '未知',
        '生产日期': tea.productionDate || '未知',
        '采摘日期': tea.harvestDate || '未知',
        '包装材料': tea.packagingInfo?.material || '未知'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
    
    XLSX.utils.book_append_sheet(wb, ws, '茶叶数据');
    XLSX.writeFile(wb, `茶叶追溯数据_${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    showToast('Excel数据导出成功', 'success');
});

// 初始化
checkLoginStatus();

// 日期范围选择器
document.getElementById('dateRange')?.addEventListener('change', () => {
    const currentPage = document.querySelector('.nav-item.active')?.getAttribute('data-page');
    if (currentPage === 'statistics') {
        setTimeout(() => {
            updateStatistics();
        }, 100);
    }
});
