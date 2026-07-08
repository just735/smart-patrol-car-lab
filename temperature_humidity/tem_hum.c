#include "tem_hum.h"

#define AHT20_STARTUP_TIME (20 * 1000)     // 上电启动时间（微秒）
#define AHT20_CALIBRATION_TIME (40 * 1000) // 初始化（校准）时间（微秒）
#define AHT20_MEASURE_TIME (75 * 1000)     // 测量时间（微秒）

#define AHT20_CMD_CALIBRATION 0xBE // 初始化（校准）命令
#define AHT20_CMD_CALIBRATION_ARG0 0x08
#define AHT20_CMD_CALIBRATION_ARG1 0x00

#define AHT20_CMD_TRIGGER 0xAC      // 触发测量命令
#define AHT20_CMD_TRIGGER_ARG0 0x33
#define AHT20_CMD_TRIGGER_ARG1 0x00

#define AHT20_CMD_RESET 0xBA        // 软复位命令
#define AHT20_CMD_STATUS 0x71       // 获取状态命令

#define AHT20_STATUS_BUSY_SHIFT 7   // bit[7] Busy indication
#define AHT20_STATUS_BUSY_MASK (0x1 << AHT20_STATUS_BUSY_SHIFT)

#define AHT20_STATUS_MODE_SHIFT 5   // bit[6:5] Mode Status
#define AHT20_STATUS_MODE_MASK (0x3 << AHT20_STATUS_MODE_SHIFT)

#define AHT20_STATUS_CALI_SHIFT 3   // bit[3] CAL Enable
#define AHT20_STATUS_CALI_MASK (0x1 << AHT20_STATUS_CALI_SHIFT)

#define AHT20_STATUS_RESPONSE_MAX (6)
#define AHT20_RESOLUTION (1 << 20)  // 2^20
#define AHT20_MAX_RETRY (10)

// I2C句柄
i2c_handle_type hi2cx;

// 用于选择I2C总线的状态变量
static int g_i2c_state = 0;

/**
 * @brief I2C底层初始化函数，支持多个I2C总线配置
 * @param hi2c I2C句柄指针
 */
void i2c_lowlevel_init(i2c_handle_type *hi2c)
{
    gpio_init_type gpio_config;

    switch (g_i2c_state)
    {
    case 0:
        printf("i2c_lowlevel_init: I2Cx_PORT[I2C-1]\n");

        /* i2c periph clock enable */
        crm_periph_clock_enable(CRM_IOMUX_PERIPH_CLOCK, TRUE);
        crm_periph_clock_enable(CRM_I2C1_PERIPH_CLOCK, TRUE);
        crm_periph_clock_enable(CRM_GPIOB_PERIPH_CLOCK, TRUE);

        /* gpio configuration */
        gpio_config.gpio_out_type = GPIO_OUTPUT_OPEN_DRAIN;
        gpio_config.gpio_pull = GPIO_PULL_UP;
        gpio_config.gpio_mode = GPIO_MODE_MUX;
        gpio_config.gpio_drive_strength = GPIO_DRIVE_STRENGTH_MODERATE;
        gpio_config.gpio_pins = GPIO_PINS_6 | GPIO_PINS_7;
        gpio_init(GPIOB, &gpio_config);

        /* i2c init */
        i2c_init(hi2c->i2cx, I2C_FSMODE_DUTY_2_1, 100000);
        i2c_own_address1_set(hi2c->i2cx, I2C_ADDRESS_MODE_7BIT, 0x00);
        break;

    case 1:
        printf("i2c_lowlevel_init: I2Cx_PORT[I2C-3]\n");

        /* i2c periph clock enable */
        crm_periph_clock_enable(CRM_IOMUX_PERIPH_CLOCK, TRUE);
        crm_periph_clock_enable(CRM_I2C3_PERIPH_CLOCK, TRUE);
        crm_periph_clock_enable(CRM_GPIOA_PERIPH_CLOCK, TRUE);
        crm_periph_clock_enable(CRM_GPIOC_PERIPH_CLOCK, TRUE);

        /* gpio configuration */
        gpio_config.gpio_out_type = GPIO_OUTPUT_OPEN_DRAIN;
        gpio_config.gpio_pull = GPIO_PULL_UP;
        gpio_config.gpio_mode = GPIO_MODE_MUX;
        gpio_config.gpio_drive_strength = GPIO_DRIVE_STRENGTH_MODERATE;

        /* configure i2c pins: scl - PA8 */
        gpio_config.gpio_pins = GPIO_PINS_8;
        gpio_init(GPIOA, &gpio_config);

        /* configure i2c pins: sda - PC9 */
        gpio_config.gpio_pins = GPIO_PINS_9;
        gpio_init(GPIOC, &gpio_config);

        /* i2c init */
        i2c_init(hi2c->i2cx, I2C_FSMODE_DUTY_2_1, 100000);
        i2c_own_address1_set(hi2c->i2cx, I2C_ADDRESS_MODE_7BIT, 0x10);
        break;

    default:
        printf("i2c_lowlevel_init: Invalid I2C state %d\n", g_i2c_state);
        break;
    }
}

