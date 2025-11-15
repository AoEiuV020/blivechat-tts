import { loadConfig } from './config';
import { createConnection } from './connection';

/**
 * 主启动函数 - 循环连接，断线后自动重连
 */
async function main(): Promise<void> {
  console.log('blivechat-tts 启动中...');
  
  while (true) {
    try {
      // 加载配置
      const config = await loadConfig();
      
      // 创建连接并等待连接关闭
      await createConnection(config);
      
      // 连接关闭后等待一小段时间再重连
      console.log('等待 3 秒后重新连接...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error('连接异常:', error);
      console.log('等待 5 秒后重试...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// 启动应用
main().catch(err => {
  console.error('程序启动失败:', err);
  process.exit(1);
});
