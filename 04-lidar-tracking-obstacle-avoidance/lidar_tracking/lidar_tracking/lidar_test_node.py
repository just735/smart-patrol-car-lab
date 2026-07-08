#!/usr/bin/env python3
"""
激光雷达数据测试节点
功能：订阅并打印雷达扫描数据，用于调试验证雷达功能
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
import math


class LidarTestNode(Node):
    def __init__(self):
        super().__init__('lidar_test_node')

        self.scan_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        self.scan_count = 0
        self.get_logger().info('激光雷达测试节点已启动，监听/scan话题...')

    def scan_callback(self, msg: LaserScan):
        """处理激光雷达扫描数据"""
        self.scan_count += 1

        ranges = msg.ranges
        angle_min = msg.angle_min
        angle_max = msg.angle_max
        angle_increment = msg.angle_increment
        range_min = msg.range_min
        range_max = msg.range_max

        valid_ranges = [r for r in ranges if not math.isinf(r) and not math.isnan(r)]

        if self.scan_count % 10 == 0:
            self.get_logger().info('=' * 60)
            self.get_logger().info(f'扫描次数: {self.scan_count}')
            self.get_logger().info(f'数据点数: {len(ranges)}')
            self.get_logger().info(f'有效数据点: {len(valid_ranges)}')
            self.get_logger().info(f'角度范围: {math.degrees(angle_min):.1f}° ~ {math.degrees(angle_max):.1f}°')
            self.get_logger().info(f'角度增量: {math.degrees(angle_increment):.2f}°')
            self.get_logger().info(f'距离范围: {range_min:.2f}m ~ {range_max:.2f}m')

            if valid_ranges:
                self.get_logger().info(f'最小距离: {min(valid_ranges):.2f}m')
                self.get_logger().info(f'最大距离: {max(valid_ranges):.2f}m')
                self.get_logger().info(f'平均距离: {sum(valid_ranges)/len(valid_ranges):.2f}m')

            # 分区统计
            front_ranges = []
            left_ranges = []
            right_ranges = []
            back_ranges = []

            for i, distance in enumerate(ranges):
                if math.isinf(distance) or math.isnan(distance):
                    continue

                angle_deg = math.degrees(angle_min + i * angle_increment)
                angle_deg = (angle_deg + 360) % 360

                if angle_deg <= 45 or angle_deg >= 315:
                    front_ranges.append(distance)
                elif 45 < angle_deg <= 135:
                    left_ranges.append(distance)
                elif 135 < angle_deg <= 225:
                    back_ranges.append(distance)
                else:
                    right_ranges.append(distance)

            self.get_logger().info(f'前方最近障碍: {min(front_ranges) if front_ranges else float("inf"):.2f}m')
            self.get_logger().info(f'左侧最近障碍: {min(left_ranges) if left_ranges else float("inf"):.2f}m')
            self.get_logger().info(f'右侧最近障碍: {min(right_ranges) if right_ranges else float("inf"):.2f}m')
            self.get_logger().info(f'后方最近障碍: {min(back_ranges) if back_ranges else float("inf"):.2f}m')
            self.get_logger().info('=' * 60)


def main(args=None):
    rclpy.init(args=args)
    node = LidarTestNode()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
