## 1. 项目结构初始化

- [x] 1.1 创建 frontend/ 目录用于 Vue3 项目
- [x] 1.2 创建 backend/ 目录用于 Node.js 服务
- [x] 1.3 创建根目录 package.json 配置工作区脚本

## 2. Vue3 前端项目搭建

- [x] 2.1 使用 Vite 初始化 Vue3 + TypeScript 项目
- [x] 2.2 安装并配置 Vue Router
- [x] 2.3 配置 H5 移动端视口适配（viewport meta）
- [x] 2.4 创建基础目录结构（components、views、router）
- [x] 2.5 创建首页组件 Home.vue
- [x] 2.6 创建 404 页面组件 NotFound.vue
- [x] 2.7 配置路由（首页和 404 兜底路由）
- [x] 2.8 配置 Vite 开发服务器代理（/api 代理到后端）

## 3. Node.js 后端服务搭建

- [x] 3.1 初始化 Node.js 项目和 package.json
- [x] 3.2 安装 Express、TypeScript 及相关依赖
- [x] 3.3 配置 TypeScript（tsconfig.json）
- [x] 3.4 创建基础目录结构（routes、middleware、types）
- [x] 3.5 创建 Express 应用入口文件
- [x] 3.6 配置 JSON 解析中间件
- [x] 3.7 配置 CORS 中间件
- [x] 3.8 创建统一错误处理中间件
- [x] 3.9 创建健康检查接口 GET /api/health
- [x] 3.10 配置开发模式热重载（nodemon 或 ts-node-dev）

## 4. 构建和运行配置

- [x] 4.1 配置前端构建脚本（npm run build）
- [x] 4.2 配置后端构建脚本（TypeScript 编译）
- [x] 4.3 创建根目录启动脚本（同时启动前后端开发服务器）
- [x] 4.4 验证前后端联调（前端调用后端 /api/health 接口）
