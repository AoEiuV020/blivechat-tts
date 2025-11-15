/**
 * WebSocket 消息实体
 */
export interface WSMessage {
  cmd: number;
  data: any;
}

/**
 * 弹幕消息数据结构
 */
export interface DanmakuData {
  avatar: string;      // data[0] - 头像URL
  timestamp: number;   // data[1] - 时间戳
  username: string;    // data[2] - 用户名
  field3: number;      // data[3]
  message: string;     // data[4] - 消息内容
  field5: number;      // data[5]
  field6: number;      // data[6]
  field7: number;      // data[7]
  field8: number;      // data[8]
  field9: number;      // data[9]
  field10: number;     // data[10]
  uuid: string;        // data[11] - UUID
  field12: string;     // data[12]
  field13: number;     // data[13]
  field14: any[];      // data[14]
  field15: any[];      // data[15]
  field16: string;     // data[16]
  field17: string;     // data[17]
}

/**
 * 消息消费者接口
 */
export interface MessageConsumer {
  /**
   * 消费者名称
   */
  name: string;

  /**
   * 处理消息
   * @param message WebSocket 消息
   * @param sendMessage 发送消息的回调函数
   */
  handle(message: WSMessage, sendMessage: (message: WSMessage) => void): Promise<void>;
}