/**
 * @brief 温湿度传感器初始化
 */
void tem_hum_init(void)
{
    g_i2c_state = 0;           // 默认使用I2C1
    hi2cx.i2cx = I2C1;
    i2c_config(&hi2cx);
    printf("tem_hum_init: AHT20 initialized\n");
}

/**
 * @brief AHT20 读取数据
 * @param buffer 数据缓冲区
 * @param buffLen 要读取的字节数
 * @return 0表示成功，非0表示失败
 */
uint32_t AHT20_Read(uint8_t *buffer, uint32_t buffLen)
{
    i2c_status_type i2c_status = I2C_ERR_INTERRUPT;
    /* start the request reception process */
    if ((i2c_status = i2c_master_receive(&hi2cx, AHT20_WRITE_ADDR, buffer, buffLen, 0xFFFF)) != I2C_OK)
    {
        printf("AHT20_Read: NG (status=%d)\n", i2c_status);
    }
    return i2c_status;
}

/**
 * @brief AHT20 写入数据
 * @param buffer 数据缓冲区
 * @param buffLen 要写入的字节数
 * @return 0表示成功，非0表示失败
 */
uint32_t AHT20_Write(uint8_t *buffer, uint32_t buffLen)
{
    i2c_status_type i2c_status = I2C_ERR_INTERRUPT;
    /* start the request transmission process */
    if ((i2c_status = i2c_master_transmit(&hi2cx, AHT20_WRITE_ADDR, buffer, buffLen, 0xFFFF)) != I2C_OK)
    {
        printf("AHT20_Write: NG (status=%d)\n", i2c_status);
    }
    return i2c_status;
}

/**
 * @brief 获取状态字的忙碌标志
 */
static inline uint8_t aht20_status_busy(uint8_t status)
{
    return ((status & AHT20_STATUS_BUSY_MASK) >> AHT20_STATUS_BUSY_SHIFT);
}

/**
 * @brief 获取状态字的模式标志
 */
static inline uint8_t aht20_status_mode(uint8_t status)
{
    return ((status & AHT20_STATUS_MODE_MASK) >> AHT20_STATUS_MODE_SHIFT);
}

/**
 * @brief 获取状态字的校准使能标志
 */
static inline uint8_t aht20_status_cali(uint8_t status)
{
    return ((status & AHT20_STATUS_CALI_MASK) >> AHT20_STATUS_CALI_SHIFT);
}

/**
 * @brief 发送获取状态命令
 */
static uint32_t AHT20_StatusCommand(void)
{
    uint8_t statusCmd[] = {AHT20_CMD_STATUS};
    return AHT20_Write(statusCmd, sizeof(statusCmd));
}

/**
 * @brief 发送软复位命令
 */
static uint32_t AHT20_ResetCommand(void)
{
    uint8_t resetCmd[] = {AHT20_CMD_RESET};
    return AHT20_Write(resetCmd, sizeof(resetCmd));
}

/**
 * @brief 发送初始化校准命令
 */
static uint32_t AHT20_CalibrateCommand(void)
{
    uint8_t calibrateCmd[] = {AHT20_CMD_CALIBRATION, AHT20_CMD_CALIBRATION_ARG0, AHT20_CMD_CALIBRATION_ARG1};
    return AHT20_Write(calibrateCmd, sizeof(calibrateCmd));
}

/**
 * @brief AHT20 校准函数
 * @return 0表示成功，非0表示失败
 */
