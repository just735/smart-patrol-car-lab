#include "uart7_gps.h"

// 定义全局结构体变量
_SaveData Save_Data;

// 串口接收缓冲区
#define GPSRX_LEN_MAX 255
static unsigned char gpsRxBuff[GPSRX_LEN_MAX];
static unsigned char gpsRxLen = 0;

/**
 * @brief UART7初始化函数
 * @param bound 波特率
 */
void uart7_init(uint32_t bound)
{
    gpio_init_type gpio_init_struct;

    /* Enable the UART7 Clock */
    crm_periph_clock_enable(CRM_GPIOE_PERIPH_CLOCK, TRUE);   // 开启GPIOE的时钟
    crm_periph_clock_enable(CRM_UART7_PERIPH_CLOCK, TRUE);   // 开启UART7的时钟

    gpio_default_para_init(&gpio_init_struct);

    /* Configure the UART7 TX pin (PE8) */
    gpio_init_struct.gpio_drive_strength = GPIO_DRIVE_STRENGTH_STRONGER;
    gpio_init_struct.gpio_out_type = GPIO_OUTPUT_PUSH_PULL;
    gpio_init_struct.gpio_mode = GPIO_MODE_MUX;
    gpio_init_struct.gpio_pins = GPIO_PINS_8;
    gpio_init_struct.gpio_pull = GPIO_PULL_NONE;
    gpio_init(GPIOE, &gpio_init_struct);

    /* Configure the UART7 RX pin (PE7) */
    gpio_init_struct.gpio_drive_strength = GPIO_DRIVE_STRENGTH_STRONGER;
    gpio_init_struct.gpio_out_type = GPIO_OUTPUT_PUSH_PULL;
    gpio_init_struct.gpio_mode = GPIO_MODE_INPUT;
    gpio_init_struct.gpio_pins = GPIO_PINS_7;
    gpio_init_struct.gpio_pull = GPIO_PULL_UP;
    gpio_init(GPIOE, &gpio_init_struct);

    /* Enable UART7 interrupt */
    nvic_irq_enable(UART7_IRQn, 0, 6);

    /* Configure UART param */
    usart_init(UART7, bound, USART_DATA_8BITS, USART_STOP_1_BIT);
    usart_hardware_flow_control_set(UART7, USART_HARDWARE_FLOW_NONE);
    usart_parity_selection_config(UART7, USART_PARITY_NONE);
    usart_transmitter_enable(UART7, TRUE);
    usart_receiver_enable(UART7, TRUE);

    /* Enable interrupts */
    usart_interrupt_enable(UART7, USART_RDBF_INT, TRUE);
    usart_interrupt_enable(UART7, USART_IDLE_INT, TRUE);
    usart_enable(UART7, TRUE);

    printf("uart7_init: UART7 initialized with baudrate %d\n", bound);
}

/**
 * @brief UART7中断服务函数
 */
void UART7_IRQHandler(void)
{
    uint8_t res;

    /* 接收数据寄存器非空中断 */
    if (usart_flag_get(UART7, USART_RDBF_FLAG) != RESET)
    {
        usart_flag_clear(UART7, USART_RDBF_FLAG);
        res = usart_data_receive(UART7);

        /* 检测到帧头'$'，重置缓冲区索引 */
        if (res == '$')
        {
            gpsRxLen = 0;
        }

        /* 防止缓冲区溢出 */
        if (gpsRxLen < GPSRX_LEN_MAX)
        {
            gpsRxBuff[gpsRxLen++] = res;
        }

        /* 检测是否收到完整的GPRMC/GNRMC帧 */
        if (gpsRxBuff[0] == '$' && 
            (gpsRxBuff[4] == 'M' && gpsRxBuff[5] == 'C') && 
            res == '\n')
        {
            /* 保存有效数据到结构体 */
            memset(Save_Data.GPS_Buffer, 0, GPS_Buffer_Length);
            memcpy(Save_Data.GPS_Buffer, gpsRxBuff, (gpsRxLen < GPS_Buffer_Length) ? gpsRxLen : GPS_Buffer_Length);
            Save_Data.isGetData = 1;
            
            /* 重置缓冲区 */
            gpsRxLen = 0;
            memset(gpsRxBuff, 0, GPSRX_LEN_MAX);
        }

        /* 回显功能 */
#if (recv_view == 1)
        usart_data_transmit(UART7, res);
#endif
    }

    /* 空闲中断（可选，用于处理超时） */
    if (usart_flag_get(UART7, USART_IDLE_FLAG) != RESET)
    {
        usart_flag_clear(UART7, USART_IDLE_FLAG);
        /* 可以在这里处理超时接收完成的情况 */
    }
}

/**
 * @brief 发送1个字节数据
 * @param byte 要发送的数据
 */
void USART7_send_byte(uint8_t byte)
{
    usart_data_transmit(UART7, byte);
    while (usart_flag_get(UART7, USART_TDE_FLAG) == RESET);
}

/**
 * @brief 发送多个字节数据
 * @param data 数据指针
 * @param len 数据长度
 */
void USART7_send_data(uint8_t* data, uint32_t len)
{
    for (uint32_t i = 0; i < len; i++)
    {
        USART7_send_byte(data[i]);
    }
}

