const fs = require('fs');

// 从环境变量读取配置
const token = process.env.BLC_TOKEN;
const port = process.env.BLC_PORT || '12450';
const host = process.env.BLC_HOST || 'blivechat';
const signalFilePath = process.env.SIGNAL_FILE_PATH;

if (!signalFilePath) {
  console.error('错误: SIGNAL_FILE_PATH 环境变量未设置');
  process.exit(1);
}

if (!token) {
  console.error('错误: BLC_TOKEN 环境变量未设置');
  process.exit(1);
}

// 写入信号文件
const content = `token=${token}
port=${port}
host=${host}
`;

console.log(`写入信号文件: ${signalFilePath}`);
console.log(`配置: host=${host}, port=${port}`);

fs.writeFileSync(signalFilePath, content, 'utf-8');

console.log('信号文件写入完成');
