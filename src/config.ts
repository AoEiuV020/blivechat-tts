import * as fs from 'fs';

export interface Config {
  token?: string;
  port?: string;
  host?: string;
}

/**
 * 读取配置的函数
 */
export async function loadConfig(): Promise<Config> {
  const signalFilePath = process.env.SIGNAL_FILE_PATH;

  if (signalFilePath) {
    // 如果设置了 SIGNAL_FILE_PATH，监控该文件
    console.log(`等待信号文件: ${signalFilePath}`);

    while (true) {
      // 等待文件出现
      while (!fs.existsSync(signalFilePath)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 检查文件修改时间
      const stats = fs.statSync(signalFilePath);
      const fileModifiedTime = stats.mtimeMs;

      console.log(`读取信号文件: ${signalFilePath}`);
      break;
    }

    // 读取文件内容并解析
    const content = fs.readFileSync(signalFilePath, 'utf-8');
    const config: Config = {};

    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        if (key === 'token') config.token = value;
        if (key === 'port') config.port = value;
        if (key === 'host') config.host = value;
      }
    });

    // 读取成功后删除信号文件
    try {
      fs.unlinkSync(signalFilePath);
      console.log(`已删除信号文件: ${signalFilePath}`);
    } catch (error) {
      console.warn(`删除信号文件失败: ${error}`);
    }

    return config;
  } else {
    // 直接从环境变量读取
    return {
      token: process.env.BLC_TOKEN,
      port: process.env.BLC_PORT,
      host: process.argv[2]
    };
  }
}