/**
 * @brief 发送字符串
 * @param data 字符串指针
 */
void USART7_send_string(uint8_t* data)
{
    while (*data != '\0')
    {
        USART7_send_byte(*data++);
    }
}

/**
 * @brief 清除串口接收缓冲区数据
 */
void CLR_Buf(void)
{
    memset(gpsRxBuff, 0, GPSRX_LEN_MAX);
    gpsRxLen = 0;
}

/**
 * @brief 在GPS数据中识别是否有指定的串口命令
 * @param a 要查找的字符串
 * @return 1找到 0未找到
 */
uint8_t Hand(char *a)
{
    if (strstr((const char*)gpsRxBuff, a) != NULL)
        return 1;
    else
        return 0;
}

/**
 * @brief 清除GPS结构体数据
 */
void clrStruct(void)
{
    Save_Data.isGetData = 0;
    Save_Data.isParseData = 0;
    Save_Data.isUsefull = 0;
    memset(Save_Data.GPS_Buffer, 0, GPS_Buffer_Length);
    memset(Save_Data.UTCTime, 0, UTCTime_Length);
    memset(Save_Data.latitude, 0, latitude_Length);
    memset(Save_Data.N_S, 0, N_S_Length);
    memset(Save_Data.longitude, 0, longitude_Length);
    memset(Save_Data.E_W, 0, E_W_Length);
}

/**
 * @brief 错误日志打印（死循环）
 * @param num 错误码
 */
static void errorLog(int num)
{
    while (1)
    {
        printf("GPS_ERROR:%d\r\n", num);
        osDelay(1000);
    }
}

/**
 * @brief 解析GPS发送过来的数据（GPRMC/GNRMC格式）
 */
void parseGpsBuffer(void)
{
    char *subString;
    char *subStringNext;
    char i = 0;

    if (Save_Data.isGetData)
    {
        Save_Data.isGetData = 0;
        printf("**************\r\n");
        printf("%s\r\n", Save_Data.GPS_Buffer);

        for (i = 0; i <= 6; i++)
        {
            if (i == 0)
            {
                /* 跳过第一个逗号前的帧头 */
                if ((subString = strstr(Save_Data.GPS_Buffer, ",")) == NULL)
                {
                    errorLog(1);
                }
            }
            else
            {
                subString++;
                if ((subStringNext = strstr(subString, ",")) != NULL)
                {
                    char usefullBuffer[2] = {0};
                    switch (i)
                    {
                    case 1:
                        /* UTC时间：hhmmss.sss */
                        memcpy(Save_Data.UTCTime, subString, (subStringNext - subString) < UTCTime_Length ? 
                               (subStringNext - subString) : (UTCTime_Length - 1));
                        break;
                    case 2:
                        /* 定位状态：A=有效 V=无效 */
                        memcpy(usefullBuffer, subString, (subStringNext - subString) < 2 ? 
                               (subStringNext - subString) : 1);
                        break;
                    case 3:
                        /* 纬度：ddmm.mmmmm */
                        memcpy(Save_Data.latitude, subString, (subStringNext - subString) < latitude_Length ? 
                               (subStringNext - subString) : (latitude_Length - 1));
                        break;
                    case 4:
                        /* N/S 标识 */
                        memcpy(Save_Data.N_S, subString, (subStringNext - subString) < N_S_Length ? 
                               (subStringNext - subString) : (N_S_Length - 1));
                        break;
                    case 5:
                        /* 经度：dddmm.mmmmm */
                        memcpy(Save_Data.longitude, subString, (subStringNext - subString) < longitude_Length ? 
                               (subStringNext - subString) : (longitude_Length - 1));
                        break;
                    case 6:
                        /* E/W 标识 */
                        memcpy(Save_Data.E_W, subString, (subStringNext - subString) < E_W_Length ? 
                               (subStringNext - subString) : (E_W_Length - 1));
                        break;
                    default:
                        break;
                    }
                    subString = subStringNext;
                    Save_Data.isParseData = 1;

                    /* 判断定位是否有效 */
                    if (usefullBuffer[0] == 'A')
                        Save_Data.isUsefull = 1;
                    else if (usefullBuffer[0] == 'V')
                        Save_Data.isUsefull = 0;
                }
                else
                {
                    errorLog(2);
                }
            }
        }
    }
}

/**
 * @brief 打印解析后的GPS数据
 */
void printGpsBuffer(void)
{
    if (Save_Data.isParseData)
    {
        Save_Data.isParseData = 0;

        printf("Save_Data.UTCTime = %s\r\n", Save_Data.UTCTime);

        if (Save_Data.isUsefull)
        {
            Save_Data.isUsefull = 0;
            printf("Save_Data.latitude  = %s", Save_Data.latitude);
            printf("Save_Data.N_S       = %s\r\n", Save_Data.N_S);
            printf("Save_Data.longitude = %s\r\n", Save_Data.longitude);
            printf("Save_Data.E_W       = %s\r\n", Save_Data.E_W);
        }
        else
        {
            printf("GPS DATA is not useful!\r\n");
        }
    }
}