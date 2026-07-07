#!/usr/bin/env python3
"""
底盘控制测试脚本
功能：发布速度指令测试底盘运动控制
"""

import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import time


class ChassisTestNode(Node):
    def __init__(self):
        super().__init__('chassis_test_node')

        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)

        self.get_logger().info('底盘控制测试节点已启动')
        self.get_logger().info('将依次测试：前进、后退、左转、右转、停止')

    def send_velocity(self, linear_x, angular_z, duration=2.0):
        """发送速度指令"""
        cmd = Twist()
        cmd.linear.x = linear_x
        cmd.angular.z = angular_z

        self.get_logger().info(f'发送指令: 线速度={linear_x:.2f} m/s, 角速度={angular_z:.2f} rad/s')

        start_time = time.time()
        while time.time() - start_time < duration:
            self.cmd_vel_pub.publish(cmd)
            time.sleep(0.1)

    def stop(self):
        """停止运动"""
        cmd = Twist()
        cmd.linear.x = 0.0
        cmd.angular.z = 0.0
        self.cmd_vel_pub.publish(cmd)
        self.get_logger().info('停止')

    def run_test_sequence(self):
        """运行测试序列"""
        self.get_logger().info('=' * 50)
        self.get_logger().info('开始测试序列...')
        time.sleep(2)

        # 测试1: 前进
        self.get_logger().info('[测试1] 前进')
        self.send_velocity(0.2, 0.0, duration=2.0)
        self.stop()
        time.sleep(1)

        # 测试2: 后退
        self.get_logger().info('[测试2] 后退')
        self.send_velocity(-0.2, 0.0, duration=2.0)
        self.stop()
        time.sleep(1)

        # 测试3: 左转
        self.get_logger().info('[测试3] 原地左转')
        self.send_velocity(0.0, 0.5, duration=2.0)
        self.stop()
        time.sleep(1)

        # 测试4: 右转
        self.get_logger().info('[测试4] 原地右转')
        self.send_velocity(0.0, -0.5, duration=2.0)
        self.stop()
        time.sleep(1)

        # 测试5: 前进+左转
        self.get_logger().info('[测试5] 前进+左转')
        self.send_velocity(0.2, 0.3, duration=2.0)
        self.stop()
        time.sleep(1)

        # 测试6: 前进+右转
        self.get_logger().info('[测试6] 前进+右转')
        self.send_velocity(0.2, -0.3, duration=2.0)
        self.stop()
        time.sleep(1)

        self.get_logger().info('测试序列完成！')
        self.get_logger().info('=' * 50)


def main(args=None):
    rclpy.init(args=args)
    node = ChassisTestNode()

    try:
        node.run_test_sequence()
    except KeyboardInterrupt:
        node.get_logger().info('测试被中断')
    finally:
        node.stop()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
