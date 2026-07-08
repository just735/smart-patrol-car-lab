#include "bme280.h"

/* 线程函数 */
static void *BME280_TASK(void *arg)
{
    (void)arg;   // 消除警告
    float data[3] = {0};

    while (1) {
        Get_BME280_Value(data);
        osDelay(200);
    }
    return NULL;
}

/* 入口函数 */
static void MAIN_Entry(void)
{
    printf("MAIN_Entry: BME280 starting...\n");

    BME280_Init();

    osThreadAttr_t attr = {
        .name = "BME280_TASK",
        .attr_bits = 0U,
        .cb_mem = NULL,
        .cb_size = 0U,
        .stack_mem = NULL,
        .stack_size = 1024 * 5,
        .priority = osPriorityNormal,
    };

    if (osThreadNew((osThreadFunc_t)BME280_TASK, NULL, &attr) == NULL) {
        printf("[MAIN_Entry] create BME280_TASK failed\n");
    } else {
        printf("[MAIN_Entry] create BME280_TASK success\n");
    }
}

APP_FEATURE_INIT(MAIN_Entry);