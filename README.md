# blivechat-tts
blivechat的语音播报插件

## 功能

- 通过 WebSocket 连接到 blivechat 服务器
- 使用 Bearer Token 进行身份验证
- 接收并记录来自服务器的消息
- 支持信号文件方式配置（用于插件集成）
- 提供 Docker Compose 一键部署
- 使用 TypeScript 编写

## 开发

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
pnpm build
```

### 开发模式

```bash
pnpm dev
```

## 使用方式

### 方式一：直接运行

#### 环境变量

- `BLC_TOKEN` (必需): 用于连接服务器的认证令牌
- `BLC_PORT` (可选): 服务器端口，默认为 12450
- `BLC_HOST` (可选): 服务器主机地址

#### 运行

```bash
# 先构建
pnpm build

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
SIGNAL_FILE_PATH=/tmp/config.txt pnpm start
```

信号文件格式（每行一个配置）：
```
token=your_token_here
port=12450
host=localhost
```

### 方式三：Docker Compose 部署

使用 Docker Compose 可以同时运行 blivechat 服务器和 TTS 插件：

启动服务：
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

项目提供了 `plugin.json` 文件，可以作为 blivechat 的插件使用。

插件通过纯 shell 命令写入信号文件：
```bash
printf "token=%s\nport=%s\nhost=%s\n" "$BLC_TOKEN" "$BLC_PORT" "$BLC_HOST" > $SIGNAL_FILE_PATH
```

blivechat 会自动在环境变量中提供 `BLC_TOKEN`、`BLC_PORT` 和 `SIGNAL_FILE_PATH`。docker-compose 中只需要设置 `BLC_HOST`（用于指定 TTS 服务连接的主机名）。插件的 run 命令将这些信息写入信号文件，TTS 服务读取该文件获取配置。

## 文件说明

- `src/index.ts` - 主程序入口（TypeScript）
- `dist/` - 编译后的 JavaScript 文件
- `plugin.json` - blivechat 插件配置文件
- `docker-compose.yml` - Docker Compose 配置
- `Dockerfile` - Docker 镜像构建文件
- `tsconfig.json` - TypeScript 配置
