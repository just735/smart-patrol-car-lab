#ifndef __PM25_H__
#define __PM25_H__

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

/* PM2.5 传感器硬件连接 (GP2Y1010AU0F) */
#define PM25_ADC_PERIPH      ADC2          // 使用 ADC2
#define PM25_ADC_CHANNEL     ADC_CHANNEL_6 // PA6
#define PM25_LED_PORT        GPIOC
#define PM25_LED_PIN         GPIO_PINS_8   // PC8 控制 LED

/* 函数声明 */
void pm25_init(void);
float pm25_get_data(void);

#endif // __PM25_H__