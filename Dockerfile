FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 并安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制应用代码
COPY index.js write-signal.js ./

# 启动应用
CMD ["node", "index.js"]
