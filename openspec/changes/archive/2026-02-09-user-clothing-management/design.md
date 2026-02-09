## Context

在已有的 Vue3 前端和 Node.js Express 后端基础上，扩展实现用户系统和衣物管理功能。项目采用前后端分离架构，前端运行在 3000 端口，后端运行在 4000 端口，通过 /api 代理进行通信。

当前技术栈：
- 前端：Vue3 + Vite + TypeScript + Vue Router
- 后端：Node.js + Express + TypeScript
- 数据库：PostgreSQL（新增）
- 缓存：Redis（预留）

## Goals / Non-Goals

**Goals:**
- 实现完整的用户注册、登录、认证流程
- 实现衣物的增删改查功能
- 实现按房间和季节的衣物分类与筛选
- 建立清晰的数据库模型和 API 设计
- 前端实现响应式的用户和衣物管理界面

**Non-Goals:**
- 暂不实现社交功能（分享、点赞、评论）
- 暂不实现穿搭组合功能
- 暂不实现 AI 图像识别
- 暂不实现多端同步
- 暂不实现第三方登录（微信、支付宝）

## Decisions

### 1. 数据库选择 PostgreSQL
**决策**: 使用 PostgreSQL 作为主数据库
**理由**:
- 支持复杂查询和关系型数据
- 适合存储结构化的用户和衣物数据
- 良好的 JSON 支持，便于存储灵活字段
- **备选方案**: MySQL（功能类似但 JSON 支持稍弱）

### 2. ORM 选择 Prisma
**决策**: 使用 Prisma 作为 ORM
**理由**:
- TypeScript 原生支持，类型安全
- Schema 即文档，易于维护
- 自动生成类型和迁移
- **备选方案**: TypeORM（配置复杂）、Sequelize（类型支持较弱）

### 3. 认证方案 JWT
**决策**: 使用 JWT + Refresh Token 进行身份认证
**理由**:
- 无状态，易于扩展
- 前后端分离友好
- 支持 Token 刷新机制
- **备选方案**: Session（需要服务端存储）

### 4. 分类模型设计
**决策**: 房间和季节作为独立维度，衣物可同时关联多个分类
**理由**:
- 房间（卧室、客厅、储物间等）和季节（春、夏、秋、冬）是正交维度
- 一件衣物可能适合多个季节
- 支持灵活的筛选组合
- **备选方案**: 单一分类（不够灵活）

### 5. 图片存储
**决策**: 本阶段使用本地文件存储，预留云存储接口
**理由**:
- 快速验证 MVP
- 后续可无缝切换到阿里云 OSS
- **备选方案**: 直接使用云存储（增加复杂度）

## Risks / Trade-offs

- **[本地存储限制]** → 后续需迁移到云存储，需要设计好抽象层
- **[单体架构]** → 暂时足够，后续可拆分微服务
- **[无缓存]** → 首版不加 Redis 缓存，可能影响性能 → 监控后按需添加
- **[密码安全]** → 使用 bcrypt 加密，确保足够的 salt rounds

## Database Schema

### 核心表设计

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 房间表
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 季节表（系统预设）
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  display_order INT DEFAULT 0
);

-- 衣物表
CREATE TABLE clothing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  color VARCHAR(50),
  size VARCHAR(20),
  brand VARCHAR(100),
  purchase_date DATE,
  image_url VARCHAR(500),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 衣物-季节关联表
CREATE TABLE clothing_seasons (
  clothing_id UUID REFERENCES clothing(id) ON DELETE CASCADE,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  PRIMARY KEY (clothing_id, season_id)
);
```

## API Design

### 认证 API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出

### 用户 API
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息
- `PUT /api/users/me/avatar` - 更新头像

### 衣物 API
- `GET /api/clothing` - 获取衣物列表（支持筛选）
- `POST /api/clothing` - 添加衣物
- `GET /api/clothing/:id` - 获取衣物详情
- `PUT /api/clothing/:id` - 更新衣物
- `DELETE /api/clothing/:id` - 删除衣物

### 分类 API
- `GET /api/rooms` - 获取用户房间列表
- `POST /api/rooms` - 创建房间
- `PUT /api/rooms/:id` - 更新房间
- `DELETE /api/rooms/:id` - 删除房间
- `GET /api/seasons` - 获取季节列表（系统预设）
