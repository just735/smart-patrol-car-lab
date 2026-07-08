#include "gas.h"

/**
 * @brief 初始化可燃气体传感器 (ADC2 通道4)
 */
void gas_init(void)
{
    gpio_init_type gpio_init_struct;
    adc_base_config_type adc_base_struct;

    /* 使能时钟 */
    crm_periph_clock_enable(CRM_GPIOA_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_ADC2_PERIPH_CLOCK, TRUE);

    /* 配置 GPIOA_Pin4 为模拟模式 */
    gpio_default_para_init(&gpio_init_struct);
    gpio_init_struct.gpio_mode = GPIO_MODE_ANALOG;
    gpio_init_struct.gpio_pins = GAS_GPIO_PIN;
    gpio_init(GAS_GPIO_PORT, &gpio_init_struct);

    /* 设置 ADC 时钟分频 (建议 6 分频) */
    crm_adc_clock_div_set(CRM_ADC_DIV_6);

    /* ADC 基础配置 */
    adc_combine_mode_select(ADC_INDEPENDENT_MODE);          // 独立模式
    adc_base_default_para_init(&adc_base_struct);
    adc_base_struct.data_align          = ADC_RIGHT_ALIGNMENT;   // 右对齐
    adc_base_struct.ordinary_channel_length = 1;                 // 单通道
    adc_base_struct.repeat_mode         = AT_FALSE;              // 单次转换
    adc_base_struct.sequence_mode       = AT_FALSE;              // 非序列模式
    adc_base_config(GAS_ADC_PERIPH, &adc_base_struct);

    /* 软件触发 */
    adc_ordinary_conversion_trigger_set(GAS_ADC_PERIPH, ADC12_ORDINARY_TRIG_SOFTWARE, AT_TRUE);

    /* 使能 ADC */
    adc_enable(GAS_ADC_PERIPH, AT_TRUE);

    /* 校准 (带超时保护) */
    uint32_t timeout = 0xFFFF;
    adc_calibration_init(GAS_ADC_PERIPH);
    while (adc_calibration_init_status_get(GAS_ADC_PERIPH) && timeout--);
    if (timeout == 0) {
        printf("gas_init: calibration init timeout!\n");
        return;
    }
    timeout = 0xFFFF;
    adc_calibration_start(GAS_ADC_PERIPH);
    while (adc_calibration_status_get(GAS_ADC_PERIPH) && timeout--);
    if (timeout == 0) {
        printf("gas_init: calibration start timeout!\n");
        return;
    }

    printf("gas_init: ADC2 channel 4 initialized successfully.\n");
}

/**
 * @brief 读取指定 ADC 通道的原始值 (带超时)
 * @param adc_channel 通道号
 * @return 转换结果 (0~4095)
 */
static uint16_t get_adc_value(adc_channel_select_type adc_channel)
{
    /* 配置通道和采样时间 */
    adc_ordinary_channel_set(GAS_ADC_PERIPH, adc_channel, 1, ADC_SAMPLETIME_28_5);

    /* 软件触发转换 */
    adc_ordinary_software_trigger_enable(GAS_ADC_PERIPH, AT_TRUE);

    /* 等待转换完成 (超时保护) */
    uint32_t timeout = 0xFFFF;
    while (!adc_flag_get(GAS_ADC_PERIPH, ADC_CCE_FLAG) && timeout--);
    if (timeout == 0) {
        printf("get_adc_value: conversion timeout!\n");
        return 0;
    }

    adc_flag_clear(GAS_ADC_PERIPH, ADC_CCE_FLAG);
    return adc_ordinary_conversion_data_get(GAS_ADC_PERIPH);
}

/**
 * @brief 获取气体浓度百分比 (0~100)
 * @return 百分比值 (整数)
 */
uint16_t gas_get_data(void)
{
    uint16_t adc_value = get_adc_value(GAS_ADC_CHANNEL);
    /* 使用整数运算计算百分比： (adc_value * 100) / 4095 */
    uint16_t percentage = (uint16_t)((uint32_t)adc_value * 100 / ADC_RESOLUTION);
    return percentage;
}