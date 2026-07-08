#include "uart7_gps.h"

/**
 * @brief GPS数据采集线程
 */
static void *GPS_TASK(void *arg)
{
    (void)arg;  // 消除未使用参数警告

    printf("GPS_TASK: Started\n");

    while (1)
    {
        parseGpsBuffer();
        printGpsBuffer();
        osDelay(100);  // 延时100ms，避免CPU占用过高
    }

    return NULL;
}

/**
 * @brief GPS示例入口函数
 */
static void GpsExampleEntry(void)
{
    // 初始化UART7，波特率115200
    uart7_init(115200);
    
    // 清空GPS数据结构体
    clrStruct();
    
    printf("GPS START!\n");

    // 创建GPS任务线程
    osThreadAttr_t attr = {
        .name = "GPS_TASK",
        .attr_bits = 0U,
        .cb_mem = NULL,
        .cb_size = 0U,
        .stack_mem = NULL,
        .stack_size = 1024 * 4,
        .priority = osPriorityNormal,
    };

    if (osThreadNew((osThreadFunc_t)GPS_TASK, NULL, &attr) == NULL)
    {
        printf("[GpsExampleEntry] create GPS_TASK NG\n");
    }
    else
    {
        printf("[GpsExampleEntry] create GPS_TASK OK\n");
    }
}

// 使用OpenHarmony特性初始化宏注册入口函数
APP_FEATURE_INIT(GpsExampleEntry);