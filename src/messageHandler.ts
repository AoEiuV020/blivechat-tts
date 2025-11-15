import WebSocket from 'ws';
import { WSMessage, MessageConsumer } from './types';

/**
 * 消息处理器
 * 负责解析 WebSocket 消息并分发给所有消费者
 */
export class MessageHandler {
  private consumers: MessageConsumer[] = [];
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  /**
   * 注册消息消费者
   */
  registerConsumer(consumer: MessageConsumer): void {
    this.consumers.push(consumer);
    console.log(`[MessageHandler] 注册消费者: ${consumer.name}`);
  }

  /**
   * 发送消息到 WebSocket 服务器
   */
  sendMessage(message: WSMessage): void {
    try {
      const jsonStr = JSON.stringify(message);
      this.ws.send(jsonStr);
      console.log(`[MessageHandler] 发送消息: cmd=${message.cmd}`);
    } catch (error) {
      console.error(`[MessageHandler] 发送消息失败:`, error);
    }
  }

  /**
   * 处理接收到的消息
   */
  async handleMessage(data: WebSocket.Data): Promise<void> {
    try {
      const jsonStr = data.toString();
      const message: WSMessage = JSON.parse(jsonStr);

      // 分发给所有消费者
      for (const consumer of this.consumers) {
        try {
          await consumer.handle(message, this.sendMessage.bind(this));
        } catch (error) {
          console.error(`[MessageHandler] 消费者 ${consumer.name} 处理消息失败:`, error);
        }
      }
    } catch (error) {
      console.error(`[MessageHandler] 解析消息失败:`, error);
      console.error(`[MessageHandler] 原始数据:`, data.toString());
    }
  }
}
