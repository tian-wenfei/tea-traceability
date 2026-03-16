# 茶叶追溯系统部署指南

## 系统要求

### 服务器端
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本
- MongoDB 4.0 或更高版本

### 客户端
- 支持现代浏览器（Chrome、Firefox、Safari、Edge）

## 部署步骤

### 1. 安装 Node.js 和 npm

#### Windows 系统
1. 访问 [Node.js 官方网站](https://nodejs.org/zh-cn/)
2. 下载并安装 LTS 版本
3. 安装完成后，打开命令提示符，运行以下命令验证安装：
```bash
node -v
npm -v
```

#### Linux 系统
```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install --lts
node -v
npm -v
```

### 2. 安装 MongoDB

#### Windows 系统
1. 访问 [MongoDB 官方网站](https://www.mongodb.com/zh-cn)
2. 下载并安装 Community Server 版本
3. 安装完成后，启动 MongoDB 服务

#### Linux 系统
```bash
# Ubuntu 示例
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. 部署应用程序

1. 克隆或复制应用程序代码到服务器
2. 进入应用程序目录
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动应用程序：
   ```bash
   # 开发环境（使用 nodemon）
   npm run dev
   
   # 生产环境
   npm start
   ```

### 4. 配置环境变量（可选）

可以通过环境变量自定义配置：

```bash
# 设置端口号
export PORT=3000

# 设置 MongoDB 连接字符串
export MONGODB_URI=mongodb://localhost:27017/tea-traceability
```

## 应用访问

- 主页面：http://localhost:3000
- 管理员后台：http://localhost:3000/admin.html

## 管理员账户

- 用户名：fyca
- 密码：fyca2025

## 系统功能

### 主页面功能
- 追溯码查询
- 茶叶信息展示

### 管理员后台功能
- 追溯码管理（添加、删除）
- 数据统计
- 账户管理（管理员专属）
- 密码修改

## 数据存储

### 后端服务可用时
- 数据存储在 MongoDB 数据库中
- API 接口：http://localhost:3000/api/tea

### 后端服务不可用时
- 使用 localStorage 存储用户添加的数据
- 使用 mock-data.json 提供模拟数据

## 故障排除

### 1. MongoDB 连接失败
- 检查 MongoDB 服务是否正在运行
- 检查 MongoDB 连接字符串是否正确
- 检查防火墙设置，确保 MongoDB 端口（默认为 27017）可访问

### 2. 应用程序无法启动
- 检查 Node.js 和 npm 版本是否符合要求
- 检查依赖是否正确安装
- 检查端口是否被占用

### 3. 页面显示异常
- 清除浏览器缓存
- 检查浏览器控制台是否有错误信息
- 确保所有文件都已正确上传到服务器

## 常见问题

### Q: 如何修改管理员账户密码？
A: 登录管理员后台，点击"账户管理"选项卡，然后点击"修改密码"按钮。

### Q: 如何添加新的茶叶类型？
A: 修改 `admin.html` 文件中的 `adminType` 下拉菜单，添加新的选项。

### Q: 如何备份数据？
A: 使用 MongoDB 备份工具 `mongodump` 备份数据库，或导出 `teaData`  localStorage 数据。

## 技术支持

如有任何问题，请联系系统管理员。

---

**版本**：1.0.0
**更新日期**：2026-01-22
