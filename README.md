# 电子衣帽间 (Digital Cloakroom) 项目

## 📋 项目概述

电子衣帽间是一个多端分布式应用，帮助用户在线管理、整理和搭配衣物。用户可以通过拍照或导入等方式上传衣物信息，系统提供智能分类、穿搭建议、穿搭记录等功能。

### 核心功能
- 👕 **衣物管理**: 添加、编辑、删除、分类衣物
- 🎨 **穿搭管理**: 保存穿搭组合，获得搭配建议
- 📸 **图库管理**: 照片上传、存储、分类、AI识别
- 👥 **用户系统**: 登录、注册、个人资料、权限管理
- 📊 **数据统计**: 穿搭记录、衣物使用频率分析
- 🔄 **多端同步**: Web、小程序、App 数据实时同步
- 💬 **社交分享**: 穿搭分享、收藏、点赞评论

---

## 🏗️ 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层 (Client Layer)                    │
├─────────────────────────────────────────────────────────────────┤
│  Web前端        │   小程序端         │    iOS App      │  Android App │
│  (React/Vue)    │  (微信/支付宝)     │   (React Native)│(React Native)│
└──────┬──────────┴────────┬───────────┴────────┬────────┴─────┬────┘
       │                   │                    │              │
       └───────────────────┼────────────────────┼──────────────┘
                           ▼
           ┌──────────────────────────────────┐
           │   CDN / API 网关 (API Gateway)    │
           │  - 请求路由与负载均衡            │
           │  - 身份验证与授权               │
           │  - 请求日志与监控               │
           └──────────┬───────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   后端服务层 (Backend Services)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  用户服务        │  │  衣物服务        │  │  穿搭服务    │   │
│  │  (User Service)  │  │(Clothing Service)│  │(Outfit Svc)  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  图片服务        │  │  推荐服务        │  │  社交服务    │   │
│  │(Image Service)   │  │(Recommend Svc)   │  │(Social Svc)  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│                                                                   │
└────┬──────────────────┬──────────────────┬──────────────────┬────┘
     │                  │                  │                  │
┌────▼────┐  ┌──────────▼────┐  ┌─────────▼──────┐  ┌────────▼────┐
│  Redis  │  │   PostgreSQL  │  │   MongoDB      │  │  云存储      │
│  缓存   │  │   关系数据库  │  │   (非关系DB)   │  │  (图片文件)  │
└─────────┘  └───────────────┘  └────────────────┘  └─────────────┘
```

### 技术栈选型

#### 前端
| 端口         | 框架/技术              | 说明                               |
| ------------ | ---------------------- | ---------------------------------- |
| Web          | React 18 + TypeScript  | 响应式设计，支持PC和移动端         |
| 小程序       | uni-app                | 一套代码多端适配（微信、支付宝等） |
| App (跨平台) | React Native / Flutter | iOS 和 Android 原生体验            |

#### 后端
| 组件     | 技术方案                                                        |
| -------- | --------------------------------------------------------------- |
| 语言     | Node.js (Express/Nestjs) 或 Python (FastAPI/Django) 或 Go (Gin) |
| 数据库   | PostgreSQL (关系数据) + MongoDB (灵活数据)                      |
| 缓存     | Redis (会话、缓存、队列)                                        |
| 文件存储 | 阿里云 OSS / 腾讯云 COS / AWS S3                                |
| 消息队列 | RabbitMQ / Kafka (异步任务处理)                                 |
| 服务发现 | Nacos / Consul (微服务架构)                                     |

#### DevOps & 运维
| 工具                        | 用途                                 |
| --------------------------- | ------------------------------------ |
| Docker                      | 容器化部署                           |
| Kubernetes / Docker Compose | 容器编排                             |
| Git                         | 版本控制                             |
| CI/CD                       | GitHub Actions / GitLab CI / Jenkins |
| 监控告警                    | Prometheus + Grafana                 |
| 日志系统                    | ELK Stack 或 Loki                    |

---

## 📦 项目结构规划

```
cloakroom/
├── README.md                          # 项目说明文档
├── architecture.md                    # 详细架构设计文档
├── docs/                              # 文档目录
│   ├── api-design.md                 # API 设计文档
│   ├── database-schema.md             # 数据库设计文档
│   ├── deployment.md                  # 部署说明
│   └── development-guide.md           # 开发指南
│
├── backend/                           # 后端服务
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── config/                    # 配置文件
│   │   ├── services/                  # 业务服务
│   │   │   ├── user.service.ts        # 用户服务
│   │   │   ├── clothing.service.ts    # 衣物服务
│   │   │   ├── outfit.service.ts      # 穿搭服务
│   │   │   ├── image.service.ts       # 图片服务
│   │   │   └── recommend.service.ts   # 推荐服务
│   │   ├── controllers/               # 控制层
│   │   ├── middleware/                # 中间件
│   │   ├── models/                    # 数据模型
│   │   ├── utils/                     # 工具函数
│   │   └── main.ts                    # 入口文件
│   └── tests/
│
├── web/                               # Web 前端 (React)
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── components/                # 公共组件
│   │   ├── pages/                     # 页面组件
│   │   │   ├── home/
│   │   │   ├── closet/                # 衣帽间页面
│   │   │   ├── outfit/                # 穿搭页面
│   │   │   └── user/                  # 用户页面
│   │   ├── services/                  # API 服务
│   │   ├── stores/                    # 状态管理
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.tsx
│   └── .env.example
│
├── miniapp/                           # 小程序 (uni-app)
│   ├── pages/                         # 页面文件
│   ├── components/                    # 通用组件
│   ├── static/                        # 静态资源
│   ├── common/                        # 公共文件
│   ├── utils/                         # 工具函数
│   ├── App.vue                        # 应用主文件
│   ├── main.js                        # 入口文件
│   ├── pages.json                     # 页面路由配置
│   └── package.json
│
├── app/                               # 移动应用 (React Native)
│   ├── package.json
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   └── .env.example
│
└── infra/                             # 基础设施代码
    ├── docker-compose.yml             # 完整开发环境
    ├── kubernetes/                    # K8s 配置
    ├── terraform/                     # IaC 配置
    └── monitoring/                    # 监控配置
