# 基于激光雷达的跟踪及避障系统

本项目实现了基于思岚A1激光雷达的目标跟踪和障碍物避障功能，使用ROS2框架开发。

## 项目结构

```
.
├── lidar_obstacle_avoidance/      # 激光雷达避障功能包
│   ├── lidar_obstacle_avoidance/
│   │   ├── __init__.py
│   │   └── obstacle_avoidance_node.py
│   ├── launch/
│   │   └── obstacle_avoidance_launch.py
│   ├── resource/
│   │   └── lidar_obstacle_avoidance
│   ├── package.xml
│   └── setup.py
│
├── lidar_tracking/                # 激光雷达目标跟踪功能包
│   ├── lidar_tracking/
│   │   ├── __init__.py
│   │   ├── target_tracking_node.py    # 目标跟踪节点
│   │   ├── pid_controller.py          # PID控制器
│   │   ├── lidar_test_node.py         # 雷达数据测试节点
│   │   └── chassis_test_node.py       # 底盘控制测试节点
│   ├── launch/
│   │   ├── target_tracking_launch.py
│   │   ├── lidar_test_launch.py       # 雷达测试启动文件
│   │   └── chassis_test_launch.py     # 底盘测试启动文件
│   ├── resource/
│   │   └── lidar_tracking
│   ├── package.xml
│   └── setup.py
│
├── DEBUGGING_GUIDE.md             # 详细调试指南
├── QUICK_START.md                 # 快速启动手册
├── build.sh                       # 快速编译脚本
├── setup_env.sh                   # 环境配置脚本
└── README.md
```

## 功能特性

### 1. 激光雷达避障 (lidar_obstacle_avoidance)

- **功能描述**: 实时监测前方、左侧、右侧的障碍物，自动避障
- **避障策略**:
  - 前方障碍物距离 < 安全距离(0.5m): 停止并转向
  - 前方障碍物距离 < 警告距离(1.0m): 减速并微调方向
  - 无障碍物: 正常前进
- **转向策略**: 比较左右两侧空间，优先向空间较大的一侧转向

**可配置参数**:
- `safe_distance`: 安全停止距离 (默认: 0.5m)
- `warning_distance`: 警告减速距离 (默认: 1.0m)
- `linear_speed`: 线速度 (默认: 0.2 m/s)
- `angular_speed`: 角速度 (默认: 0.5 rad/s)
- `front_angle_range`: 前方检测角度范围 (默认: 30°)

### 2. 激光雷达目标跟踪 (lidar_tracking)

- **功能描述**: 自动检测并跟踪最近的目标物体，保持设定距离
- **跟踪策略**:
  - 搜索模式: 未检测到目标时，原地旋转搜索
  - 对准模式: 调整角度对准目标
  - 接近模式: 前进或后退以保持目标距离
  - 保持模式: 到达目标位置后停止
- **控制方式**: 使用PID控制器实现平滑跟踪，减少震荡
- **目标信息发布**: 通过`/target_info`话题发布目标的距离、角度、坐标等信息

**可配置参数**:
- `min_detection_distance`: 最小检测距离 (默认: 0.2m)
- `max_detection_distance`: 最大检测距离 (默认: 3.0m)
- `target_distance`: 目标跟踪距离 (默认: 1.0m)
- `linear_speed`: 线速度 (默认: 0.2 m/s)
- `angular_speed`: 角速度 (默认: 0.5 rad/s)
- `angle_tolerance`: 角度容差 (默认: 10°)
- `distance_tolerance`: 距离容差 (默认: 0.1m)
- `pid_kp_angular`: 角度PID比例系数 (默认: 0.01)
- `pid_kd_angular`: 角度PID微分系数 (默认: 0.005)
- `pid_kp_linear`: 距离PID比例系数 (默认: 0.3)
- `pid_kd_linear`: 距离PID微分系数 (默认: 0.1)

### 3. 调试测试工具

**雷达数据测试** (`lidar_test_node`):
- 实时打印雷达扫描数据统计
- 显示前/后/左/右四个方向的最近障碍距离
- 用于验证雷达硬件是否正常工作

**底盘控制测试** (`chassis_test_node`):
- 自动测试前进、后退、左转、右转等动作
- 验证底盘驱动是否正常响应
- 用于调试底盘硬件和驱动

## 环境要求

- **操作系统**: Ubuntu 20.04/22.04
- **ROS版本**: ROS2 Foxy/Humble/Galactic
- **Python版本**: Python 3.8+
- **硬件**: 思岚A1激光雷达

## 安装步骤

### 1. 安装ROS2

参考官方文档: https://docs.ros.org/en/humble/Installation.html

