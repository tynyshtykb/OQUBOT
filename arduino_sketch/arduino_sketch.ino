#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// PCA9685
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

// Настройки серв
#define SERVOMIN  150
#define SERVOMAX  300

// ── Маппинг каналов PCA9685 ──
// Система глаз = 6 серво на каналах 0..5
#define EYE_UD_CH     0   // глаза вверх/вниз
#define EYE_LR_CH     1   // глаза влево/вправо
#define EYELID_UL_CH  2   // верхнее веко, левое серво
#define EYELID_UR_CH  3   // верхнее веко, правое серво
#define EYELID_LL_CH  4   // нижнее веко, левое серво
#define EYELID_LR_CH  5   // нижнее веко, правое серво
// Остальная механика
#define MOUTH_CH      6   // рот
#define HEAD_CH       7   // голова
// LED — это GPIO ESP32 (НЕ канал PCA9685)
#define LED_PIN       2

// Серво для стартовой центровки (в положение 90°)
const int init_channels[] = {
  EYE_UD_CH, EYE_LR_CH,
  EYELID_UL_CH, EYELID_UR_CH, EYELID_LL_CH, EYELID_LR_CH,
  MOUTH_CH, HEAD_CH
};

void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  pwm.begin();
  pwm.setPWMFreq(50);   // частота для серв
  delay(10);

  Serial.println("OquBot Hardware Ready");

  // Стартовая позиция

}

void loop() {
  if (!Serial.available()) return;

  String cmd = Serial.readStringUntil('\n');
  cmd.trim();
  if (cmd.length() == 0) return;

  int sepIndex = cmd.indexOf(':');
  if (sepIndex == -1) {
    Serial.println("ERR BAD FORMAT");
    return;
  }

  String key = cmd.substring(0, sepIndex);
  String valStr = cmd.substring(sepIndex + 1);
  int angle = valStr.toInt();

  // ── Рот / голова ──
  if (key == "MOUTH_ANGLE")      { setServoAngle(MOUTH_CH, angle);     Serial.println("OK MOUTH_ANGLE"); }
  else if (key == "HEAD_ANGLE")  { setServoAngle(HEAD_CH, angle);      Serial.println("OK HEAD_ANGLE"); }

  // ── Система глаз (6 серво) ──
  else if (key == "EYE_UD")      { setServoAngle(EYE_UD_CH, angle);    Serial.println("OK EYE_UD"); }
  else if (key == "EYE_LR")      { setServoAngle(EYE_LR_CH, angle);    Serial.println("OK EYE_LR"); }
  else if (key == "EYELID_UL")   { setServoAngle(EYELID_UL_CH, angle); Serial.println("OK EYELID_UL"); }
  else if (key == "EYELID_UR")   { setServoAngle(EYELID_UR_CH, angle); Serial.println("OK EYELID_UR"); }
  else if (key == "EYELID_LL")   { setServoAngle(EYELID_LL_CH, angle); Serial.println("OK EYELID_LL"); }
  else if (key == "EYELID_LR")   { setServoAngle(EYELID_LR_CH, angle); Serial.println("OK EYELID_LR"); }

  // ── LED ──
  else if (key == "LED")         { digitalWrite(LED_PIN, angle ? HIGH : LOW); Serial.println("OK LED"); }

  // ── Звук воспроизводится на стороне ПК ──
  else if (key == "VOLUME" || key == "PLAY_SOUND") { Serial.println("OK " + key); }

  else { Serial.println("ERR UNKNOWN CMD"); }
}

void setServoAngle(int channel, int angle) {
  angle = constrain(angle, 0, 180);
  int pulse = map(angle, 0, 180, SERVOMIN, SERVOMAX);
  pwm.setPWM(channel, 0, pulse);
}
