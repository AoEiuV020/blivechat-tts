# blivechat-tts
blivechat的语音播报插件

## 功能

- 通过 WebSocket 连接到 blivechat 服务器
- 使用 Bearer Token 进行身份验证
- 接收并记录来自服务器的消息
- 支持信号文件方式配置（用于插件集成）
- 提供 Docker Compose 一键部署

## 安装

```bash
pnpm install
```

## 使用方式

### 方式一：直接运行

#### 环境变量

- `BLC_TOKEN` (必需): 用于连接服务器的认证令牌
- `BLC_PORT` (可选): 服务器端口，默认为 12450
- `BLC_HOST` (可选): 服务器主机地址

#### 运行

```bash
# 连接到本机服务器
BLC_TOKEN=your_token pnpm start

# 连接到本机服务器并指定端口
BLC_TOKEN=your_token BLC_PORT=8080 pnpm start

# 连接到指定服务器
BLC_TOKEN=your_token pnpm start example.com
```

#### 参数

第一个命令行参数为服务器主机地址，如果不指定则默认为 `localhost`。

### 方式二：使用信号文件

当设置了 `SIGNAL_FILE_PATH` 环境变量时，程序会监控该文件来获取配置：

```bash
# 设置信号文件路径
SIGNAL_FILE_PATH=/tmp/config.txt node index.js
```

信号文件格式（每行一个配置）：
```
token=your_token_here
port=12450
host=localhost
```

### 方式三：Docker Compose 部署

使用 Docker Compose 可以同时运行 blivechat 服务器和 TTS 插件：

1. 复制 `.env.example` 为 `.env` 并配置：
```bash
cp .env.example .env
# 编辑 .env 文件，设置 BLC_TOKEN
```

2. 启动服务：
```bash
docker-compose up -d
```

3. 查看日志：
```bash
docker-compose logs -f blivechat-tts
```

4. 停止服务：
```bash
docker-compose down
```

## 插件集成

项目提供了 `plugin.json` 文件，可以作为 blivechat 的插件使用。该插件会通过信号文件与主服务通信。

## 文件说明

- `index.js` - 主程序入口
- `write-signal.js` - 信号文件写入脚本（用于插件模式）
- `plugin.json` - blivechat 插件配置文件
- `docker-compose.yml` - Docker Compose 配置
- `Dockerfile` - Docker 镜像构建文件
- `config.ini` - blivechat 配置文件示例
