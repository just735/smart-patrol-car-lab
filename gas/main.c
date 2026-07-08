#include "gas.h"

/**
 * @brief 传感器数据采集线程
 */
static void *Sensor_TASK(void *arg)
{
    (void)arg;  // 避免未使用参数警告

    uint16_t gas_value = 0;

    printf("Sensor_TASK started.\n");

    while (1)
    {
        gas_value = gas_get_data();
        printf("gas_value: %d%%\n", gas_value);
        osDelay(200);   // 200ms 采集一次
    }

    return NULL;
}

/**
 * @brief 主入口函数
 */
static void MAIN_Entry(void)
{
    printf("MAIN_Entry: initializing gas sensor...\n");

    /* 初始化气体传感器 */
    gas_init();

    /* 创建传感器采集线程 */
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
        printf("[MAIN_Entry] create Sensor_TASK failed.\n");
    }
    else
    {
        printf("[MAIN_Entry] create Sensor_TASK success.\n");
    }
}

/* OpenHarmony 初始化入口 */
APP_FEATURE_INIT(MAIN_Entry);