#!/usr/bin/env python3
"""
激光雷达目标跟踪系统启动文件
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
        DeclareLaunchArgument(
            'scan_mode',
            default_value='Standard',
            description='激光雷达扫描模式'
        ),
        DeclareLaunchArgument(
            'target_distance',
            default_value='1.0',
            description='目标跟踪距离(米)'
        ),
        DeclareLaunchArgument(
            'min_detection_distance',
            default_value='0.2',
            description='最小检测距离(米)'
        ),
        DeclareLaunchArgument(
            'max_detection_distance',
            default_value='3.0',
            description='最大检测距离(米)'
        ),
        DeclareLaunchArgument(
            'linear_speed',
            default_value='0.2',
            description='线速度(米/秒)'
        ),
        DeclareLaunchArgument(
            'angular_speed',
            default_value='0.5',
            description='角速度(弧度/秒)'
        ),

        Node(
            package='sllidar_ros2',
            executable='sllidar_node',
            name='sllidar_node',
            parameters=[{
                'serial_port': LaunchConfiguration('serial_port'),
                'serial_baudrate': ParameterValue(LaunchConfiguration('serial_baudrate'), value_type=int),
                'frame_id': 'laser_frame',
                'angle_compensate': True,
                'scan_mode': LaunchConfiguration('scan_mode')
            }],
            output='screen'
        ),

        Node(
            package='lidar_tracking',
            executable='target_tracking_node',
            name='target_tracking_node',
            parameters=[{
                'target_distance': LaunchConfiguration('target_distance'),
                'min_detection_distance': LaunchConfiguration('min_detection_distance'),
                'max_detection_distance': LaunchConfiguration('max_detection_distance'),
                'linear_speed': LaunchConfiguration('linear_speed'),
                'angular_speed': LaunchConfiguration('angular_speed'),
                'angle_tolerance': 10.0,
                'distance_tolerance': 0.1
            }],
            output='screen'
        ),
    ])
