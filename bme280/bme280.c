#include "bme280.h"

/* 定义I2C句柄变量 */
i2c_handle_type hi2c3;

/* 底层I2C初始化（由i2c_application调用） */
void i2c_lowlevel_init(i2c_handle_type *hi2c)
{
    gpio_init_type gpio_config;

    /* 使能时钟 */
    crm_periph_clock_enable(CRM_IOMUX_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_I2C3_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_GPIOA_PERIPH_CLOCK, TRUE);
    crm_periph_clock_enable(CRM_GPIOC_PERIPH_CLOCK, TRUE);

    /* GPIO配置：开漏，上拉，复用功能 */
    gpio_config.gpio_out_type = GPIO_OUTPUT_OPEN_DRAIN;
    gpio_config.gpio_pull = GPIO_PULL_UP;
    gpio_config.gpio_mode = GPIO_MODE_MUX;
    gpio_config.gpio_drive_strength = GPIO_DRIVE_STRENGTH_MODERATE;

    /* SCL: PA8 */
    gpio_config.gpio_pins = GPIO_PINS_8;
    gpio_init(GPIOA, &gpio_config);

    /* SDA: PC9 */
    gpio_config.gpio_pins = GPIO_PINS_9;
    gpio_init(GPIOC, &gpio_config);

    /* I2C初始化：速率100kHz */
    i2c_init(hi2c->i2cx, I2C_FSMODE_DUTY_2_1, 100000);
    i2c_own_address1_set(hi2c->i2cx, I2C_ADDRESS_MODE_7BIT, 0x10);
}

/* BME280 I2C初始化 */
static void bme280_iic_init(void)
{
    hi2c3.i2cx = I2C3;
    i2c_config(&hi2c3);
}

/* ---------- 内部函数声明 ---------- */
static uint16_t Bit_Modification(uint16_t Reg, int Bit_Start, int Bit_Stop, uint16_t Value);
static int BME280_ID(Sensor_BME280 *BME280, uint8_t *ID);
static int BME280_Read(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t *DATA, int DATA_NUM);
static int BME280_Write(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t DATA);
static int BME280_Configuration(Sensor_BME280 *BME280);
static int BME280_Reset(Sensor_BME280 *BME280);
static int BME280_Get_OLL(Sensor_BME280 *BME280, float *Temp, float *Hum, float *Press);
static int BME280_Get_DIG(Sensor_BME280 *BME280);
static int BME280_Get_Temp(Sensor_BME280 *BME280, float *DATA);
static int BME280_Get_Press(Sensor_BME280 *BME280, float *DATA);
static int BME280_Get_HUM(Sensor_BME280 *BME280, float *DATA);
static int BME280_Sleep(Sensor_BME280 *BME280);
static int BME280_UP(Sensor_BME280 *BME280);
static int BME280_IIC_Write(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t DATA);
static int BME280_IIC_Read(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t *DATA, int DATA_NUM);

/* ---------- 全局传感器对象 ---------- */
static Sensor_BME280 BME280_1;

/* 初始化函数 */
void BME280_Init(void)
{
    /* I2C底层初始化 */
    bme280_iic_init();

    /* 结构体参数配置 */
    printf("BME280_Init start\n");
    BME280_1.IIC_Aisle = hi2c3;
    BME280_1.IIC_ADDR = 0x76;
    BME280_1.BME280_Mode = BME280_Mode_Normal;
    BME280_1.BME280_IIR_Time = BME280_Filter_16;
    BME280_1.BME280_Tstandby = BME280_Tstandby_0_5;

    BME280_1.TEMP.TEMP_EN = BME280_Sensor_ON;
    BME280_1.TEMP.TEMP_Ove = BME280_Over_16;
    BME280_1.HUM.HUM_EN = BME280_Sensor_ON;
    BME280_1.HUM.HUM_Ove = BME280_Over_16;
    BME280_1.PRESS.PRESS_EN = BME280_Sensor_ON;
    BME280_1.PRESS.PRESS_Ove = BME280_Over_16;

    /* 复位设备 */
    if (BME280_Reset(&BME280_1) != BME280_OK) {
        printf("BME280_Reset 0x76 error\n");
    }
    osDelay(60);

    /* 读取芯片ID */
    uint8_t ID = 0;
    BME280_ID(&BME280_1, &ID);
    printf("BME280 ID: 0x%02X\n", ID);

    /* 读取补偿参数 */
    BME280_Get_DIG(&BME280_1);

    /* 配置传感器 */
    if (BME280_Configuration(&BME280_1) != BME280_OK) {
        printf("BME280_Configuration error\n");
    }

    /* 切换到正常模式 */
    BME280_UP(&BME280_1);
    osDelay(100);
    printf("BME280 initialized.\n");
}

