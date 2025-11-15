import { MessageConsumer, WSMessage } from '../types';

/**
 * 日志消费者
 * 负责记录所有接收到的消息
 */
export class LoggerConsumer implements MessageConsumer {
  name = 'LoggerConsumer';

  async handle(message: WSMessage): Promise<void> {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [Logger] 收到消息: cmd=${message.cmd}, data=${JSON.stringify(message.data).substring(0, 100)}...`);
  }
}
