#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// Инициализация с явным указанием адреса из твоего рабочего примера
Adafruit_PWMServoDriver pca9685 = Adafruit_PWMServoDriver(0x40);

// Новые, проверенные рабочие значения
#define SERVOMIN  80   
#define SERVOMAX  600  

// Каналы для твоего проекта
#define MOUTH_CH   0
#define HEAD_CH    1
#define EYE_LR_CH  2
#define EYELID_CH  3

void setup() {
  Serial.begin(115200);
  Serial.println("Hardware Test: Smooth Movement");

  pca9685.begin();
  pca9685.setPWMFreq(50);
  delay(10);
}

void loop() {
  // Плавное движение всех 4-х сервоприводов от 0 до 180
  for (int posDegrees = 0; posDegrees <= 180; posDegrees++) {
    int pulse = map(posDegrees, 0, 180, SERVOMIN, SERVOMAX);
    
    pca9685.setPWM(MOUTH_CH, 0, pulse);
    pca9685.setPWM(HEAD_CH, 0, pulse);
    pca9685.setPWM(EYE_LR_CH, 0, pulse);
    pca9685.setPWM(EYELID_CH, 0, pulse);
    
    Serial.print("Angle = ");
    Serial.println(posDegrees);
    delay(15); // Задержка 15мс для плавности
  }

  delay(500); // Небольшая пауза в крайнем положении

  // Плавное возвращение от 180 обратно к 0
  for (int posDegrees = 180; posDegrees >= 0; posDegrees--) {
    int pulse = map(posDegrees, 0, 180, SERVOMIN, SERVOMAX);
    
    pca9685.setPWM(MOUTH_CH, 0, pulse);
    pca9685.setPWM(HEAD_CH, 0, pulse);
    pca9685.setPWM(EYE_LR_CH, 0, pulse);
    pca9685.setPWM(EYELID_CH, 0, pulse);
    
    Serial.print("Angle = ");
    Serial.println(posDegrees);
    delay(15);
  }
  
  delay(500); // Небольшая пауза перед новым циклом
}