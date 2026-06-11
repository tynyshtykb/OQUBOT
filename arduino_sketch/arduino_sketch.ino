#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// PCA9685
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// Настройки серв
#define SERVOMIN  150
#define SERVOMAX  300

// Количество серв
#define SERVO_COUNT 8

// Каналы серв
int servos[SERVO_COUNT] = {0, 4, 5, 6, 7, 8, 9, 10};

void setup() {

  Serial.begin(115200);

  pwm.begin();

  // Частота для серв
  pwm.setPWMFreq(50);

  delay(10);

  Serial.println("6 Servo Ready");

  // Стартовая позиция
  for (int i = 0; i < SERVO_COUNT; i++) {
    setServoAngle(servos[i], 90);
  }

  delay(1000);
}

void loop() {

  // Все в 0 градусов
  for (int i = 0; i < SERVO_COUNT; i++) {
    setServoAngle(servos[i], 0);
  }

  delay(1000);

  // Все в 90 градусов
  for (int i = 0; i < SERVO_COUNT; i++) {
    setServoAngle(servos[i], 90);
  }

  delay(1000);

  // Все в 180 градусов
  for (int i = 0; i < SERVO_COUNT; i++) {
    setServoAngle(servos[i], 180);
  }

  delay(1000);

  // Эффект волны
  for (int i = 0; i < SERVO_COUNT; i++) {

    setServoAngle(servos[i], 180);
    delay(300);

    setServoAngle(servos[i], 0);
    delay(300);
  }
}
void setServoAngle(int channel, int angle) {

  int pulse = map(angle, 0, 180, SERVOMIN, SERVOMAX);

  pwm.setPWM(channel, 0, pulse);

  Serial.print("Servo ");
  Serial.print(channel);
  Serial.print(" -> ");
  Serial.println(angle);
}