/* 获取并打印温湿度压力数据（供任务调用） */
void Get_BME280_Value(float *DATA1)
{
    if (BME280_Get_OLL(&BME280_1, &DATA1[0], &DATA1[1], &DATA1[2]) != BME280_OK) {
        printf("BME280_Get_OLL error\n");
        return;
    }
    printf("[BME280] Temp=%.3f, Hum=%.3f%%, Press=%.3f hPa\n",
           DATA1[0], DATA1[1], DATA1[2]);
}

/* ---------- 功能函数实现 ---------- */

/* 一次读取温度、湿度、压力 */
static int BME280_Get_OLL(Sensor_BME280 *BME280, float *Temp, float *Hum, float *Press)
{
    uint8_t DATA_IN[8] = {0};
    if (BME280_Read(BME280, R_Press_MSB, DATA_IN, 8) != BME280_OK) {
        return BME280_Error;
    }

    uint32_t DAC_P = (DATA_IN[0] << 12) | (DATA_IN[1] << 4) | (DATA_IN[2] >> 4);
    uint32_t DAC_T = (DATA_IN[3] << 12) | (DATA_IN[4] << 4) | (DATA_IN[5] >> 4);
    uint32_t DAC_H = (DATA_IN[6] << 8) | DATA_IN[7];

    uint32_t Dig_T1 = BME280->DIG.DIG_T1;
    uint32_t Dig_T2 = BME280->DIG.DIG_T2;
    uint32_t Dig_T3 = BME280->DIG.DIG_T3;
    uint32_t Dig_H1 = BME280->DIG.DIG_H1;
    uint32_t Dig_H2 = BME280->DIG.DIG_H2;
    uint32_t Dig_H3 = BME280->DIG.DIG_H3;
    uint32_t Dig_H4 = BME280->DIG.DIG_H4;
    uint32_t Dig_H5 = BME280->DIG.DIG_H5;
    uint32_t Dig_H6 = BME280->DIG.DIG_H6;
    uint32_t Dig_P1 = BME280->DIG.DIG_P1;
    uint32_t Dig_P2 = BME280->DIG.DIG_P2;
    uint32_t Dig_P3 = BME280->DIG.DIG_P3;
    uint32_t Dig_P4 = BME280->DIG.DIG_P4;
    uint32_t Dig_P5 = BME280->DIG.DIG_P5;
    uint32_t Dig_P6 = BME280->DIG.DIG_P6;
    uint32_t Dig_P7 = BME280->DIG.DIG_P7;
    uint32_t Dig_P8 = BME280->DIG.DIG_P8;
    uint32_t Dig_P9 = BME280->DIG.DIG_P9;

    /* 温度补偿 */
    double T_var1 = (((double)DAC_T) / 16384.0 - ((double)Dig_T1) / 1024.0) * ((double)Dig_T2);
    double T_var2 = ((((double)DAC_T) / 131072.0 - ((double)Dig_T1) / 8192.0) *
                     (((double)DAC_T) / 131072.0 - ((double)Dig_T1) / 8192.0)) * ((double)Dig_T3);
    BME280->t_fine = (uint32_t)(T_var1 + T_var2);
    double T = (T_var1 + T_var2) / 5120.0;
    *Temp = (float)T;

    /* 湿度补偿 */
    double Var_H = ((double)BME280->t_fine) - 76800.0;
    Var_H = (DAC_H - (((double)Dig_H4) * 64.0 + ((double)Dig_H5) / 16384.0 * Var_H)) *
            (((double)Dig_H2) / 65536.0 * (1.0 + ((double)Dig_H6) / 67108864.0 * Var_H *
            (1.0 + ((double)Dig_H3) / 67108864.0 * Var_H)));
    Var_H = Var_H * (1.0 - ((double)Dig_H1) * Var_H / 524288.0);
    if (Var_H > 100.0) Var_H = 100.0;
    else if (Var_H < 0.0) Var_H = 0.0;
    *Hum = (float)Var_H;

    /* 压力补偿 */
    double P_var1 = ((double)BME280->t_fine / 2.0) - 64000.0;
    double P_var2 = P_var1 * P_var1 * ((double)Dig_P6) / 32768.0;
    P_var2 = P_var2 + P_var1 * ((double)Dig_P5) * 2.0;
    P_var2 = (P_var2 / 4.0) + (((double)Dig_P4) * 65536.0);
    P_var1 = (((double)Dig_P3) * P_var1 * P_var1 / 524288.0 + ((double)Dig_P2) * P_var1) / 524288.0;
    P_var1 = (1.0 + P_var1 / 32768.0) * ((double)Dig_P1);
    if (P_var1 == 0.0) return BME280_Error;
    double p = 1048576.0 - (double)DAC_P;
    p = (p - (P_var2 / 4096.0)) * 6250.0 / P_var1;
    P_var1 = ((double)Dig_P9) * p * p / 2147483648.0;
    P_var2 = p * ((double)Dig_P8) / 32768.0;
    p = (p + (P_var1 + P_var2 + ((double)Dig_P7)) / 16.0) / 100.0;
    *Press = (float)p;

    return BME280_OK;
}

