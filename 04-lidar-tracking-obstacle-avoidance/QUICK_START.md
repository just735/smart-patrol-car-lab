# 快速启动指令手册

## 环境配置（首次使用）

```bash
# 1. 进入Docker容器
docker exec -it <容器名> bash

# 2. 配置环境快捷命令
cd /path/to/04-lidar-tracking-obstacle-avoidance
./setup_env.sh
source ~/.bashrc

# 3. 检查串口设备
ls -l /dev/ttyUSB*
sudo chmod 777 /dev/ttyUSB0
```

## 单独功能测试

### 1. 雷达数据测试
```bash
# 终端1：启动雷达+测试节点
n5
# 或
ros2 launch lidar_tracking lidar_test_launch.py

# 查看输出：每秒打印雷达数据统计
```

### 2. 底盘控制测试
```bash
# 终端1：启动底盘驱动
n1
# 或
ros2 run icar_driver icar_driver_node

# 终端2：启动测试序列
n6
# 或
ros2 launch lidar_tracking chassis_test_launch.py
```

### 3. 避障功能测试
```bash
# 终端1：启动避障系统（包含雷达+避障节点）
n3
# 或
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py

# 自定义参数启动
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py \
    safe_distance:=0.6 \
    warning_distance:=1.2 \
    linear_speed:=0.3
```

### 4. 跟踪功能测试
```bash
# 终端1：启动跟踪系统（包含雷达+跟踪节点）
n4
# 或
ros2 launch lidar_tracking target_tracking_launch.py

# 自定义参数启动
ros2 launch lidar_tracking target_tracking_launch.py \
    target_distance:=1.0 \
    linear_speed:=0.25
```

## 组合运行（完整系统）

### 方式1：分步启动（推荐调试用）

```bash
# 终端1：底盘驱动
n1

# 终端2：雷达驱动
n2

# 终端3：避障功能
ros2 run lidar_obstacle_avoidance obstacle_avoidance_node

# 或者：跟踪功能
ros2 run lidar_tracking target_tracking_node
```

### 方式2：Launch一键启动（推荐正式运行）

```bash
# 避障模式
n3

# 跟踪模式
n4
```

## 常用调试命令

```bash
# 查看话题
it    # 等同于 ros2 topic list
ros2 topic echo /scan
ros2 topic echo /cmd_vel
ros2 topic echo /target_info

# 查看节点
in    # 等同于 ros2 node list

# 查看节点图
rqt_graph

# 可视化雷达数据
ros2 run rviz2 rviz2

# 实时调参（如果安装了rqt_reconfigure）
ros2 run rqt_reconfigure rqt_reconfigure

# 查看参数
ros2 param list /obstacle_avoidance_node
ros2 param get /obstacle_avoidance_node safe_distance

# 动态修改参数
ros2 param set /obstacle_avoidance_node safe_distance 0.7
```

## 快捷命令列表

| 命令 | 功能 |
|------|------|
| `is` | 刷新ROS2环境 |
| `id` | 进入工作空间 |
| `ib` | 编译工作空间 |
| `ic` | 清理编译文件 |
| `it` | 查看话题列表 |
| `in` | 查看节点列表 |
| `n1` | 启动底盘驱动 |
| `n2` | 启动雷达驱动 |
| `n3` | 启动避障功能 |
| `n4` | 启动跟踪功能 |
| `n5` | 启动雷达测试 |
| `n6` | 启动底盘测试 |

## 故障快速排查

```bash
# 1. 检查ROS2环境
echo $ROS_DISTRO
is

# 2. 检查串口设备
ls -l /dev/ttyUSB*
sudo chmod 777 /dev/ttyUSB0

# 3. 检查节点是否运行
in

# 4. 检查话题是否发布
it
ros2 topic hz /scan

# 5. 查看节点日志
ros2 node info /obstacle_avoidance_node

# 6. 重新编译
id
ic
ib
is
```

## 停止运行

```bash
# 按 Ctrl+C 停止当前节点

# 如果需要紧急停止小车
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.0}, angular: {z: 0.0}}"
```

## 参数调优建议

### 避障参数

- **safe_distance** (0.4-0.7m): 越小越灵活，越大越保守
- **warning_distance** (0.8-1.5m): 提前减速距离
- **linear_speed** (0.15-0.3 m/s): 根据场地大小调整
- **angular_speed** (0.4-0.8 rad/s): 转向灵敏度

### 跟踪参数

- **target_distance** (0.8-1.5m): 期望保持的跟踪距离
- **pid_kp_angular** (0.01-0.03): 角度响应速度
- **pid_kd_angular** (0.005-0.02): 角度稳定性
- **pid_kp_linear** (0.2-0.5): 距离响应速度
- **pid_kd_linear** (0.05-0.2): 距离稳定性
