import { MessageConsumer, WSMessage } from '../types';

/**
 * 心跳消费者
 * 负责响应心跳包 (cmd==0)
 */
export class HeartbeatConsumer implements MessageConsumer {
  name = 'HeartbeatConsumer';

  async handle(message: WSMessage, sendMessage: (message: WSMessage) => void): Promise<void> {
    if (message.cmd === 0) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [Heartbeat] 收到心跳包，发送响应`);
      
      // 发送心跳响应
      sendMessage({
        cmd: 0,
        data: message.data
      });
    }
  }
}
