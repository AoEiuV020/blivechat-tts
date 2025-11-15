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

    // 记录启动时间，只接受启动后创建的文件
    const startTime = Date.now();

    while (true) {
      // 等待文件出现
      while (!fs.existsSync(signalFilePath)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 检查文件修改时间
      const stats = fs.statSync(signalFilePath);
      const fileModifiedTime = stats.mtimeMs;

      // 如果文件是在程序启动之前创建的，删除它并继续等待
      if (fileModifiedTime < startTime) {
        console.log(`检测到旧文件（创建于 ${new Date(fileModifiedTime).toISOString()}），删除并继续等待...`);
        fs.unlinkSync(signalFilePath);
        continue;
      }

      // 文件是刚创建的，读取它
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
