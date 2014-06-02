#include <Timer.h>

Timer t;

long interval = 50;
unsigned long last = 0;
boolean Aon = false;
boolean Bon = false;
boolean Con = false;
boolean running = false;
char input = '0';

void setup() {
  // initialize serial communication at 115200 bits per second:
  Serial.begin(115200);
  int timer = t.every(interval, mainLoop, (void*)0);
}

void loop() {
  Aon = false;
  Bon = false;
  Con = false;
  while (Serial.available() <= 0) {
    Serial.println("LABBOOK DATAHUB V1.0");   // send a capital A
    delay(300);
  }
  running = true;
  while (running) {
    t.update();
    unsigned long temp = millis() % 10;
    if (temp >= 5) {
      delay(interval - temp);
    }
  }
  //timer = Serial.read();
}

void sendIds() {
  Serial.print("IA");  
  Serial.print(analogRead(A0));
  Serial.print("B");
  Serial.print(analogRead(A2));
  Serial.print("C");
  Serial.println(analogRead(A4));
}
  
void mainLoop(void *context) {
  if (Aon) {
    Serial.print("A");
    Serial.print(analogRead(A1));
  }
  if (Bon) {
    Serial.print("B");
    Serial.print(analogRead(A3));
  }
  if (Con) {
    Serial.print("C");
    Serial.print(analogRead(A5));
  }
  Serial.print("T");
  Serial.println(millis());
  if (Serial.available() > 0) {
    input = Serial.read();
    switch (input) {
      case 'A':
        Aon = !Aon;
        break;
    case 'B':
      Bon = !Bon;
      break;
    case 'C':
      Con = !Con;
      break;
    case 'D':
      running = false;
      break;
    case 'I':
      sendIds();
      break;
    default:
      true;
    }
  }
}