/* 读取温度（单独） */
static int BME280_Get_Temp(Sensor_BME280 *BME280, float *DATA)
{
    uint8_t DATA_IN[3] = {0};
    if (BME280_Read(BME280, R_Temp_MSB, DATA_IN, 3) != BME280_OK) {
        return BME280_Error;
    }
    uint32_t DAC_T = (DATA_IN[0] << 12) | (DATA_IN[1] << 4) | (DATA_IN[2] >> 4);
    uint32_t Dig_T1 = BME280->DIG.DIG_T1;
    uint32_t Dig_T2 = BME280->DIG.DIG_T2;
    uint32_t Dig_T3 = BME280->DIG.DIG_T3;

    double var1 = (((double)DAC_T) / 16384.0 - ((double)Dig_T1) / 1024.0) * ((double)Dig_T2);
    double var2 = ((((double)DAC_T) / 131072.0 - ((double)Dig_T1) / 8192.0) *
                   (((double)DAC_T) / 131072.0 - ((double)Dig_T1) / 8192.0)) * ((double)Dig_T3);
    BME280->t_fine = (uint32_t)(var1 + var2);
    *DATA = (float)((var1 + var2) / 5120.0);
    return BME280_OK;
}

/* 读取湿度（单独） */
static int BME280_Get_HUM(Sensor_BME280 *BME280, float *DATA)
{
    uint8_t DATA_IN[2] = {0};
    if (BME280_Read(BME280, R_Hum_MSB, DATA_IN, 2) != BME280_OK) {
        return BME280_Error;
    }
    uint32_t DAC_H = (DATA_IN[0] << 8) | DATA_IN[1];
    uint32_t Dig_H1 = BME280->DIG.DIG_H1;
    uint32_t Dig_H2 = BME280->DIG.DIG_H2;
    uint32_t Dig_H3 = BME280->DIG.DIG_H3;
    uint32_t Dig_H4 = BME280->DIG.DIG_H4;
    uint32_t Dig_H5 = BME280->DIG.DIG_H5;
    uint32_t Dig_H6 = BME280->DIG.DIG_H6;

    double Var_H = ((double)BME280->t_fine) - 76800.0;
    Var_H = (DAC_H - (((double)Dig_H4) * 64.0 + ((double)Dig_H5) / 16384.0 * Var_H)) *
            (((double)Dig_H2) / 65536.0 * (1.0 + ((double)Dig_H6) / 67108864.0 * Var_H *
            (1.0 + ((double)Dig_H3) / 67108864.0 * Var_H)));
    Var_H = Var_H * (1.0 - ((double)Dig_H1) * Var_H / 524288.0);
    if (Var_H > 100.0) Var_H = 100.0;
    else if (Var_H < 0.0) Var_H = 0.0;
    *DATA = (float)Var_H;
    return BME280_OK;
}

