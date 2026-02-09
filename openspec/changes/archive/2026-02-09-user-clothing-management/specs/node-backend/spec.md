## MODIFIED Requirements

### Requirement: Express 服务初始化
系统 SHALL 创建 Express 服务，使用 TypeScript 编写，并集成 Prisma ORM。

#### Scenario: 服务启动成功
- **WHEN** 执行 npm run dev
- **THEN** 后端服务启动并连接数据库

#### Scenario: 数据库连接
- **WHEN** 服务启动时
- **THEN** 自动连接 PostgreSQL 数据库

### Requirement: RESTful API 基础结构
系统 SHALL 配置 RESTful API 路由结构，包含用户和衣物模块。

#### Scenario: 健康检查接口
- **WHEN** 发送 GET 请求到 /api/health
- **THEN** 返回 200 状态码和服务健康状态

#### Scenario: 认证路由
- **WHEN** 访问 /api/auth/* 路径
- **THEN** 路由到认证模块处理

#### Scenario: 用户路由
- **WHEN** 访问 /api/users/* 路径
- **THEN** 路由到用户模块处理（需认证）

#### Scenario: 衣物路由
- **WHEN** 访问 /api/clothing/* 路径
- **THEN** 路由到衣物模块处理（需认证）

#### Scenario: 房间路由
- **WHEN** 访问 /api/rooms/* 路径
- **THEN** 路由到房间模块处理（需认证）

#### Scenario: 季节路由
- **WHEN** 访问 /api/seasons 路径
- **THEN** 路由到季节模块处理

## ADDED Requirements

### Requirement: Prisma ORM 集成
系统 SHALL 使用 Prisma 作为数据库 ORM。

#### Scenario: Schema 定义
- **WHEN** 定义数据模型
- **THEN** 使用 Prisma schema 文件定义

#### Scenario: 数据库迁移
- **WHEN** 执行 npx prisma migrate dev
- **THEN** 自动生成并应用数据库迁移

### Requirement: 文件上传服务
系统 SHALL 提供文件上传功能，支持图片存储。

#### Scenario: 上传图片
- **WHEN** 接收到图片上传请求
- **THEN** 保存图片到 uploads/ 目录并返回访问 URL

#### Scenario: 静态文件服务
- **WHEN** 访问 /uploads/* 路径
- **THEN** 返回对应的静态文件
