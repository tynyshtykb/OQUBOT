void setup() {
Serial.begin(115200);
pinMode(2,OUTPUT);
}

void loop() {
char a = Serial.read();
if(a == 'p') {
digitalWrite(2,1);
}
else digitalWrite(2,0);

delay(500);
}