/* 读取压力（单独） */
static int BME280_Get_Press(Sensor_BME280 *BME280, float *DATA)
{
    uint8_t DATA_IN[3] = {0};
    if (BME280_Read(BME280, R_Press_MSB, DATA_IN, 3) != BME280_OK) {
        return BME280_Error;
    }
    uint32_t DAC_P = (DATA_IN[0] << 12) | (DATA_IN[1] << 4) | (DATA_IN[2] >> 4);
    uint32_t Dig_P1 = BME280->DIG.DIG_P1;
    uint32_t Dig_P2 = BME280->DIG.DIG_P2;
    uint32_t Dig_P3 = BME280->DIG.DIG_P3;
    uint32_t Dig_P4 = BME280->DIG.DIG_P4;
    uint32_t Dig_P5 = BME280->DIG.DIG_P5;
    uint32_t Dig_P6 = BME280->DIG.DIG_P6;
    uint32_t Dig_P7 = BME280->DIG.DIG_P7;
    uint32_t Dig_P8 = BME280->DIG.DIG_P8;
    uint32_t Dig_P9 = BME280->DIG.DIG_P9;

    double var1 = ((double)BME280->t_fine / 2.0) - 64000.0;
    double var2 = var1 * var1 * ((double)Dig_P6) / 32768.0;
    var2 = var2 + var1 * ((double)Dig_P5) * 2.0;
    var2 = (var2 / 4.0) + (((double)Dig_P4) * 65536.0);
    var1 = (((double)Dig_P3) * var1 * var1 / 524288.0 + ((double)Dig_P2) * var1) / 524288.0;
    var1 = (1.0 + var1 / 32768.0) * ((double)Dig_P1);
    if (var1 == 0.0) return BME280_Error;
    double p = 1048576.0 - (double)DAC_P;
    p = (p - (var2 / 4096.0)) * 6250.0 / var1;
    var1 = ((double)Dig_P9) * p * p / 2147483648.0;
    var2 = p * ((double)Dig_P8) / 32768.0;
    p = (p + (var1 + var2 + ((double)Dig_P7)) / 16.0) / 100.0;
    *DATA = (float)p;
    return BME280_OK;
}

/* 读取补偿参数 */
static int BME280_Get_DIG(Sensor_BME280 *BME280)
{
    uint8_t DATA_T[6] = {0};
    if (BME280_Read(BME280, R_DIG_T1_MSB, DATA_T, 6) != BME280_OK)
        return BME280_Error;
    BME280->DIG.DIG_T1 = (DATA_T[1] << 8) | DATA_T[0];
    BME280->DIG.DIG_T2 = (DATA_T[3] << 8) | DATA_T[2];
    BME280->DIG.DIG_T3 = (DATA_T[5] << 8) | DATA_T[4];

    uint8_t DATA_P[18] = {0};
    if (BME280_Read(BME280, R_DIG_P1_MSB, DATA_P, 18) != BME280_OK)
        return BME280_Error;
    BME280->DIG.DIG_P1 = (DATA_P[1] << 8) | DATA_P[0];
    BME280->DIG.DIG_P2 = (DATA_P[3] << 8) | DATA_P[2];
    BME280->DIG.DIG_P3 = (DATA_P[5] << 8) | DATA_P[4];
    BME280->DIG.DIG_P4 = (DATA_P[7] << 8) | DATA_P[6];
    BME280->DIG.DIG_P5 = (DATA_P[9] << 8) | DATA_P[8];
    BME280->DIG.DIG_P6 = (DATA_P[11] << 8) | DATA_P[10];
    BME280->DIG.DIG_P7 = (DATA_P[13] << 8) | DATA_P[12];
    BME280->DIG.DIG_P8 = (DATA_P[15] << 8) | DATA_P[14];
    BME280->DIG.DIG_P9 = (DATA_P[17] << 8) | DATA_P[16];

    uint8_t DATA_H_A1 = 0;
    uint8_t DATA_H[7] = {0};
    if (BME280_Read(BME280, R_DIG_H1, &DATA_H_A1, 1) != BME280_OK)
        return BME280_Error;
    if (BME280_Read(BME280, R_DIG_H2_LSB, DATA_H, 7) != BME280_OK)
        return BME280_Error;
    BME280->DIG.DIG_H1 = DATA_H_A1;
    BME280->DIG.DIG_H2 = (DATA_H[1] << 8) | DATA_H[0];
    BME280->DIG.DIG_H3 = DATA_H[2];
    BME280->DIG.DIG_H4 = (DATA_H[3] << 4) | ((DATA_H[4] >> 4) & 0x0F);
    BME280->DIG.DIG_H5 = ((DATA_H[4] & 0x0F) << 4) | (DATA_H[5] >> 4);
    BME280->DIG.DIG_H6 = DATA_H[6];
    return BME280_OK;
}

