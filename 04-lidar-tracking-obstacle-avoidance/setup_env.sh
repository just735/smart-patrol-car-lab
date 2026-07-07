#!/bin/bash
# Docker容器环境快速配置脚本

echo "========================================="
echo "Docker容器ROS2环境配置"
echo "========================================="

# 添加快捷命令到bashrc
BASHRC_FILE="$HOME/.bashrc"

echo "正在配置快捷命令..."

# 检查是否已配置
if ! grep -q "# ROS2 Quick Commands" "$BASHRC_FILE"; then
    cat >> "$BASHRC_FILE" << 'EOF'

# ROS2 Quick Commands
alias is='source /opt/ros/humble/setup.bash && source ~/ros2_ws/install/setup.bash'
alias id='cd ~/ros2_ws'
alias ib='cd ~/ros2_ws && colcon build --symlink-install'
alias ic='cd ~/ros2_ws && rm -rf build install log'
alias it='ros2 topic list'
alias in='ros2 node list'

# 激光雷达快捷命令
alias n1='ros2 run icar_driver icar_driver_node'
alias n2='ros2 launch sllidar_ros2 sllidar_launch.py'
alias n3='ros2 launch lidar_obstacle_avoidance obstacle_avoidance_launch.py'
alias n4='ros2 launch lidar_tracking target_tracking_launch.py'
alias n5='ros2 launch lidar_tracking lidar_test_launch.py'
alias n6='ros2 launch lidar_tracking chassis_test_launch.py'

echo "ROS2环境已加载"
EOF
    echo "快捷命令已添加到 ~/.bashrc"
else
    echo "快捷命令已存在，跳过配置"
fi

echo ""
echo "========================================="
echo "配置完成！请执行以下命令重新加载："
echo "  source ~/.bashrc"
echo "========================================="
echo ""
echo "可用快捷命令："
echo "  is  - 刷新ROS2环境"
echo "  id  - 进入工作空间目录"
echo "  ib  - 编译工作空间"
echo "  ic  - 清理编译文件"
echo "  it  - 查看话题列表"
echo "  in  - 查看节点列表"
echo ""
echo "启动命令："
echo "  n1  - 启动底盘驱动"
echo "  n2  - 启动雷达驱动"
echo "  n3  - 启动避障功能"
echo "  n4  - 启动跟踪功能"
echo "  n5  - 启动雷达测试"
echo "  n6  - 启动底盘测试"
echo ""
