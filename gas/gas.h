#ifndef __GAS_H__
#define __GAS_H__

#include "cmsis_os2.h"
#include "ohos_init.h"
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <ctype.h>
#include "at32f403a_407_crm.h"
#include "at32f403a_407_gpio.h"
#include "at32f403a_407_usart.h"
#include "at32f403a_407_adc.h"

/* 可燃气体传感器使用 ADC2 通道4 (PA4) */
#define GAS_ADC_PERIPH      ADC2
#define GAS_ADC_CHANNEL     ADC_CHANNEL_4
#define GAS_GPIO_PORT       GPIOA
#define GAS_GPIO_PIN        GPIO_PINS_4
#define ADC_RESOLUTION      4095U   // 12位ADC最大值

/* 函数声明 */
void gas_init(void);                // 初始化ADC
uint16_t gas_get_data(void);        // 获取气体浓度百分比 (0~100)

#endif // __GAS_H__