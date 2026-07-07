#!/bin/bash
# ROS2工作空间快速编译脚本

set -e

echo "========================================="
echo "开始编译激光雷达避障+跟踪功能包"
echo "========================================="

# 检查是否在ROS2环境中
if [ -z "$ROS_DISTRO" ]; then
    echo "错误：未检测到ROS2环境"
    echo "请先执行: source /opt/ros/humble/setup.bash"
    exit 1
fi

echo "当前ROS2版本: $ROS_DISTRO"

# 进入工作空间根目录
if [ ! -d "lidar_obstacle_avoidance" ] || [ ! -d "lidar_tracking" ]; then
    echo "错误：请在包含lidar_obstacle_avoidance和lidar_tracking的目录下运行此脚本"
    exit 1
fi

# 创建临时工作空间
TEMP_WS=$(mktemp -d)/ros2_ws
mkdir -p $TEMP_WS/src

echo "创建临时工作空间: $TEMP_WS"

# 复制功能包到工作空间
cp -r lidar_obstacle_avoidance $TEMP_WS/src/
cp -r lidar_tracking $TEMP_WS/src/

# 进入工作空间
cd $TEMP_WS

echo "开始编译..."
colcon build --symlink-install

if [ $? -eq 0 ]; then
    echo "========================================="
    echo "编译成功！"
    echo "========================================="
    echo ""
    echo "请执行以下命令加载环境："
    echo "  source $TEMP_WS/install/setup.bash"
    echo ""
    echo "然后可以运行："
    echo "  ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py"
    echo "  ros2 launch lidar_tracking target_tracking_launch.py"
    echo "  ros2 launch lidar_tracking lidar_test_launch.py"
    echo ""
else
    echo "编译失败，请检查错误信息"
    exit 1
fi
