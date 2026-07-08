# 激光雷达避障+跟踪调试指南

## 快速开始

### 环境准备检查清单

- [ ] 雷达USB插好，记录设备号（默认/dev/ttyUSB0）
- [ ] 底盘控制线连接
- [ ] 小车上电，连接ohcar热点
- [ ] VNC远程登录小车系统
- [ ] Docker容器启动并配置好

### 串口设备查看

```bash
# 查看所有USB设备
ls -l /dev/ttyUSB*

# 查看设备详细信息
dmesg | grep tty

# 给予串口权限
sudo chmod 777 /dev/ttyUSB0
```

## 分步调试流程

### 阶段1: 雷达数据测试（基础验证）

**目的**：确认雷达能正常工作，数据能正常接收

```bash
# 1. 单独启动雷达测试
ros2 launch lidar_tracking lidar_test_launch.py

# 2. 如果设备不是ttyUSB0，指定串口
ros2 launch lidar_tracking lidar_test_launch.py serial_port:=/dev/ttyUSB1

# 3. 查看雷达话题
ros2 topic list
ros2 topic echo /scan

# 4. 查看节点图
rqt_graph

# 5. 使用RViz可视化
ros2 run rviz2 rviz2
# 在RViz中：
# - Add -> LaserScan -> 选择/scan话题
# - Fixed Frame设置为 "laser_frame"
```

**预期输出**：
- 终端每1秒打印一次雷达数据统计
- 能看到前/后/左/右四个方向的最近障碍距离
- 有效数据点应该在200-500个之间

**常见问题**：
- **找不到设备**：检查USB连接，修改serial_port参数
- **权限错误**：运行 `sudo chmod 777 /dev/ttyUSB0`
- **数据全是inf**：检查雷达是否旋转，是否有遮挡物

---

### 阶段2: 底盘控制测试（运动验证）

**目的**：确认底盘能接收指令并正确运动

```bash
# 注意：确保小车有足够活动空间！

# 1. 启动底盘驱动（假设使用icar底盘）
ros2 run icar_driver icar_driver_node

# 2. 另一个终端，启动底盘测试
ros2 launch lidar_tracking chassis_test_launch.py

# 3. 或者手动发送测试指令
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}, angular: {z: 0.0}}"
```

**预期行为**：
- 前进2秒 → 停止
- 后退2秒 → 停止
- 左转2秒 → 停止
- 右转2秒 → 停止
- 前进+左转 → 停止
- 前进+右转 → 停止

**常见问题**：
- **小车不动**：检查底盘驱动是否启动，电机线是否松动
- **运动方向错误**：检查电机接线，可能需要反转某个轮子
- **速度过快/过慢**：修改测试脚本中的速度参数

---

### 阶段3: 避障功能调试

**目的**：验证避障逻辑，调整参数

```bash
# 1. 启动避障系统
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py

# 2. 自定义参数启动
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py \
    safe_distance:=0.6 \
    warning_distance:=1.2 \
    linear_speed:=0.3 \
    angular_speed:=0.6

# 3. 查看日志
ros2 topic echo /cmd_vel
```

**测试场景**：
1. **空旷环境**：小车应该直行
2. **单侧障碍**：放置纸箱在左侧/右侧，小车应向空旷侧转向
3. **正前方障碍**：小车应停止并选择左/右转向
4. **封闭环境**：小车应持续规避，不撞墙

**参数调优**：
- `safe_distance`: 太小容易撞，太大过于敏感（推荐0.4-0.6m）
- `warning_distance`: 提前减速距离（推荐0.8-1.2m）
- `linear_speed`: 前进速度，根据场地调整（0.15-0.3 m/s）
- `angular_speed`: 转向速度（0.4-0.8 rad/s）
- `front_angle_range`: 前方检测角度（20-40°）

---

### 阶段4: 跟踪功能调试

**目的**：验证目标跟踪逻辑，PID参数调优

```bash
# 1. 启动跟踪系统
ros2 launch lidar_tracking target_tracking_launch.py

# 2. 自定义参数
ros2 launch lidar_tracking target_tracking_launch.py \
    target_distance:=1.0 \
    min_detection_distance:=0.3 \
    max_detection_distance:=3.0 \
    linear_speed:=0.25 \
    angular_speed:=0.5

# 3. 查看目标信息
ros2 topic echo /target_info
```

