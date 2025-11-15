import { speak } from 'say';

/**
 * TTS (Text-To-Speech) 模块
 * 负责文字转语音播报
 */

/**
 * 播报文字
 * @param text 要播报的文字
 */
export async function say(text: string): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [TTS] 播报: ${text}`);
  
  return new Promise((resolve, reject) => {
    // 使用系统 TTS 播报
    speak(text, undefined, undefined, (err) => {
      if (err) {
        console.error(`[${timestamp}] [TTS] 播报失败:`, err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * 截断用户名，避免过长的用户名
 * @param username 原始用户名
 * @param maxLength 最大长度，默认为 10
 * @returns 截断后的用户名
 */
export function truncateUsername(username: string, maxLength: number = 10): string {
  if (username.length <= maxLength) {
    return username;
  }
  
  // 如果用户名主要是数字，截断更短
  const digitCount = (username.match(/\d/g) || []).length;
  const digitRatio = digitCount / username.length;
  
  if (digitRatio > 0.7) {
    // 主要是数字，截断到更短
    const shortLength = Math.min(6, maxLength);
    return username.substring(0, shortLength) + '等';
  }
  
  // 普通截断
  return username.substring(0, maxLength) + '等';
}
