void setup() {
  // initialize serial communication at 115200 bits per second:
  Serial.begin(115200);
}
int noisetollerance =25;
  int aa1=0;
  int aa2=0;
  int aa3=0;
  int aa4=0;
  int aa5=0;
  int errors;
// the loop routine runs over and over again forever:
void loop() {
  // read the input on analog pin 0:
  aa5 =aa4;
  aa4 = aa3;
  aa3 = aa2;
  aa2 = aa1;
  aa1 = analogRead(A0);
  asum=;
  if (abs((aa1+aa2+aa3+aa4+aa5)/5-aa3)> noisetollerance){
    aa3 = aa4;
    errors = errors+1;
  }
  Serial.print("A");
  Serial.println(aa5);
}
