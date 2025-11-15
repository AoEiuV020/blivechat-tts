import WebSocket from 'ws';
import { MessageHandler } from './messageHandler';
import { LoggerConsumer, HeartbeatConsumer, DanmakuConsumer, ConnectionConsumer } from './consumers';
import { Config } from './config';

/**
 * 创建 WebSocket 连接并处理消息
 */
export function createConnection(config: Config): Promise<void> {
  return new Promise((resolve) => {
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
      resolve();
    });

    // 错误事件
    ws.on('error', (error: Error) => {
      console.error(`[${new Date().toISOString()}] WebSocket 错误:`, error.message);
      // 错误后关闭连接，触发 close 事件
      ws.close();
    });

    // 处理进程退出
    const exitHandler = () => {
      console.log('\n正在关闭连接...');
      ws.close();
      process.exit(0);
    };

    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler);
  });
}
