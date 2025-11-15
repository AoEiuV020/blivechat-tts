import { MessageConsumer, WSMessage } from '../types';
import { speak } from '../tts';

/**
 * 连接状态数据结构
 */
interface ConnectionData {
  isSuccess: boolean;
}

/**
 * 连接状态消费者
 * 负责处理连接状态消息 (cmd==3) 并播报连接成功或失败
 */
export class ConnectionConsumer implements MessageConsumer {
  name = 'ConnectionConsumer';

  async handle(message: WSMessage): Promise<void> {
    if (message.cmd === 3) {
      try {
        const data = message.data as ConnectionData;
        
        const timestamp = new Date().toISOString();
        const statusText = data.isSuccess ? '成功' : '失败';
        console.log(`[${timestamp}] [Connection] 连接${statusText}`);

        // 语音播报连接状态
        await speak(`连接${statusText}`);
      } catch (error) {
        console.error(`[Connection] 处理连接状态失败:`, error);
      }
    }
  }
}
