## ADDED Requirements

### Requirement: 添加衣物
系统 SHALL 允许用户添加新的衣物到自己的衣帽间。

#### Scenario: 成功添加
- **WHEN** 用户提交衣物名称和可选的描述、颜色、尺码、品牌等信息
- **THEN** 系统创建衣物记录并返回衣物详情

#### Scenario: 名称为空
- **WHEN** 用户未提供衣物名称
- **THEN** 系统返回 400 错误，提示名称必填

#### Scenario: 关联房间
- **WHEN** 用户添加衣物时指定房间 ID
- **THEN** 系统将衣物关联到指定房间

#### Scenario: 关联季节
- **WHEN** 用户添加衣物时指定季节 ID 数组
- **THEN** 系统将衣物关联到指定的多个季节

### Requirement: 获取衣物列表
系统 SHALL 允许用户获取自己的衣物列表。

#### Scenario: 获取全部衣物
- **WHEN** 用户请求 GET /api/clothing 无筛选条件
- **THEN** 系统返回用户的所有衣物列表

#### Scenario: 分页获取
- **WHEN** 用户请求携带 page 和 limit 参数
- **THEN** 系统返回分页后的衣物列表和总数

### Requirement: 获取衣物详情
系统 SHALL 允许用户获取单个衣物的详细信息。

#### Scenario: 成功获取
- **WHEN** 用户请求自己的衣物详情
- **THEN** 系统返回衣物的完整信息，包含关联的房间和季节

#### Scenario: 衣物不存在
- **WHEN** 用户请求不存在的衣物 ID
- **THEN** 系统返回 404 错误

#### Scenario: 无权访问
- **WHEN** 用户请求他人的衣物
- **THEN** 系统返回 403 错误

### Requirement: 更新衣物
系统 SHALL 允许用户更新自己的衣物信息。

#### Scenario: 成功更新
- **WHEN** 用户提交衣物的更新信息
- **THEN** 系统更新并返回更新后的衣物详情

#### Scenario: 更新房间关联
- **WHEN** 用户修改衣物的房间 ID
- **THEN** 系统更新衣物的房间关联

#### Scenario: 更新季节关联
- **WHEN** 用户修改衣物的季节 ID 数组
- **THEN** 系统更新衣物的季节关联

### Requirement: 删除衣物
系统 SHALL 允许用户删除自己的衣物。

#### Scenario: 成功删除
- **WHEN** 用户请求删除自己的衣物
- **THEN** 系统删除衣物记录并返回成功

#### Scenario: 无权删除
- **WHEN** 用户尝试删除他人的衣物
- **THEN** 系统返回 403 错误

### Requirement: 衣物图片上传
系统 SHALL 允许用户为衣物上传图片。

#### Scenario: 成功上传
- **WHEN** 用户上传有效的图片文件
- **THEN** 系统保存图片并关联到衣物

#### Scenario: 创建时上传
- **WHEN** 用户创建衣物时同时上传图片
- **THEN** 系统创建衣物并关联图片