uint32_t AHT20_Calibrate(void)
{
    uint32_t ret = 0;
    uint8_t buffer[AHT20_STATUS_RESPONSE_MAX] = {0};

    // 发送状态命令
    ret = AHT20_StatusCommand();
    if (ret != 0)
    {
        printf("AHT20_Calibrate: StatusCommand failed\n");
        return ret;
    }

    // 读取状态
    ret = AHT20_Read(buffer, sizeof(buffer));
    if (ret != 0)
    {
        printf("AHT20_Calibrate: Read status failed\n");
        return ret;
    }

    // 检查是否需要校准
    if (aht20_status_busy(buffer[0]) || !aht20_status_cali(buffer[0]))
    {
        printf("AHT20_Calibrate: Need calibration (busy=%d, cali=%d)\n",
               aht20_status_busy(buffer[0]), aht20_status_cali(buffer[0]));

        // 软复位
        ret = AHT20_ResetCommand();
        if (ret != 0)
        {
            printf("AHT20_Calibrate: ResetCommand failed\n");
            return ret;
        }
        usleep(AHT20_STARTUP_TIME);

        // 发送校准命令
        ret = AHT20_CalibrateCommand();
        if (ret != 0)
        {
            printf("AHT20_Calibrate: CalibrateCommand failed\n");
            return ret;
        }
        usleep(AHT20_CALIBRATION_TIME);
        printf("AHT20_Calibrate: Calibration done\n");
    }

    return 0;
}

/**
 * @brief 发送触发测量命令
 * @return 0表示成功，非0表示失败
 */
uint32_t AHT20_StartMeasure(void)
{
    uint8_t triggerCmd[] = {AHT20_CMD_TRIGGER, AHT20_CMD_TRIGGER_ARG0, AHT20_CMD_TRIGGER_ARG1};
    return AHT20_Write(triggerCmd, sizeof(triggerCmd));
}

/**
 * @brief 获取温湿度数据
 * @param temp 温度输出指针（单位：°C）
 * @param humi 湿度输出指针（单位：%RH）
 * @return 0表示成功，非0表示失败
 */
int tem_hum_get_data(float *temp, float *humi)
{
    uint32_t humiRaw = 0;
    uint32_t tempRaw = 0;
    uint32_t ret = 0;
    uint32_t i = 0;
    uint8_t buffer[AHT20_STATUS_RESPONSE_MAX] = {0};

    if (temp == NULL || humi == NULL)
    {
        printf("tem_hum_get_data: NULL pointer\n");
        return -1;
    }

    // 校准传感器
    ret = AHT20_Calibrate();
    if (ret != 0)
    {
        printf("tem_hum_get_data: Calibrate failed\n");
        return ret;
    }

    // 触发测量
    ret = AHT20_StartMeasure();
    if (ret != 0)
    {
        printf("tem_hum_get_data: StartMeasure failed\n");
        return ret;
    }

    // 等待测量完成，延时75ms
    usleep(AHT20_MEASURE_TIME);

    // 读取测量结果
    ret = AHT20_Read(buffer, sizeof(buffer));
    if (ret != 0)
    {
        printf("tem_hum_get_data: Read failed\n");
        return ret;
    }

    // 等待传感器空闲（带重试机制）
    for (i = 0; aht20_status_busy(buffer[0]) && i < AHT20_MAX_RETRY; i++)
    {
        usleep(AHT20_MEASURE_TIME);
        ret = AHT20_Read(buffer, sizeof(buffer));
        if (ret != 0)
        {
            printf("tem_hum_get_data: Read retry failed\n");
            return ret;
        }
    }

    if (i >= AHT20_MAX_RETRY)
    {
        printf("tem_hum_get_data: AHT20 device always busy!\n");
        return -2;
    }

    // 解析温湿度数据
    // 湿度：20位数据，从buffer[1], buffer[2], buffer[3]高4位
    humiRaw = (buffer[1] << 12) | (buffer[2] << 4) | (buffer[3] >> 4);
    // 温度：20位数据，从buffer[3]低4位, buffer[4], buffer[5]
    tempRaw = ((buffer[3] & 0x0F) << 16) | (buffer[4] << 8) | (buffer[5]);

    // 转换为实际值
    *humi = (humiRaw / (float)AHT20_RESOLUTION) * 100.0f;
    *temp = (tempRaw / (float)AHT20_RESOLUTION) * 200.0f - 50.0f;

    return 0;
}