```

### 核心表结构示例

| 表             | 主要字段                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------- |
| users          | id, email, phone, password_hash, username, avatar, profile, created_at, updated_at          |
| clothing       | id, user_id, name, category, color, size, brand, purchase_date, image_ids, tags, created_at |
| outfits        | id, user_id, name, description, clothing_ids, occasion, season, created_at                  |
| outfit_records | id, user_id, outfit_id, wear_date, weather, location, notes                                 |
| images         | id, clothing_id, user_id, url, size, bucket, created_at                                     |
| categories     | id, name, icon, user_id, display_order                                                      |

---

## 🔐 关键特性设计

### 1. 认证与授权
- JWT Token + Refresh Token
- OAuth 2.0 集成（微信、支付宝登录）
- 权限角色模型 (RBAC)

### 2. 图片处理
- 多格式支持 (JPG, PNG, WebP)
- 智能缩放和压缩
- CDN 加速分发
- AI 图像识别（衣物类别自动分类）

### 3. 搜索和过滤
- ElasticSearch 全文搜索
- 多维度过滤（颜色、尺码、类别、季节等）
- 个性化推荐算法

### 4. 数据同步
- 多端数据实时同步
- 离线模式支持
- 冲突解决机制

### 5. 社交功能
- 穿搭分享
- 收藏和点赞
- 用户评论
- 关注系统

---

## 🚀 分阶段开发计划

### 阶段 1: 核心功能 (MVP - 8 周)
- ✅ 用户认证系统
- ✅ 基础衣物管理 (CRUD)
- ✅ 图片上传和存储
- ✅ Web 前端原型

### 阶段 2: 扩展功能 (6 周)
- ✅ 穿搭管理和记录
- ✅ 推荐引擎初版
- ✅ 小程序版本
- ✅ 图片 AI 识别

### 阶段 3: 优化和社交 (6 周)
- ✅ 社交功能 (分享、收藏、评论)
- ✅ 性能优化
- ✅ App 版本（React Native）
- ✅ 高级推荐算法

### 阶段 4: 运营和迭代 (持续)
- ✅ 用户反馈收集
- ✅ 功能迭代
- ✅ 数据分析和优化
- ✅ 商业化探索

---

## ✅ 建议的第一步 (重点)

### 优先级排序

#### 1️⃣ **首先：架构确认和技术选型** (1-2 天)
   - [ ] 确定后端框架（Node.js/Python/Go）
   - [ ] 确定前端框架（React/Vue）
   - [ ] 确定小程序方案（uni-app）
   - [ ] 确定 App 方案（React Native/Flutter）
   - [ ] 选定数据库和存储服务

**🎯 推荐方案：**
```
✨ 后端: Node.js + Nestjs + TypeScript
✨ 前端: React 18 + TypeScript  
✨ 小程序: uni-app
✨ App: React Native
✨ 数据库: PostgreSQL + Redis
✨ 存储: 阿里云 OSS (国内友好)
```

#### 2️⃣ **其次：数据库设计** (2-3 天)
   - [ ] 完成用户、衣物、穿搭等数据表设计
   - [ ] 设计核心 API 规范
   - [ ] 制定权限和安全方案

#### 3️⃣ **第三步：后端基础框架** (3-5 天)
   - [ ] 初始化 Nestjs 项目结构
   - [ ] 配置 Docker 开发环境
   - [ ] 实现用户认证系统（JWT）
   - [ ] 搭建 API 中间件和错误处理

#### 4️⃣ **第四步：核心 API 开发** (1-2 周)
   - [ ] 用户相关 API
   - [ ] 衣物 CRUD API
   - [ ] 图片上传 API
   - [ ] 分类管理 API

#### 5️⃣ **第五步：Web 前端开发** (2-3 周)
   - [ ] 搭建 React 项目和路由
   - [ ] 实现登录/注册模块
   - [ ] 实现衣物管理页面
   - [ ] 实现图片上传功能

#### 6️⃣ **后续：测试、小程序、App**
   - [ ] 单元测试和集成测试
   - [ ] uni-app 小程序版本
   - [ ] React Native App 版本

---

## 📊 数据模型关系

```
用户 (User)
├── 一对多 → 衣物 (Clothing)
├── 一对多 → 穿搭 (Outfit)
├── 一对多 → 穿搭记录 (OutfitRecord)
└── 一对多 → 收藏 (Collection)

