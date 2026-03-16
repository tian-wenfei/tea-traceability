const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据库连接
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tea-traceability';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('数据库连接成功');
}).catch(err => {
  console.error('数据库连接失败:', err);
  
  // 如果数据库连接失败，仍继续启动服务器
  // 前端会自动切换到localStorage模式
});

// 导入路由
const teaRoutes = require('./routes/teaRoutes');
app.use('/api/tea', teaRoutes);

// 前端页面路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  const url = process.env.NODE_ENV === 'production' 
    ? `https://your-app-name.railway.app` 
    : `http://localhost:${PORT}`;
  console.log(`服务器运行在 ${url}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