/* 配置传感器 */
static int BME280_Configuration(Sensor_BME280 *BME280)
{
    uint8_t DATA_Config = 0;
    uint8_t DATA_Ctrl_Hum = 0;
    uint8_t DATA_Ctrl_Meas = 0;

    /* Config寄存器 (Tstandby + Filter) */
    if (BME280->BME280_Tstandby == BME280_Tstandby_0_5  ||
        BME280->BME280_Tstandby == BME280_Tstandby_62_5 ||
        BME280->BME280_Tstandby == BME280_Tstandby_125  ||
        BME280->BME280_Tstandby == BME280_Tstandby_250  ||
        BME280->BME280_Tstandby == BME280_Tstandby_500  ||
        BME280->BME280_Tstandby == BME280_Tstandby_1000 ||
        BME280->BME280_Tstandby == BME280_Tstandby_10   ||
        BME280->BME280_Tstandby == BME280_Tstandby_20) {
        DATA_Config = Bit_Modification(DATA_Config, 5, 7, BME280->BME280_Tstandby);
    } else {
        return BME280_Error;
    }
    if (BME280->BME280_IIR_Time == BME280_Filter_OFF ||
        BME280->BME280_IIR_Time == BME280_Filter_2   ||
        BME280->BME280_IIR_Time == BME280_Filter_4   ||
        BME280->BME280_IIR_Time == BME280_Filter_8   ||
        BME280->BME280_IIR_Time == BME280_Filter_16) {
        DATA_Config = Bit_Modification(DATA_Config, 2, 4, BME280->BME280_IIR_Time);
    }

    /* Ctrl_Hum寄存器 */
    if (BME280->HUM.HUM_EN == BME280_Sensor_ON) {
        if (BME280->HUM.HUM_Ove == BME280_Over_1  ||
            BME280->HUM.HUM_Ove == BME280_Over_2  ||
            BME280->HUM.HUM_Ove == BME280_Over_4  ||
            BME280->HUM.HUM_Ove == BME280_Over_8  ||
            BME280->HUM.HUM_Ove == BME280_Over_16) {
            DATA_Ctrl_Hum = Bit_Modification(DATA_Ctrl_Hum, 0, 2, BME280->HUM.HUM_Ove);
        } else {
            return BME280_Error;
        }
    } else if (BME280->HUM.HUM_EN == BME280_Sensor_OFF) {
        DATA_Ctrl_Hum = Bit_Modification(DATA_Ctrl_Hum, 0, 2, 0);
    } else {
        return BME280_Error;
    }

    /* Ctrl_Meas寄存器 (温度过采样, 压力过采样, 模式) */
    if (BME280->TEMP.TEMP_EN == BME280_Sensor_ON) {
        if (BME280->TEMP.TEMP_Ove == BME280_Over_1  ||
            BME280->TEMP.TEMP_Ove == BME280_Over_2  ||
            BME280->TEMP.TEMP_Ove == BME280_Over_4  ||
            BME280->TEMP.TEMP_Ove == BME280_Over_8  ||
            BME280->TEMP.TEMP_Ove == BME280_Over_16) {
            DATA_Ctrl_Meas = Bit_Modification(DATA_Ctrl_Meas, 5, 7, BME280->TEMP.TEMP_Ove);
        } else {
            return BME280_Error;
        }
    } else if (BME280->TEMP.TEMP_EN == BME280_Sensor_OFF) {
        DATA_Ctrl_Meas = Bit_Modification(DATA_Ctrl_Meas, 5, 7, 0);
    } else {
        return BME280_Error;
    }

    if (BME280->PRESS.PRESS_EN == BME280_Sensor_ON) {
        if (BME280->PRESS.PRESS_Ove == BME280_Over_1  ||
            BME280->PRESS.PRESS_Ove == BME280_Over_2  ||
            BME280->PRESS.PRESS_Ove == BME280_Over_4  ||
            BME280->PRESS.PRESS_Ove == BME280_Over_8  ||
            BME280->PRESS.PRESS_Ove == BME280_Over_16) {
            DATA_Ctrl_Meas = Bit_Modification(DATA_Ctrl_Meas, 2, 4, BME280->PRESS.PRESS_Ove);
        } else {
            return BME280_Error;
        }
    } else if (BME280->PRESS.PRESS_EN == BME280_Sensor_OFF) {
        DATA_Ctrl_Meas = Bit_Modification(DATA_Ctrl_Meas, 2, 4, 0);
    } else {
        return BME280_Error;
    }

    if (BME280->BME280_Mode == BME280_Mode_Sleep ||
        BME280->BME280_Mode == BME280_Mode_Forced ||
        BME280->BME280_Mode == BME280_Mode_Normal) {
        DATA_Ctrl_Meas = Bit_Modification(DATA_Ctrl_Meas, 0, 1, BME280->BME280_Mode);
    } else {
        return BME280_Error;
    }

    /* 写入三个寄存器，顺序要求：Config, Ctrl_Hum, Ctrl_Meas */
    if (BME280_Write(BME280, R_Config, DATA_Config) != BME280_OK)
        return BME280_Error;
    if (BME280_Write(BME280, R_Ctrl_Hum, DATA_Ctrl_Hum) != BME280_OK)
        return BME280_Error;
    if (BME280_Write(BME280, R_Ctrl_Meas, DATA_Ctrl_Meas) != BME280_OK)
        return BME280_Error;
    return BME280_OK;
}

