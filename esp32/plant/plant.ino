#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"
#include "secrets.h"
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
FirebaseData data;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  Serial.begin(115200);
  //starts dht.
  dht.begin();
  //starts wifi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  //begins loop to wait for wifi to connect.
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(2000);
  }
  Serial.println("\nConnected to Wi-Fi");

  //firebase configuration
  config.host = FIREBASE_HOST;
  config.api_key = FIREBASE_AUTH;
  //fire base authenitcation
  auth.user.email = EMAIL;
  auth.user.password = EMAIL_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  //prevents output if firebase is not ready.
  if (!Firebase.ready()) return;
  //checks temperature and humidity.
  checkTemp();

  //checks moisture
  checkMoisture();

  //reads light value from photoresistor as analog.
  lightVal = analogRead(lightPin);

  if (Firebase.setFloat(data, "/sensors/lightLevel", lightVal)) {
    Serial.println("Light Level: " + String(lightVal));
  } else {
    Serial.println("Light failed: " + data.errorReason());
  }
  //waits 30 seconds until the next send.
  delay(10000);
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

  //outputs for both temp and humidity to firebase.
  if (Firebase.setFloat(data, "/sensors/temperature", temp)) {
    Serial.println("Temperature: " + String(temp));
  } else {
    Serial.println("Temperature failed: " + data.errorReason());
  }

  if (Firebase.setFloat(data, "/sensors/humidity", hum)) {
    Serial.println("Humidity: " + String(hum));
  } else {
    Serial.println("Humidity failed: " + data.errorReason());
  }
}

//checks moisture and outputs it to firebase.
void checkMoisture() {
  //checks moisture level.
  int moist = analogRead(moistPin);
  //limits values within 100 percent range
  int moistPercent = map(moist, maxWet, maxDry, 0, 100);
  moistPercent = constrain(moistPercent, 0, 100);

  if (Firebase.setFloat(data, "/sensors/moisture", moistPercent)) {
    Serial.println("Moisture Percent: " + String(moistPercent));
  } else {
    Serial.println("Moisture failed: " + data.errorReason());
  }
}