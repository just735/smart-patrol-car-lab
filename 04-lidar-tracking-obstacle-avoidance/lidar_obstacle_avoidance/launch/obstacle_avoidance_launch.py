#!/usr/bin/env python3
"""
激光雷达避障系统启动文件
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
            'safe_distance',
            default_value='0.5',
            description='安全停止距离(米)'
        ),
        DeclareLaunchArgument(
            'warning_distance',
            default_value='1.0',
            description='警告减速距离(米)'
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
            package='lidar_obstacle_avoidance',
            executable='obstacle_avoidance_node',
            name='obstacle_avoidance_node',
            parameters=[{
                'safe_distance': LaunchConfiguration('safe_distance'),
                'warning_distance': LaunchConfiguration('warning_distance'),
                'linear_speed': LaunchConfiguration('linear_speed'),
                'angular_speed': LaunchConfiguration('angular_speed'),
                'front_angle_range': 30.0
            }],
            output='screen'
        ),
    ])
