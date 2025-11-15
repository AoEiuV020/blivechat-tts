const WebSocket = require('ws');

// 读取命令行第一个参数作为 server host，不存在则默认本机
const serverHost = process.argv[2] || 'localhost';

// 读取环境变量
const token = process.env.BLC_TOKEN;
const port = process.env.BLC_PORT || '80';

// 验证必需的环境变量
if (!token) {
  console.error('错误: 环境变量 BLC_TOKEN 未设置');
  process.exit(1);
}

// 构建 WebSocket URL
const wsUrl = `ws://${serverHost}:${port}`;

console.log(`正在连接到 WebSocket 服务器: ${wsUrl}`);
console.log(`使用 Token: ${token.substring(0, 10)}...`);

// 创建 WebSocket 连接，头部带有 Authorization
const ws = new WebSocket(wsUrl, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 连接打开事件
ws.on('open', () => {
  console.log(`[${new Date().toISOString()}] WebSocket 连接已建立`);
});

// 接收消息事件
ws.on('message', (data) => {
  console.log(`[${new Date().toISOString()}] 收到消息:`, data.toString());
});

// 连接关闭事件
ws.on('close', (code, reason) => {
  console.log(`[${new Date().toISOString()}] WebSocket 连接已关闭`);
  console.log(`  关闭代码: ${code}`);
  console.log(`  关闭原因: ${reason || '无'}`);
});

// 错误事件
ws.on('error', (error) => {
  console.error(`[${new Date().toISOString()}] WebSocket 错误:`, error.message);
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n正在关闭连接...');
  ws.close();
  process.exit(0);
});