/* 复位 */
static int BME280_Reset(Sensor_BME280 *BME280)
{
    if (BME280_Write(BME280, R_Reset, 0xB6) != BME280_OK)
        return BME280_Error;
    return BME280_OK;
}

/* 睡眠模式 */
static int BME280_Sleep(Sensor_BME280 *BME280)
{
    BME280->BME280_Mode = BME280_Mode_Sleep;
    if (BME280_Configuration(BME280) != BME280_OK)
        return BME280_Error;
    return BME280_OK;
}

/* 正常模式 */
static int BME280_UP(Sensor_BME280 *BME280)
{
    BME280->BME280_Mode = BME280_Mode_Normal;
    if (BME280_Configuration(BME280) != BME280_OK)   // 修正：传递指针本身
        return BME280_Error;
    return BME280_OK;
}

/* 读取ID */
static int BME280_ID(Sensor_BME280 *BME280, uint8_t *ID)
{
    if (BME280_Read(BME280, R_ID, ID, 1) != BME280_OK)
        return BME280_Error;
    return BME280_OK;
}

/* ---------- I2C底层读写 ---------- */
static int BME280_IIC_Write(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t DATA)
{
    uint8_t DATA_OUT[2] = {ADDR, DATA};
    i2c_status_type state = i2c_master_transmit(&(BME280->IIC_Aisle),
                                                (BME280->IIC_ADDR << 1) | 0x0,
                                                DATA_OUT, 2, 0xFFFF);
    if (state != I2C_OK) {
        printf("BME280_IIC_Write error: %d\n", state);
        return BME280_Error;
    }
    return BME280_OK;
}

static int BME280_IIC_Read(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t *DATA, int DATA_NUM)
{
    i2c_status_type state;
    /* 先写寄存器地址 */
    state = i2c_master_transmit(&(BME280->IIC_Aisle),
                                (BME280->IIC_ADDR << 1) | 0x0,
                                &ADDR, 1, 0xFFFF);
    if (state != I2C_OK) {
        printf("BME280_IIC_Read transmit error: %d\n", state);
        return BME280_Error;
    }
    /* 再读数据 */
    state = i2c_master_receive(&(BME280->IIC_Aisle),
                               (BME280->IIC_ADDR << 1) | 0x0,
                               DATA, DATA_NUM, 0xFFFF);
    if (state != I2C_OK) {
        printf("BME280_IIC_Read receive error: %d\n", state);
        return BME280_Error;
    }
    return BME280_OK;
}

/* 统一写接口 */
static int BME280_Write(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t DATA)
{
    if (BME280_IIC_Write(BME280, ADDR, DATA) != BME280_OK)
        return BME280_Error;
    return BME280_OK;
}

/* 统一读接口 */
static int BME280_Read(Sensor_BME280 *BME280, uint8_t ADDR, uint8_t *DATA, int DATA_NUM)
{
    if (BME280_IIC_Read(BME280, ADDR, DATA, DATA_NUM) != BME280_OK)
        return BME280_Error;
    return BME280_OK;   // 补上返回值
}

/* 位操作函数 */
static uint16_t Bit_Modification(uint16_t Reg, int Bit_Start, int Bit_Stop, uint16_t Value)
{
    uint16_t mask = 0xFFFF;
    for (int i = Bit_Start; i <= Bit_Stop; i++) {
        mask &= ~(1 << i);
    }
    Reg &= mask;
    Reg |= (Value << Bit_Start);
    return Reg;
}