衣物 (Clothing)
├── 一对多 → 图片 (Image)
├── 多对一 → 分类 (Category)
├── 多对一 → 颜色 (Color)
└── 多对一 → 用户 (User)

穿搭 (Outfit)
├── 一对多 → 穿搭项 (OutfitItem)
├── 一对多 → 穿搭记录 (OutfitRecord)
├── 多对一 → 用户 (User)
└── 多对多 → 标签 (Tag)
```

---

## 🛠️ 快速开始 (待完成)

```bash
# 克隆项目
git clone <repo>
cd cloakroom

# 启动完整开发环境
docker-compose up -d

# 初始化数据库
npm run db:migrate

# 启动后端服务
cd backend && npm install && npm run dev

# 启动 Web 前端 (新终端)
cd web && npm install && npm run dev
```

---

## 📚 相关文档 (待完成)

- [API 设计文档](docs/api-design.md) - TODO
- [数据库设计文档](docs/database-schema.md) - TODO
- [开发指南](docs/development-guide.md) - TODO
- [部署说明](docs/deployment.md) - TODO

---

## 👥 团队协作建议

- **后端团队**: 2-3 人（API 开发、数据库、基础设施）
- **前端团队**: 2-3 人（Web、小程序、App）
- **产品和设计**: 1-2 人
- **测试和运维**: 1 人

---

## 📈 时间规划估算

| 阶段             | 时间 | 交付物                         |
| ---------------- | ---- | ------------------------------ |
| 阶段 1: MVP      | 8 周 | 后端 API + Web 前端 + 核心功能 |
| 阶段 2: 功能扩展 | 6 周 | 小程序 + 推荐系统 + 穿搭功能   |
| 阶段 3: 优化社交 | 6 周 | App 版本 + 社交功能 + 性能优化 |
| 阶段 4: 迭代运营 | 持续 | 持续优化和新功能               |

**总计**: 20 周达到功能完整的 1.0 版本

---

## 📞 项目状态

- **当前阶段**: 规划和架构设计
- **最后更新**: 2026-01-23
- **状态**: ✍️ 待开始
