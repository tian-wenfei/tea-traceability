# 云平台部署指南

本文档介绍如何将茯忆长安茶叶追溯系统部署到云平台。

---

## 目录

1. [准备工作](#准备工作)
2. [MongoDB Atlas 配置](#mongodb-atlas-配置)
3. [Railway 部署（推荐）](#railway-部署)
4. [Render 部署](#render-部署)
5. [常见问题](#常见问题)

---

## 准备工作

### 1. 注册账号

- [GitHub](https://github.com) - 代码托管
- [MongoDB Atlas](https://www.mongodb.com/atlas) - 云数据库
- [Railway](https://railway.app) 或 [Render](https://render.com) - 云平台

### 2. 上传代码到 GitHub

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 茯忆长安茶叶追溯系统"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/tea-traceability.git

# 推送到 GitHub
git push -u origin main
```

---

## MongoDB Atlas 配置

### 步骤 1：创建集群

1. 登录 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 点击 **Build a Database**
3. 选择 **M0 FREE** 免费套餐
4. 选择离你最近的区域（如 Singapore）
5. 点击 **Create Cluster**

### 步骤 2：创建数据库用户

1. 在左侧菜单选择 **Database Access**
2. 点击 **Add New Database User**
3. 选择 **Password** 认证方式
4. 输入用户名和密码（记住这些信息）
5. 权限选择 **Read and write to any database**
6. 点击 **Add User**

### 步骤 3：配置网络访问

1. 在左侧菜单选择 **Network Access**
2. 点击 **Add IP Address**
3. 点击 **Allow Access from Anywhere**（或输入 `0.0.0.0/0`）
4. 点击 **Confirm**

### 步骤 4：获取连接字符串

1. 回到 **Database** 页面
2. 点击 **Connect**
3. 选择 **Connect your application**
4. 选择 **Node.js** 和最新版本
5. 复制连接字符串，格式如下：

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tea-traceability?retryWrites=true&w=majority
```

**重要**：将 `<username>` 和 `<password>` 替换为你创建的用户名和密码。

---

## Railway 部署

### 步骤 1：登录 Railway

1. 访问 [Railway](https://railway.app)
2. 点击 **Login with GitHub**
3. 授权 Railway 访问你的 GitHub 仓库

### 步骤 2：创建项目

1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 选择你的 `tea-traceability` 仓库
4. Railway 会自动检测 Node.js 项目并开始部署

### 步骤 3：配置环境变量

1. 在项目页面点击 **Variables**
2. 添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `MONGODB_URI` | 你的 MongoDB Atlas 连接字符串 |
| `NODE_ENV` | `production` |

### 步骤 4：生成域名

1. 点击 **Settings**
2. 滚动到 **Domains** 部分
3. 点击 **Generate Domain**
4. 等待几秒钟，你将获得一个类似 `xxx.up.railway.app` 的域名

### 步骤 5：验证部署

访问生成的域名，检查网站是否正常运行。

---

## Render 部署

### 步骤 1：登录 Render

1. 访问 [Render](https://render.com)
2. 点击 **Get Started for Free**
3. 选择 **Sign up with GitHub**

### 步骤 2：创建 Web Service

1. 点击 **New +**
2. 选择 **Web Service**
3. 连接你的 GitHub 仓库
4. 选择 `tea-traceability` 仓库

### 步骤 3：配置服务

| 配置项 | 值 |
|--------|-----|
| Name | `tea-traceability` |
| Region | 选择离你最近的区域 |
| Branch | `main` |
| Root Directory | `.` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |

### 步骤 4：添加环境变量

在 **Environment Variables** 部分添加：

| Key | Value |
|-----|-------|
| `MONGODB_URI` | 你的 MongoDB Atlas 连接字符串 |
| `NODE_ENV` | `production` |

### 步骤 5：部署

1. 点击 **Create Web Service**
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，你将获得一个 `https://tea-traceability.onrender.com` 类似的域名

---

## 常见问题

### Q1: 部署后页面无法访问？

**解决方案**：
1. 检查构建日志是否有错误
2. 确认环境变量 `MONGODB_URI` 已正确设置
3. 检查 MongoDB Atlas 的网络访问是否允许所有 IP

### Q2: 数据库连接失败？

**解决方案**：
1. 确认 MongoDB Atlas 集群状态为运行中
2. 检查用户名密码是否正确
3. 确认 IP 白名单已添加 `0.0.0.0/0`

### Q3: 页面加载很慢？

**解决方案**：
1. Render 免费版在 15 分钟无访问后会休眠
2. 首次访问可能需要等待 30-60 秒唤醒
3. 升级到付费版可获得更好的性能

### Q4: 如何绑定自定义域名？

**Railway**：
1. Settings → Domains → Add Custom Domain
2. 按提示配置 DNS 记录

**Render**：
1. Settings → Custom Domains → Add Custom Domain
2. 按提示配置 DNS 记录

### Q5: 如何查看日志？

**Railway**：项目页面 → Deployments → 点击部署 → View Logs

**Render**：项目页面 → Logs 标签

---

## 部署清单

- [ ] GitHub 账号已注册
- [ ] 代码已上传到 GitHub
- [ ] MongoDB Atlas 集群已创建
- [ ] 数据库用户已创建
- [ ] 网络访问已配置
- [ ] 连接字符串已获取
- [ ] Railway/Render 账号已注册
- [ ] 项目已创建并部署
- [ ] 环境变量已配置
- [ ] 域名已生成
- [ ] 网站可正常访问

---

## 技术支持

如有问题，请检查：
1. 平台部署日志
2. MongoDB Atlas 日志
3. 浏览器控制台错误

---

**版本**：1.0.0  
**更新日期**：2026-03-16
