#include "tem_hum.h"
#include <stdio.h>

/**
 * @brief 温湿度数据采集线程
 */
static void *TEM_HUM_TASK(void *arg)
{
    (void)arg;  // 消除未使用参数警告

    float tem_value = 0.0f;
    float hum_value = 0.0f;
    int ret = 0;

    printf("TEM_HUM_TASK: Started\n");

    while (1)
    {
        ret = tem_hum_get_data(&tem_value, &hum_value);
        if (ret != 0)
        {
            printf("TEM_HUM_TASK: Get data failed, ret=%d\n", ret);
        }
        else
        {
            printf("TEM_HUM_TASK: Temperature = %.2f °C, Humidity = %.2f %%RH\n", tem_value, hum_value);
        }

        // 延时200ms
        osDelay(200);
    }

    return NULL;
}

/**
 * @brief 主入口函数
 */
static void MAIN_Entry(void)
{
    printf("MAIN_Entry: Starting...\n");

    // 初始化温湿度传感器
    tem_hum_init();

    // 创建温湿度采集线程
    osThreadAttr_t attr = {
        .name = "TEM_HUM_TASK",
        .attr_bits = 0U,
        .cb_mem = NULL,
        .cb_size = 0U,
        .stack_mem = NULL,
        .stack_size = 1024 * 5,
        .priority = osPriorityNormal,
    };

    if (osThreadNew((osThreadFunc_t)TEM_HUM_TASK, NULL, &attr) == NULL)
    {
        printf("[MAIN_Entry] Create TEM_HUM_TASK failed!\n");
    }
    else
    {
        printf("[MAIN_Entry] Create TEM_HUM_TASK success!\n");
    }
}

// 使用OpenHarmony特性初始化宏注册入口函数
APP_FEATURE_INIT(MAIN_Entry);