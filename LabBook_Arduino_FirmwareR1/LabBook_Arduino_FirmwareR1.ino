void setup() {
  // initialize serial communication at 115200 bits per second:
  Serial.begin(115200);
}
String port ="A0";
int portnum=0;
// the loop routine runs over and over again forever:
void loop() {
  if (Serial.available() > 0) {
    char response=Serial.read();
    if (response >= '0' && response <= '4') {
      int portnum= response-'0';
    }
    switch (portnum) {
    case 0:
    port ="A0";
      break;
    case 1:
    port ="A1";
      break;
    case 2:
    port ="A2";
      break;
    case 3:
    port ="A3";
      break;
    case 4:
    port ="A4";
      break;
    default: 
    port ="A0";
  }
    Serial.print("A");
    Serial.print(analogRead(A0));
    Serial.print("T");
    Serial.println(millis());
  }
}
