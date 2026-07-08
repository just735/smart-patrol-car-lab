#include "pm25.h"

/**
 * @brief 初始化 PM2.5 传感器
 *        - PA6 为模拟输入 (ADC2 通道6)
 *        - PC8 为推挽输出，控制内部LED
 */
void pm25_init(void)
{
    gpio_init_type gpio_init_struct;
    adc_base_config_type adc_base_struct;

    /* 使能相关时钟 */
    crm_periph_clock_enable(CRM_IOMUX_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_GPIOA_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_ADC2_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_GPIOC_PERIPH_CLOCK, TRUE);

    /* 配置 PA6 为模拟输入 */
    gpio_default_para_init(&gpio_init_struct);
    gpio_init_struct.gpio_mode = GPIO_MODE_ANALOG;
    gpio_init_struct.gpio_pins = GPIO_PINS_6;
    gpio_init(GPIOA, &gpio_init_struct);

    /* 配置 PC8 为推挽输出，控制 LED (默认高电平关闭) */
    gpio_init_struct.gpio_drive_strength = GPIO_DRIVE_STRENGTH_STRONGER;
    gpio_init_struct.gpio_out_type = GPIO_OUTPUT_PUSH_PULL;
    gpio_init_struct.gpio_mode = GPIO_MODE_OUTPUT;
    gpio_init_struct.gpio_pins = GPIO_PINS_8;
    gpio_init_struct.gpio_pull = GPIO_PULL_UP;
    gpio_init(GPIOC, &gpio_init_struct);
    gpio_bits_set(GPIOC, GPIO_PINS_8);   // 初始关闭 LED

    /* 设置 ADC 时钟分频 */
    crm_adc_clock_div_set(CRM_ADC_DIV_6);

    /* ADC 基础配置 (独立模式，单通道，单次转换) */
    adc_combine_mode_select(ADC_INDEPENDENT_MODE);
    adc_base_default_para_init(&adc_base_struct);
    adc_base_struct.data_align = ADC_RIGHT_ALIGNMENT;
    adc_base_struct.ordinary_channel_length = 1;
    adc_base_struct.repeat_mode = AT_FALSE;
    adc_base_struct.sequence_mode = AT_FALSE;
    adc_base_config(ADC2, &adc_base_struct);

    /* 软件触发 */
    adc_ordinary_conversion_trigger_set(ADC2, ADC12_ORDINARY_TRIG_SOFTWARE, AT_TRUE);

    /* 使能 ADC */
    adc_enable(ADC2, AT_TRUE);

    /* 校准 (带超时保护) */
    uint32_t timeout = 0xFFFF;
    adc_calibration_init(ADC2);
    while (adc_calibration_init_status_get(ADC2) && timeout--);
    if (timeout == 0) {
        printf("pm25_init: calibration init timeout!\n");
        return;
    }
    timeout = 0xFFFF;
    adc_calibration_start(ADC2);
    while (adc_calibration_status_get(ADC2) && timeout--);
    if (timeout == 0) {
        printf("pm25_init: calibration start timeout!\n");
        return;
    }

    printf("pm25_init: PM2.5 sensor initialized (ADC2 CH6, PC8 LED).\n");
}

/**
 * @brief 读取 ADC 原始值 (带超时)
 * @param adc_channel ADC通道
 * @return 转换结果 (0~4095)
 */
static uint16_t get_adc_value(adc_channel_select_type adc_channel)
{
    /* 设置通道和采样时间 */
    adc_ordinary_channel_set(ADC2, adc_channel, 1, ADC_SAMPLETIME_28_5);

    /* 软件触发转换 */
    adc_ordinary_software_trigger_enable(ADC2, AT_TRUE);

    /* 等待转换完成 (超时保护) */
    uint32_t timeout = 0xFFFF;
    while (!adc_flag_get(ADC2, ADC_CCE_FLAG) && timeout--);
    if (timeout == 0) {
        printf("get_adc_value: conversion timeout!\n");
        return 0;
    }

    adc_flag_clear(ADC2, ADC_CCE_FLAG);
    return adc_ordinary_conversion_data_get(ADC2);
}

/**
 * @brief 获取 PM2.5 浓度值
 * @return 浓度 (单位 µg/m³)
 * @note 基于 GP2Y1010AU0F 经验公式: 浓度 = 0.17 * adc_value - 0.1
 *       时序: 开LED → 280µs → 采样 → 23µs → 关LED → 9680µs
 */
float pm25_get_data(void)
{
    uint16_t adc_value = 0;

    /* 开启 LED (拉低 PC8) */
    gpio_bits_reset(GPIOC, GPIO_PINS_8);
    usleep(280);   // 等待传感器响应

    /* 采样 */
    adc_value = get_adc_value(ADC_CHANNEL_6);

    usleep(23);    // 保持LED开启时间
    /* 关闭 LED (拉高 PC8) */
    gpio_bits_set(GPIOC, GPIO_PINS_8);
    usleep(9680);  // 等待下一个周期

    /* 计算浓度，防止负值 */
    float concentration = 0.17f * adc_value - 0.1f;
    if (concentration < 0) concentration = 0;
    return concentration;
}