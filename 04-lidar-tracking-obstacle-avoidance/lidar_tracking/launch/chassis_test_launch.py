#!/usr/bin/env python3
"""
底盘测试工具 - 单独测试底盘运动
"""

from launch import LaunchDescription
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        # 启动底盘测试节点
        Node(
            package='lidar_tracking',
            executable='chassis_test_node',
            name='chassis_test_node',
            output='screen'
        ),
    ])
