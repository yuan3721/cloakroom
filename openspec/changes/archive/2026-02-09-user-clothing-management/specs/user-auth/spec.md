## ADDED Requirements

### Requirement: 用户注册
系统 SHALL 允许新用户通过邮箱和密码注册账户。

#### Scenario: 成功注册
- **WHEN** 用户提交有效的邮箱和密码（至少8位）
- **THEN** 系统创建新用户账户并返回 JWT 令牌

#### Scenario: 邮箱已存在
- **WHEN** 用户提交的邮箱已被注册
- **THEN** 系统返回 409 错误，提示邮箱已存在

#### Scenario: 密码不符合要求
- **WHEN** 用户提交的密码少于8位
- **THEN** 系统返回 400 错误，提示密码要求

### Requirement: 用户登录
系统 SHALL 允许已注册用户通过邮箱和密码登录。

#### Scenario: 成功登录
- **WHEN** 用户提交正确的邮箱和密码
- **THEN** 系统返回 JWT 访问令牌和刷新令牌

#### Scenario: 密码错误
- **WHEN** 用户提交的密码不正确
- **THEN** 系统返回 401 错误，提示凭据无效

#### Scenario: 用户不存在
- **WHEN** 用户提交的邮箱未注册
- **THEN** 系统返回 401 错误，提示凭据无效

### Requirement: 令牌刷新
系统 SHALL 允许用户使用刷新令牌获取新的访问令牌。

#### Scenario: 成功刷新
- **WHEN** 用户提交有效的刷新令牌
- **THEN** 系统返回新的访问令牌

#### Scenario: 刷新令牌过期
- **WHEN** 用户提交过期的刷新令牌
- **THEN** 系统返回 401 错误，要求重新登录

### Requirement: 密码安全存储
系统 SHALL 使用 bcrypt 对用户密码进行加密存储。

#### Scenario: 密码加密
- **WHEN** 用户注册或修改密码
- **THEN** 系统使用 bcrypt（salt rounds >= 10）加密后存储

### Requirement: JWT 认证中间件
系统 SHALL 提供认证中间件保护需要登录的 API。

#### Scenario: 有效令牌访问
- **WHEN** 请求携带有效的 JWT 访问令牌
- **THEN** 允许访问受保护的资源

#### Scenario: 无令牌访问
- **WHEN** 请求未携带 JWT 令牌
- **THEN** 系统返回 401 错误

#### Scenario: 令牌过期
- **WHEN** 请求携带过期的 JWT 令牌
- **THEN** 系统返回 401 错误，提示令牌过期
