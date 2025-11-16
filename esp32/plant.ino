#include <WiFi.h>
#include "DHT.h"
#define DHTTYPE DHT11

//pins
const int lightPin = 32;
const int tempPin = 33;
const int moistPin = 34;

//variables
int lightVal;
DHT dht(tempPin, DHTTYPE);
const int maxDry = 3500;  // max value for soil dryness.
const int maxWet = 800;   // max value for soil wetness.

void setup() {
  Serial.begin(115200);
  //starts dht.
  dht.begin();
}

void loop() {
  //checks temperature and humidity.
  checkTemp();

  //checks moisture
  checkMoisture();

  //reads light value from photoresistor as analog.
  lightVal = analogRead(lightPin);
  delay(2000);

  Serial.print("light: ");
  Serial.println(lightVal);
}


//checks temperature and humidity and outputs it.
void checkTemp() {
  //reads the humidity.
  float hum = dht.readHumidity();
  //reads temperature in fahrenheit
  float temp = dht.readTemperature(true);

  //checks for errors in read. exit before more errors incur and loop again.
  if (isnan(hum) || isnan(temp)) {
    return;
  }

  //outputs for both temp and humidity
  Serial.print("hum: ");
  Serial.println(hum);

  Serial.print("temp: ");
  Serial.println(temp);
}

//checks moisture and outputs it.
void checkMoisture() {
  //checks moisture level.
  int moist = analogRead(moistPin);
  //limits values within 100 percent range
  int moistPercent = map(moist, maxWet, maxDry, 0, 100);
  moistPercent = constrain(moistPercent, 0, 100);

  Serial.print("moisture: ");
  Serial.print(moistPercent);
  Serial.println(" %");
}