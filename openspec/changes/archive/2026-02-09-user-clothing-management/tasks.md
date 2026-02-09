## 1. 数据库配置

- [x] 1.1 安装 Prisma 和 PostgreSQL 依赖
- [x] 1.2 配置 Prisma schema（用户、衣物、房间、季节表）
- [x] 1.3 创建 .env 文件配置数据库连接
- [x] 1.4 运行数据库迁移生成表结构
- [x] 1.5 创建季节种子数据（春、夏、秋、冬）

## 2. 后端认证模块

- [x] 2.1 安装 bcrypt、jsonwebtoken 依赖
- [x] 2.2 创建 JWT 工具函数（生成、验证令牌）
- [x] 2.3 创建认证中间件
- [x] 2.4 实现注册接口 POST /api/auth/register
- [x] 2.5 实现登录接口 POST /api/auth/login
- [x] 2.6 实现令牌刷新接口 POST /api/auth/refresh

## 3. 后端用户模块

- [x] 3.1 创建用户路由文件
- [x] 3.2 实现获取当前用户 GET /api/users/me
- [x] 3.3 实现更新用户信息 PUT /api/users/me
- [x] 3.4 安装 multer 处理文件上传
- [x] 3.5 实现头像上传 PUT /api/users/me/avatar
- [x] 3.6 配置静态文件服务 /uploads

## 4. 后端房间和季节模块

- [x] 4.1 创建房间路由文件
- [x] 4.2 实现获取房间列表 GET /api/rooms
- [x] 4.3 实现创建房间 POST /api/rooms
- [x] 4.4 实现更新房间 PUT /api/rooms/:id
- [x] 4.5 实现删除房间 DELETE /api/rooms/:id
- [x] 4.6 创建季节路由文件
- [x] 4.7 实现获取季节列表 GET /api/seasons

## 5. 后端衣物模块

- [x] 5.1 创建衣物路由文件
- [x] 5.2 实现获取衣物列表 GET /api/clothing（含筛选、搜索、分页）
- [x] 5.3 实现添加衣物 POST /api/clothing
- [x] 5.4 实现获取衣物详情 GET /api/clothing/:id
- [x] 5.5 实现更新衣物 PUT /api/clothing/:id
- [x] 5.6 实现删除衣物 DELETE /api/clothing/:id
- [x] 5.7 实现衣物图片上传

## 6. 前端基础设施

- [x] 6.1 安装 axios、pinia 依赖
- [x] 6.2 创建 API 服务层（axios 封装、拦截器）
- [x] 6.3 创建认证 store（登录状态、令牌管理）
- [x] 6.4 创建路由守卫（认证检查）
- [x] 6.5 更新路由配置（登录、注册、衣物、个人中心）

## 7. 前端认证页面

- [x] 7.1 创建登录页面 Login.vue
- [x] 7.2 创建注册页面 Register.vue
- [x] 7.3 实现表单验证和错误提示
- [x] 7.4 实现登录/注册成功后跳转

## 8. 前端衣物管理页面

- [x] 8.1 创建衣物列表页面 ClothingList.vue
- [x] 8.2 创建衣物卡片组件 ClothingCard.vue
- [x] 8.3 创建筛选面板组件 FilterPanel.vue
- [x] 8.4 创建衣物详情页面 ClothingDetail.vue
- [x] 8.5 创建添加/编辑衣物页面 ClothingForm.vue
- [x] 8.6 实现图片上传组件 ImageUploader.vue
- [x] 8.7 实现房间选择组件 RoomSelector.vue
- [x] 8.8 实现季节多选组件 SeasonSelector.vue

## 9. 前端个人中心和房间管理

- [x] 9.1 创建个人中心页面 Profile.vue
- [x] 9.2 创建编辑资料页面 EditProfile.vue
- [x] 9.3 创建房间管理页面 RoomManage.vue
- [x] 9.4 实现退出登录功能

## 10. 集成测试和优化

- [ ] 10.1 测试完整的注册-登录流程
- [ ] 10.2 测试衣物 CRUD 操作
- [ ] 10.3 测试筛选和搜索功能
- [ ] 10.4 修复发现的问题
- [x] 10.5 更新根目录启动脚本
