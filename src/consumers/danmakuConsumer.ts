import { MessageConsumer, WSMessage, DanmakuData } from '../types';
import { say } from '../tts';

/**
 * 弹幕消费者
 * 负责处理弹幕消息 (cmd==2) 并播报
 */
export class DanmakuConsumer implements MessageConsumer {
  name = 'DanmakuConsumer';

  async handle(message: WSMessage): Promise<void> {
    if (message.cmd === 2) {
      try {
        const data = message.data as any[];
        
        // 解析弹幕数据
        const danmaku: DanmakuData = {
          avatar: data[0],
          timestamp: data[1],
          username: data[2],
          field3: data[3],
          message: data[4],
          field5: data[5],
          field6: data[6],
          field7: data[7],
          field8: data[8],
          field9: data[9],
          field10: data[10],
          uuid: data[11],
          field12: data[12],
          field13: data[13],
          field14: data[14],
          field15: data[15],
          field16: data[16],
          field17: data[17]
        };

        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [Danmaku] ${danmaku.username} 说: ${danmaku.message}`);

        // 调用 TTS 播报
        await say(`${danmaku.username} 说 ${danmaku.message}`);
      } catch (error) {
        console.error(`[Danmaku] 处理弹幕失败:`, error);
      }
    }
  }
}
