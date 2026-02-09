## ADDED Requirements

### Requirement: 获取当前用户信息
系统 SHALL 允许已登录用户获取自己的个人资料。

#### Scenario: 成功获取
- **WHEN** 已登录用户请求 GET /api/users/me
- **THEN** 系统返回用户的邮箱、用户名、头像等信息

### Requirement: 更新用户资料
系统 SHALL 允许用户更新自己的个人资料。

#### Scenario: 成功更新
- **WHEN** 用户提交新的用户名或其他资料
- **THEN** 系统更新并返回更新后的用户信息

#### Scenario: 用户名过长
- **WHEN** 用户提交超过100字符的用户名
- **THEN** 系统返回 400 错误

### Requirement: 更新头像
系统 SHALL 允许用户上传和更新头像图片。

#### Scenario: 成功上传头像
- **WHEN** 用户上传有效的图片文件（JPG、PNG、WebP）
- **THEN** 系统保存图片并更新用户头像 URL

#### Scenario: 文件格式不支持
- **WHEN** 用户上传非图片格式的文件
- **THEN** 系统返回 400 错误，提示不支持的格式

#### Scenario: 文件过大
- **WHEN** 用户上传超过 5MB 的图片
- **THEN** 系统返回 400 错误，提示文件过大
