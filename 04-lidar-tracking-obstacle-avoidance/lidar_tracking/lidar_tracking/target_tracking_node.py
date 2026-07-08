#!/usr/bin/env python3
"""
激光雷达目标跟踪节点
功能：订阅激光雷达扫描数据，检测并跟踪最近的目标物体
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist, Point
from std_msgs.msg import String
import math
import json
from .pid_controller import PIDController


class TargetTrackingNode(Node):
    def __init__(self):
        super().__init__('target_tracking_node')

        self.declare_parameter('min_detection_distance', 0.2)
        self.declare_parameter('max_detection_distance', 3.0)
        self.declare_parameter('target_distance', 1.0)
        self.declare_parameter('linear_speed', 0.2)
        self.declare_parameter('angular_speed', 0.5)
        self.declare_parameter('angle_tolerance', 10.0)
        self.declare_parameter('distance_tolerance', 0.1)
        self.declare_parameter('pid_kp_angular', 0.01)
        self.declare_parameter('pid_kd_angular', 0.005)
        self.declare_parameter('pid_kp_linear', 0.3)
        self.declare_parameter('pid_kd_linear', 0.1)

        self.min_distance = self.get_parameter('min_detection_distance').value
        self.max_distance = self.get_parameter('max_detection_distance').value
        self.target_distance = self.get_parameter('target_distance').value
        self.linear_speed = self.get_parameter('linear_speed').value
        self.angular_speed = self.get_parameter('angular_speed').value
        self.angle_tolerance = self.get_parameter('angle_tolerance').value
        self.distance_tolerance = self.get_parameter('distance_tolerance').value

        # PID控制器
        pid_kp_angular = self.get_parameter('pid_kp_angular').value
        pid_kd_angular = self.get_parameter('pid_kd_angular').value
        pid_kp_linear = self.get_parameter('pid_kp_linear').value
        pid_kd_linear = self.get_parameter('pid_kd_linear').value

        self.angular_pid = PIDController(pid_kp_angular, 0.0, pid_kd_angular,
                                          output_min=-self.angular_speed,
                                          output_max=self.angular_speed)
        self.linear_pid = PIDController(pid_kp_linear, 0.0, pid_kd_linear,
                                         output_min=-self.linear_speed,
                                         output_max=self.linear_speed)

        self.scan_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.target_pub = self.create_publisher(String, '/target_info', 10)

        self.target_found = False
        self.target_angle = 0.0
        self.target_dist = 0.0

        self.get_logger().info('目标跟踪节点已启动')
        self.get_logger().info(f'目标距离: {self.target_distance}m, 检测范围: {self.min_distance}-{self.max_distance}m')

    def scan_callback(self, msg: LaserScan):
        """处理激光雷达扫描数据"""
        ranges = msg.ranges
        angle_min = msg.angle_min
        angle_increment = msg.angle_increment

        min_distance = float('inf')
        min_angle = 0.0
        target_index = -1

        for i, distance in enumerate(ranges):
            if math.isinf(distance) or math.isnan(distance):
                continue

            if self.min_distance <= distance <= self.max_distance:
                if distance < min_distance:
                    min_distance = distance
                    min_angle = angle_min + i * angle_increment
                    target_index = i

        if target_index != -1:
            self.target_found = True
            self.target_dist = min_distance
            self.target_angle = math.degrees(min_angle)

            target_info = {
                'found': True,
                'distance': float(self.target_dist),
                'angle': float(self.target_angle),
                'x': float(self.target_dist * math.cos(min_angle)),
                'y': float(self.target_dist * math.sin(min_angle))
            }

            self.get_logger().info(
                f'目标: 距离={self.target_dist:.2f}m, 角度={self.target_angle:.1f}°',
                throttle_duration_sec=1.0
            )
        else:
            self.target_found = False
            target_info = {'found': False}
            self.get_logger().warn('未检测到目标', throttle_duration_sec=2.0)

        target_msg = String()
        target_msg.data = json.dumps(target_info)
        self.target_pub.publish(target_msg)

        self.control_robot()

    def control_robot(self):
        """根据目标位置控制机器人运动（使用PID控制）"""
        cmd = Twist()

        if not self.target_found:
            cmd.linear.x = 0.0
            cmd.angular.z = self.angular_speed * 0.3
            self.angular_pid.reset()
            self.linear_pid.reset()
            self.get_logger().info('搜索目标中...', throttle_duration_sec=2.0)
        else:
            angle_error = math.radians(self.target_angle)
            distance_error = self.target_dist - self.target_distance

            if abs(self.target_angle) > self.angle_tolerance:
                cmd.linear.x = 0.0
                cmd.angular.z = self.angular_pid.update(angle_error)
                self.linear_pid.reset()
                self.get_logger().info(f'调整角度: {self.target_angle:.1f}°, 角速度: {cmd.angular.z:.2f}')
            else:
                if abs(distance_error) > self.distance_tolerance:
                    cmd.linear.x = self.linear_pid.update(distance_error)
                    cmd.angular.z = self.angular_pid.update(angle_error) * 0.3
                    self.get_logger().info(
                        f'距离误差: {distance_error:.2f}m, 线速度: {cmd.linear.x:.2f}',
                        throttle_duration_sec=0.5
                    )
                else:
                    cmd.linear.x = 0.0
                    cmd.angular.z = 0.0
                    self.angular_pid.reset()
                    self.linear_pid.reset()
                    self.get_logger().info('已到达目标位置', throttle_duration_sec=2.0)

        self.cmd_vel_pub.publish(cmd)


def main(args=None):
    rclpy.init(args=args)
    node = TargetTrackingNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
