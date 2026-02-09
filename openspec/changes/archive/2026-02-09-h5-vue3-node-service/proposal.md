## Why

项目需要一个现代化的 H5 前端页面和配套的后台服务。前端采用 Vue3 框架以获得更好的开发体验和性能，后端采用 Node.js 提供 API 服务，实现前后端分离的架构。

## What Changes

- 新增 Vue3 H5 前端项目，包含基础页面结构和路由
- 新增 Node.js 后台服务，提供 RESTful API
- 配置前后端开发和构建脚本
- 添加基础的项目配置文件（eslint、prettier、tsconfig 等）

## Capabilities

### New Capabilities

- `h5-frontend`: Vue3 前端 H5 页面，包含项目初始化、路由配置、基础组件
- `node-backend`: Node.js 后台服务，提供 API 接口和基础中间件配置

### Modified Capabilities

<!-- 无现有能力需要修改 -->

## Impact

- 新增 `frontend/` 目录存放 Vue3 项目
- 新增 `backend/` 目录存放 Node.js 服务
- 需要安装 Node.js 和 npm 依赖
- 开发时需要同时启动前端开发服务器和后端服务
