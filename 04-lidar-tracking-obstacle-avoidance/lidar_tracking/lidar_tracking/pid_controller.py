#!/usr/bin/env python3
"""
PID控制器类
用于平滑跟踪控制
"""


class PIDController:
    """PID控制器"""

    def __init__(self, kp, ki, kd, output_min=-1.0, output_max=1.0):
        """
        初始化PID控制器

        Args:
            kp: 比例系数
            ki: 积分系数
            kd: 微分系数
            output_min: 输出最小值
            output_max: 输出最大值
        """
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.output_min = output_min
        self.output_max = output_max

        self.integral = 0.0
        self.prev_error = 0.0
        self.first_run = True

    def update(self, error, dt=0.1):
        """
        更新PID控制器

        Args:
            error: 当前误差值
            dt: 时间间隔(秒)

        Returns:
            控制输出值
        """
        if self.first_run:
            self.prev_error = error
            self.first_run = False

        # 比例项
        p_term = self.kp * error

        # 积分项（带抗饱和）
        self.integral += error * dt
        # 限制积分项防止饱和
        max_integral = abs(self.output_max - self.output_min) / 2.0
        self.integral = max(-max_integral, min(max_integral, self.integral))
        i_term = self.ki * self.integral

        # 微分项
        derivative = (error - self.prev_error) / dt if dt > 0 else 0.0
        d_term = self.kd * derivative

        # 计算输出
        output = p_term + i_term + d_term

        # 限幅
        output = max(self.output_min, min(self.output_max, output))

        # 保存当前误差供下次使用
        self.prev_error = error

        return output

    def reset(self):
        """重置PID控制器"""
        self.integral = 0.0
        self.prev_error = 0.0
        self.first_run = True

    def set_gains(self, kp, ki, kd):
        """动态设置PID参数"""
        self.kp = kp
        self.ki = ki
        self.kd = kd
