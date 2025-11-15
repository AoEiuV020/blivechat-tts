# blivechat-tts
blivechat的语音播报插件

## 安装

```bash
pnpm install
```

## 使用

### 环境变量

- `BLC_TOKEN` (必需): 用于连接服务器的认证令牌
- `BLC_PORT` (可选): 服务器端口，默认为 80

### 运行

```bash
# 连接到本机服务器
BLC_TOKEN=your_token BLC_PORT=8080 pnpm start

# 连接到指定服务器
BLC_TOKEN=your_token BLC_PORT=8080 pnpm start example.com
```

### 参数

第一个命令行参数为服务器主机地址，如果不指定则默认为 `localhost`。

## 功能

- 通过 WebSocket 连接到 blivechat 服务器
- 使用 Bearer Token 进行身份验证
- 接收并记录来自服务器的消息
