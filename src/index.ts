import WebSocket from 'ws';
import { MessageHandler } from './messageHandler';
import { LoggerConsumer, HeartbeatConsumer, DanmakuConsumer, ConnectionConsumer } from './consumers';
import { loadConfig } from './config';

/**
 * 连接到 WebSocket 服务器
 */
async function connectToServer(): Promise<void> {
  const config = await loadConfig();

  // 读取命令行第一个参数作为 server host，不存在则使用配置或默认本机
  const serverHost = config.host || 'localhost';
  const token = config.token;
  const port = config.port || '12450';

  // 验证必需的配置
  if (!token) {
    console.error('错误: token 未设置');
    process.exit(1);
  }

  // 构建 WebSocket URL
  const wsUrl = `ws://${serverHost}:${port}/api/plugin/websocket`;

  console.log(`正在连接到 WebSocket 服务器: ${wsUrl}`);
  console.log(`使用 Token: ${token.substring(0, 10)}...`);

  // 创建 WebSocket 连接，头部带有 Authorization
  const ws = new WebSocket(wsUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // 创建消息处理器
  const messageHandler = new MessageHandler(ws);
  
  // 注册消费者
  messageHandler.registerConsumer(new LoggerConsumer());
  messageHandler.registerConsumer(new HeartbeatConsumer());
  messageHandler.registerConsumer(new DanmakuConsumer());
  messageHandler.registerConsumer(new ConnectionConsumer());

  // 连接打开事件
  ws.on('open', () => {
    console.log(`[${new Date().toISOString()}] WebSocket 连接已建立`);
  });

  // 接收消息事件
  ws.on('message', (data: WebSocket.Data) => {
    messageHandler.handleMessage(data);
  });

  // 连接关闭事件
  ws.on('close', (code: number, reason: Buffer) => {
    console.log(`[${new Date().toISOString()}] WebSocket 连接已关闭`);
    console.log(`  关闭代码: ${code}`);
    console.log(`  关闭原因: ${reason.toString() || '无'}`);
  });

  // 错误事件
  ws.on('error', (error: Error) => {
    console.error(`[${new Date().toISOString()}] WebSocket 错误:`, error.message);
  });

  // 处理进程退出
  process.on('SIGINT', () => {
    console.log('\n正在关闭连接...');
    ws.close();
    process.exit(0);
  });
}

// 启动应用
connectToServer().catch(err => {
  console.error('启动失败:', err);
  process.exit(1);
});
