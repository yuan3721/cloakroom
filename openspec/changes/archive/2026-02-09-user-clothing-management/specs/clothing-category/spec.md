## ADDED Requirements

### Requirement: 房间管理
系统 SHALL 允许用户创建和管理自定义房间分类。

#### Scenario: 创建房间
- **WHEN** 用户提交房间名称
- **THEN** 系统创建房间并返回房间信息

#### Scenario: 获取房间列表
- **WHEN** 用户请求 GET /api/rooms
- **THEN** 系统返回用户的所有房间列表

#### Scenario: 更新房间
- **WHEN** 用户更新房间名称或图标
- **THEN** 系统更新并返回更新后的房间信息

#### Scenario: 删除房间
- **WHEN** 用户删除房间
- **THEN** 系统删除房间，关联衣物的房间字段设为空

#### Scenario: 房间名称重复
- **WHEN** 用户创建已存在的房间名称
- **THEN** 系统返回 409 错误

### Requirement: 季节分类
系统 SHALL 提供系统预设的季节分类。

#### Scenario: 获取季节列表
- **WHEN** 用户请求 GET /api/seasons
- **THEN** 系统返回春、夏、秋、冬四个季节

#### Scenario: 季节为系统预设
- **WHEN** 系统初始化
- **THEN** 自动创建春、夏、秋、冬四个季节记录

### Requirement: 衣物关联房间
系统 SHALL 允许每件衣物关联一个房间。

#### Scenario: 设置房间
- **WHEN** 用户为衣物设置房间
- **THEN** 系统建立衣物与房间的关联

#### Scenario: 取消房间关联
- **WHEN** 用户将衣物的房间设为空
- **THEN** 系统移除衣物的房间关联

### Requirement: 衣物关联季节
系统 SHALL 允许每件衣物关联多个季节。

#### Scenario: 设置多个季节
- **WHEN** 用户为衣物设置多个季节
- **THEN** 系统建立衣物与多个季节的关联

#### Scenario: 更新季节关联
- **WHEN** 用户修改衣物的季节列表
- **THEN** 系统更新衣物的季节关联（替换原有关联）
