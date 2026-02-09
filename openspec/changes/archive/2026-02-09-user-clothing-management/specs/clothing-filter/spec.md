## ADDED Requirements

### Requirement: 按房间筛选
系统 SHALL 允许用户按房间筛选衣物列表。

#### Scenario: 筛选单个房间
- **WHEN** 用户请求 GET /api/clothing?roomId=xxx
- **THEN** 系统返回指定房间的衣物列表

#### Scenario: 筛选无房间衣物
- **WHEN** 用户请求 GET /api/clothing?roomId=null
- **THEN** 系统返回未分配房间的衣物列表

### Requirement: 按季节筛选
系统 SHALL 允许用户按季节筛选衣物列表。

#### Scenario: 筛选单个季节
- **WHEN** 用户请求 GET /api/clothing?seasonId=xxx
- **THEN** 系统返回包含指定季节的衣物列表

#### Scenario: 筛选多个季节
- **WHEN** 用户请求 GET /api/clothing?seasonIds=xxx,yyy
- **THEN** 系统返回包含任意指定季节的衣物列表

### Requirement: 组合筛选
系统 SHALL 支持同时按房间和季节筛选衣物。

#### Scenario: 房间和季节组合
- **WHEN** 用户请求 GET /api/clothing?roomId=xxx&seasonId=yyy
- **THEN** 系统返回同时满足房间和季节条件的衣物列表

### Requirement: 搜索衣物
系统 SHALL 支持按名称模糊搜索衣物。

#### Scenario: 名称搜索
- **WHEN** 用户请求 GET /api/clothing?search=关键词
- **THEN** 系统返回名称包含关键词的衣物列表

#### Scenario: 搜索与筛选组合
- **WHEN** 用户同时使用搜索和筛选条件
- **THEN** 系统返回同时满足所有条件的衣物列表

### Requirement: 排序
系统 SHALL 支持对衣物列表进行排序。

#### Scenario: 按创建时间排序
- **WHEN** 用户请求 GET /api/clothing?sort=createdAt&order=desc
- **THEN** 系统返回按创建时间降序排列的衣物列表

#### Scenario: 按名称排序
- **WHEN** 用户请求 GET /api/clothing?sort=name&order=asc
- **THEN** 系统返回按名称升序排列的衣物列表
