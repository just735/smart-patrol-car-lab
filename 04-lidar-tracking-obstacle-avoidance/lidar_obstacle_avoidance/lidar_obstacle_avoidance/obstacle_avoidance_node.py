#!/usr/bin/env python3
"""
激光雷达避障节点
功能：订阅激光雷达扫描数据，检测障碍物，发布避障控制命令
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist
import math


class ObstacleAvoidanceNode(Node):
    def __init__(self):
        super().__init__('obstacle_avoidance_node')

        self.declare_parameter('safe_distance', 0.5)
        self.declare_parameter('warning_distance', 1.0)
        self.declare_parameter('linear_speed', 0.2)
        self.declare_parameter('angular_speed', 0.5)
        self.declare_parameter('front_angle_range', 30.0)

        self.safe_distance = self.get_parameter('safe_distance').value
        self.warning_distance = self.get_parameter('warning_distance').value
        self.linear_speed = self.get_parameter('linear_speed').value
        self.angular_speed = self.get_parameter('angular_speed').value
        self.front_angle_range = self.get_parameter('front_angle_range').value

        self.scan_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        self.get_logger().info('障碍物避障节点已启动')
        self.get_logger().info(f'安全距离: {self.safe_distance}m, 警告距离: {self.warning_distance}m')

    def scan_callback(self, msg: LaserScan):
        """处理激光雷达扫描数据"""
        ranges = msg.ranges
        angle_min = msg.angle_min
        angle_increment = msg.angle_increment

        # 数据有效性检查
        if len(ranges) == 0:
            self.get_logger().warn('接收到空的雷达数据', throttle_duration_sec=5.0)
            return

        front_ranges = []
        left_ranges = []
        right_ranges = []

        for i, distance in enumerate(ranges):
            # 过滤无效数据
            if math.isinf(distance) or math.isnan(distance) or distance < 0.1:
                continue

            angle_deg = math.degrees(angle_min + i * angle_increment)
            angle_deg = (angle_deg + 360) % 360

            # 前方扇区：±front_angle_range度
            if angle_deg <= self.front_angle_range or angle_deg >= (360 - self.front_angle_range):
                front_ranges.append(distance)
            # 左侧扇区：30-150度
            elif 30 < angle_deg <= 150:
                left_ranges.append(distance)
            # 右侧扇区：210-330度
            elif 210 < angle_deg < 330:
                right_ranges.append(distance)

        min_front = min(front_ranges) if front_ranges else float('inf')
        min_left = min(left_ranges) if left_ranges else float('inf')
        min_right = min(right_ranges) if right_ranges else float('inf')

        self.get_logger().info(
            f'前方: {min_front:.2f}m, 左侧: {min_left:.2f}m, 右侧: {min_right:.2f}m',
            throttle_duration_sec=1.0
        )

        cmd = Twist()

        # 避障逻辑
        if min_front < self.safe_distance:
            # 危险区域：停止并转向
            self.get_logger().warn(f'前方障碍物过近！距离: {min_front:.2f}m')
            cmd.linear.x = 0.0

            # 选择空间更大的方向转向
            if min_left > min_right:
                cmd.angular.z = self.angular_speed
                self.get_logger().info('向左转避障')
            else:
                cmd.angular.z = -self.angular_speed
                self.get_logger().info('向右转避障')

        elif min_front < self.warning_distance:
            # 警告区域：减速并微调方向
            self.get_logger().info(f'前方有障碍物，减速。距离: {min_front:.2f}m')
            cmd.linear.x = self.linear_speed * 0.5

            # 微调方向
            if min_left > min_right:
                cmd.angular.z = self.angular_speed * 0.3
            else:
                cmd.angular.z = -self.angular_speed * 0.3
        else:
            # 安全区域：正常前进
            cmd.linear.x = self.linear_speed
            cmd.angular.z = 0.0

        self.cmd_vel_pub.publish(cmd)


def main(args=None):
    rclpy.init(args=args)
    node = ObstacleAvoidanceNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
