## Why

电子衣帽间项目需要实现核心的用户系统和衣物管理功能作为 MVP 基础。用户系统提供账户管理能力，衣物管理让用户能够添加、编辑、删除和分类衣物，并支持按房间和季节筛选，这是整个应用的核心价值所在。

## What Changes

- 新增用户认证系统（注册、登录、JWT 令牌管理）
- 新增用户资料管理（查看、编辑个人信息）
- 新增衣物 CRUD 操作（添加、编辑、删除衣物）
- 新增衣物分类系统（支持多维度分类）
- 新增衣物筛选功能（按房间、按季节筛选）
- 新增后端 API 接口（Express + TypeScript）
- 新增前端页面（Vue3 + TypeScript）
- 新增数据库表结构（用户表、衣物表、分类表）

## Capabilities

### New Capabilities

- `user-auth`: 用户认证能力，包含注册、登录、JWT 令牌验证、密码加密
- `user-profile`: 用户资料管理，包含个人信息的查看和编辑
- `clothing-crud`: 衣物增删改查操作，包含图片上传关联
- `clothing-category`: 衣物分类系统，支持房间分类和季节分类
- `clothing-filter`: 衣物筛选功能，支持多维度组合筛选

### Modified Capabilities

- `node-backend`: 扩展后端服务，新增用户和衣物相关 API 路由
- `h5-frontend`: 扩展前端应用，新增用户和衣物管理页面

## Impact

- **后端**: 新增 routes/、services/、models/ 下的用户和衣物模块
- **前端**: 新增 views/、components/ 下的用户和衣物页面组件
- **数据库**: 新增 PostgreSQL 数据表（users、clothing、categories、rooms、seasons）
- **依赖**: 新增 bcrypt、jsonwebtoken、pg、multer 等依赖
- **API**: 新增 /api/auth/*、/api/users/*、/api/clothing/*、/api/categories/* 端点