### 2. 创建工作空间

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
```

### 3. 复制代码到工作空间

```bash
# 复制思岚雷达驱动
cp -r "1 思岚A1激光雷达简介及使用/源码/sllidar_ros2/sllidar_ros2-main" ~/ros2_ws/src/sllidar_ros2

# 复制避障和跟踪功能包
cp -r lidar_obstacle_avoidance ~/ros2_ws/src/
cp -r lidar_tracking ~/ros2_ws/src/
```

### 4. 安装依赖

```bash
cd ~/ros2_ws
rosdep install --from-paths src --ignore-src -r -y
```

### 5. 编译

```bash
cd ~/ros2_ws
source /opt/ros/humble/setup.bash  # 根据你的ROS版本修改
colcon build --symlink-install
```

### 6. 配置环境

```bash
source ~/ros2_ws/install/setup.bash

# 可选: 添加到.bashrc以便自动加载
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc
```

### 7. 配置雷达设备权限

```bash
# 临时方法
sudo chmod 777 /dev/ttyUSB0

# 永久方法: 创建udev规则
cd ~/ros2_ws/src/sllidar_ros2
source scripts/create_udev_rules.sh
```

## 使用方法

### 快速开始

**首次使用，配置环境：**

```bash
# 在Docker容器中执行
cd /path/to/04-lidar-tracking-obstacle-avoidance
./setup_env.sh
source ~/.bashrc
```

**详细说明请查看：**
- [QUICK_START.md](QUICK_START.md) - 快速启动指令手册
- [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) - 完整调试指南

### 单独测试功能

#### 测试雷达数据
```bash
# 启动雷达+测试节点
ros2 launch lidar_tracking lidar_test_launch.py

# 或使用快捷命令
n5
```

#### 测试底盘控制
```bash
# 终端1: 启动底盘驱动
n1

# 终端2: 启动测试序列
ros2 launch lidar_tracking chassis_test_launch.py
# 或
n6
```

### 启动避障功能

```bash
# 使用默认参数
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py

# 自定义参数
ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py \
    safe_distance:=0.6 \
    warning_distance:=1.2 \
    linear_speed:=0.3 \
  angular_speed:=0.6 \
  serial_port:=/dev/ttyUSB1 \
  serial_baudrate:=115200 \
  scan_mode:=Standard
```

### 启动跟踪功能

```bash
# 使用默认参数
ros2 launch lidar_tracking target_tracking_launch.py

# 自定义参数
ros2 launch lidar_tracking target_tracking_launch.py \
    target_distance:=1.5 \
    min_detection_distance:=0.3 \
    max_detection_distance:=4.0 \
    linear_speed:=0.25 \
  angular_speed:=0.4 \
  serial_port:=/dev/ttyUSB1 \
  serial_baudrate:=115200 \
  scan_mode:=Standard
```

### 查看话题

```bash
# 查看激光雷达扫描数据
ros2 topic echo /scan

# 查看速度控制命令
ros2 topic echo /cmd_vel

# 查看目标信息 (仅跟踪模式)
ros2 topic echo /target_info
```

### 使用RViz可视化

```bash
# 启动RViz
ros2 run rviz2 rviz2

# 添加LaserScan显示
# 1. 点击Add -> By topic -> /scan -> LaserScan
# 2. 设置Fixed Frame为 "laser_frame"
```

## 测试建议

### 避障功能测试

1. 将雷达放置在开阔区域
2. 启动避障节点
3. 在前方放置障碍物（如纸箱、椅子）
4. 观察机器人是否能检测并避开障碍物

### 跟踪功能测试

1. 启动跟踪节点
2. 在雷达检测范围内放置一个目标物体
3. 观察机器人是否能:
   - 找到并对准目标
   - 接近目标到设定距离
   - 保持与目标的距离

## 常见问题

### 1. 找不到串口设备 `/dev/ttyUSB0`

```bash
# 查看串口设备
ls -l /dev/ttyUSB*

# 如果是其他设备名，修改launch文件中的serial_port参数
```

### 2. 权限不足

```bash
sudo chmod 777 /dev/ttyUSB0
# 或添加当前用户到dialout组
sudo usermod -a -G dialout $USER
```

### 3. 波特率错误

思岚A1雷达默认波特率为115200，如果连接失败，尝试其他波特率：
- A1: 115200
- A2: 256000
- A3: 256000

### 4. 节点无法启动

```bash
# 检查ROS2环境
echo $ROS_DISTRO

# 重新source工作空间
source ~/ros2_ws/install/setup.bash

# 检查包是否正确安装
ros2 pkg list | grep lidar
```

## 参考文档

- 思岚A1激光雷达官方文档: http://www.slamtec.com/
- ROS2官方文档: https://docs.ros.org/en/humble/
- RPLIDAR ROS包: http://wiki.ros.org/rplidar

## 许可证

MIT License

## 作者

大三小学期项目 - 基于激光雷达跟踪及避障
