#include "pm25.h"

/**
 * @brief PM2.5 数据采集线程
 */
static void *Sensor_TASK(void *arg)
{
    (void)arg;   // 避免未使用参数警告

    float pm25_value = 0.0f;

    printf("Sensor_TASK: PM2.5采集线程启动\n");

    while (1)
    {
        pm25_value = pm25_get_data();
        printf("pm25_value: %.2f ug/m3\n", pm25_value);
        osDelay(200);   // 200ms 采集一次
    }

    return NULL;
}

/**
 * @brief 主入口函数
 */
static void MAIN_Entry(void)
{
    printf("MAIN_Entry: PM2.5传感器初始化...\n");

    /* 初始化 PM2.5 传感器 */
    pm25_init();

    /* 创建采集线程 */
    osThreadAttr_t attr = {
        .name = "Sensor_TASK",
        .attr_bits = 0U,
        .cb_mem = NULL,
        .cb_size = 0U,
        .stack_mem = NULL,
        .stack_size = 1024 * 5,
        .priority = osPriorityNormal,
    };

    if (osThreadNew((osThreadFunc_t)Sensor_TASK, NULL, &attr) == NULL)
    {
        printf("[MAIN_Entry] 创建 Sensor_TASK 失败\n");
    }
    else
    {
        printf("[MAIN_Entry] 创建 Sensor_TASK 成功\n");
    }
}

/* OpenHarmony 初始化入口 */
APP_FEATURE_INIT(MAIN_Entry);