**测试场景**：
1. **无目标**：小车应原地慢速旋转搜索
2. **目标过远**：小车应前进接近
3. **目标过近**：小车应后退
4. **目标左右移动**：小车应跟随转向
5. **多人环境**：小车应锁定最近目标

**PID参数调优**：

```bash
# 实时修改参数（需要安装rqt_reconfigure）
ros2 run rqt_reconfigure rqt_reconfigure
```

- `pid_kp_angular`: 角度控制比例系数（0.01-0.03）
- `pid_kd_angular`: 角度控制微分系数（0.005-0.02）
- `pid_kp_linear`: 距离控制比例系数（0.2-0.5）
- `pid_kd_linear`: 距离控制微分系数（0.05-0.2）

**调优技巧**：
- 震荡过大：降低Kp，增加Kd
- 响应太慢：增加Kp
- 稳定性差：增加Kd

---

## 常用调试命令

### 查看系统状态

```bash
# 查看所有话题
ros2 topic list

# 查看话题频率
ros2 topic hz /scan

# 查看话题详情
ros2 topic info /scan

# 查看节点
ros2 node list

# 查看节点信息
ros2 node info /obstacle_avoidance_node

# 查看参数
ros2 param list /obstacle_avoidance_node
ros2 param get /obstacle_avoidance_node safe_distance

# 动态修改参数
ros2 param set /obstacle_avoidance_node safe_distance 0.6
```

### 录制与回放

```bash
# 录制测试数据
ros2 bag record -a

# 录制特定话题
ros2 bag record /scan /cmd_vel

# 回放数据
ros2 bag play <bag文件>
```

### 性能监控

```bash
# 查看CPU占用
top

# 查看话题带宽
ros2 topic bw /scan

# 查看延迟
ros2 topic delay /scan
```

## 故障排查

### 雷达相关

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 找不到/dev/ttyUSB0 | USB未插好/设备号不对 | `ls -l /dev/ttyUSB*`检查 |
| Permission denied | 权限不足 | `sudo chmod 777 /dev/ttyUSB0` |
| 数据全是inf | 雷达被遮挡/未旋转 | 检查雷达硬件 |
| 数据跳变严重 | 接触不良 | 重新插拔USB |

### 底盘相关

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 小车不动 | 底盘驱动未启动 | 检查icar_driver是否运行 |
| 单轮不转 | 电机线松动 | 检查接线 |
| 方向错误 | 电机接线反了 | 调整接线或修改代码 |
| 速度异常 | 控制参数不对 | 调整速度参数 |

### ROS2相关

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 找不到包 | 未编译/未source | `colcon build && source install/setup.bash` |
| 节点崩溃 | 代码错误 | 查看终端错误信息 |
| 话题无数据 | 节点未启动/连接错误 | `rqt_graph`查看拓扑 |
| 延迟严重 | CPU占用过高 | 降低发布频率 |

## Docker容器快捷命令

```bash
# 进入容器
docker exec -it <容器名> bash

# 容器内刷新ROS2环境
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/setup.bash

# 快捷指令配置（添加到~/.bashrc）
alias is='source /opt/ros/humble/setup.bash && source ~/ros2_ws/install/setup.bash'
alias id='cd ~/ros2_ws'
alias ib='cd ~/ros2_ws && colcon build --symlink-install'
```

## 参数推荐值

### 避障参数

```yaml
safe_distance: 0.5          # 安全距离(m)
warning_distance: 1.0       # 警告距离(m)
linear_speed: 0.2           # 线速度(m/s)
angular_speed: 0.5          # 角速度(rad/s)
front_angle_range: 30.0     # 前方检测角度(°)
```

### 跟踪参数

```yaml
target_distance: 1.0              # 目标距离(m)
min_detection_distance: 0.2       # 最小检测距离(m)
max_detection_distance: 3.0       # 最大检测距离(m)
linear_speed: 0.2                 # 线速度(m/s)
angular_speed: 0.5                # 角速度(rad/s)
angle_tolerance: 10.0             # 角度容差(°)
distance_tolerance: 0.1           # 距离容差(m)
pid_kp_angular: 0.01              # 角度PID-P
pid_kd_angular: 0.005             # 角度PID-D
pid_kp_linear: 0.3                # 距离PID-P
pid_kd_linear: 0.1                # 距离PID-D
```
