# 读书打卡小程序

### 云开发配置说明

#### 集合名称

activity_list 
说明：活动基本信息
权限：所有用户可读，仅管理员可写

activity_content
说明：活动每日更新的内容
权限：所有用户可读，仅管理员可写

user_list
说明：保存用户个人信息
权限：仅创建者以及管理员可读写

activity_punch_data
说明：用户参加活动的具体数据
权限：所有用户可读，仅创建者及管理员可写

activity_users
说明：参与活动的数据
权限：所有用户可读，仅创建者及管理员可写

#### 云函数说明

login
说明：返回用户的数据
返回：event, openid, appid, unionid

punch
说明：返回用户打卡结果以及打卡数据

#### 字段说明

开始日期: activity_list {start_date}

结束日期: activity_list {end_state}

打卡总人数:  activity_punch_data {done: true} count

用户打卡次数：activity_punch_data {done: true} user_openid count

#### 流程说明

打开小程序
  call "login" cloud function
  save openid to storage or gloabl date

打开打卡页面：
  读取活动开始、结束时间，计算：第一天了？ 活动是否已结束？
  
  用户openid查询，用户打卡次数,

点击打卡：
  用户申请打卡，如果新增打卡：




