#!/usr/bin/env python3
"""
激光雷达测试工具 - 单独启动雷达查看数据
"""

from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch_ros.parameter_descriptions import ParameterValue
from launch.substitutions import LaunchConfiguration


def generate_launch_description():
    return LaunchDescription([
        DeclareLaunchArgument(
            'serial_port',
            default_value='/dev/ttyUSB0',
            description='激光雷达串口设备路径'
        ),
        DeclareLaunchArgument(
            'serial_baudrate',
            default_value='115200',
            description='激光雷达串口波特率'
        ),

        # 启动雷达驱动
        Node(
            package='sllidar_ros2',
            executable='sllidar_node',
            name='sllidar_node',
            parameters=[{
                'serial_port': LaunchConfiguration('serial_port'),
                'serial_baudrate': ParameterValue(LaunchConfiguration('serial_baudrate'), value_type=int),
                'frame_id': 'laser_frame',
                'angle_compensate': True,
                'scan_mode': 'Standard'
            }],
            output='screen'
        ),

        # 启动测试节点
        Node(
            package='lidar_tracking',
            executable='lidar_test_node',
            name='lidar_test_node',
            output='screen'
        ),
    ])
