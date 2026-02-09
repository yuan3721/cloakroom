## MODIFIED Requirements

### Requirement: 基础路由配置
系统 SHALL 使用 Vue Router 配置完整路由，包含认证和衣物管理页面。

#### Scenario: 访问首页
- **WHEN** 已登录用户访问根路径 "/"
- **THEN** 系统显示衣物列表首页

#### Scenario: 未登录重定向
- **WHEN** 未登录用户访问受保护页面
- **THEN** 系统重定向到登录页面

#### Scenario: 访问登录页
- **WHEN** 用户访问 /login
- **THEN** 系统显示登录页面

#### Scenario: 访问注册页
- **WHEN** 用户访问 /register
- **THEN** 系统显示注册页面

## ADDED Requirements

### Requirement: 登录页面
系统 SHALL 提供用户登录页面。

#### Scenario: 显示登录表单
- **WHEN** 用户访问登录页
- **THEN** 显示邮箱和密码输入框及登录按钮

#### Scenario: 登录成功
- **WHEN** 用户提交正确的凭据
- **THEN** 跳转到首页并保存令牌

#### Scenario: 登录失败
- **WHEN** 用户提交错误的凭据
- **THEN** 显示错误提示信息

### Requirement: 注册页面
系统 SHALL 提供用户注册页面。

#### Scenario: 显示注册表单
- **WHEN** 用户访问注册页
- **THEN** 显示邮箱、密码、确认密码输入框及注册按钮

#### Scenario: 注册成功
- **WHEN** 用户提交有效信息
- **THEN** 自动登录并跳转到首页

### Requirement: 衣物列表页面
系统 SHALL 提供衣物列表展示页面。

#### Scenario: 显示衣物列表
- **WHEN** 用户访问首页
- **THEN** 以卡片形式显示用户的衣物列表

#### Scenario: 空状态
- **WHEN** 用户没有任何衣物
- **THEN** 显示空状态提示和添加按钮

#### Scenario: 筛选面板
- **WHEN** 用户点击筛选按钮
- **THEN** 显示房间和季节筛选选项

### Requirement: 衣物详情页面
系统 SHALL 提供衣物详情查看页面。

#### Scenario: 显示详情
- **WHEN** 用户点击衣物卡片
- **THEN** 显示衣物的完整信息

#### Scenario: 编辑入口
- **WHEN** 用户在详情页点击编辑
- **THEN** 进入衣物编辑页面

### Requirement: 添加/编辑衣物页面
系统 SHALL 提供衣物添加和编辑表单页面。

#### Scenario: 添加衣物表单
- **WHEN** 用户点击添加按钮
- **THEN** 显示空白的衣物表单

#### Scenario: 编辑衣物表单
- **WHEN** 用户编辑已有衣物
- **THEN** 表单预填充已有信息

#### Scenario: 图片上传
- **WHEN** 用户选择图片
- **THEN** 显示图片预览

#### Scenario: 房间选择
- **WHEN** 用户点击房间选择器
- **THEN** 显示用户的房间列表供选择

#### Scenario: 季节选择
- **WHEN** 用户点击季节选择器
- **THEN** 显示季节列表支持多选

### Requirement: 个人中心页面
系统 SHALL 提供用户个人中心页面。

#### Scenario: 显示用户信息
- **WHEN** 用户访问个人中心
- **THEN** 显示头像、用户名、邮箱等信息

#### Scenario: 编辑资料
- **WHEN** 用户点击编辑
- **THEN** 可以修改用户名和头像

#### Scenario: 退出登录
- **WHEN** 用户点击退出
- **THEN** 清除令牌并跳转到登录页

### Requirement: 房间管理页面
系统 SHALL 提供房间分类管理页面。

#### Scenario: 显示房间列表
- **WHEN** 用户访问房间管理
- **THEN** 显示用户创建的所有房间

#### Scenario: 添加房间
- **WHEN** 用户点击添加房间
- **THEN** 显示房间名称输入框

#### Scenario: 删除房间
- **WHEN** 用户删除房间
- **THEN** 确认后删除房间
