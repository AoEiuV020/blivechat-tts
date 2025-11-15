FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml tsconfig.json ./

# 安装 pnpm 并安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码
COPY src ./src

# 构建 TypeScript
RUN pnpm build

# 启动应用
CMD ["node", "dist/index.js"]
