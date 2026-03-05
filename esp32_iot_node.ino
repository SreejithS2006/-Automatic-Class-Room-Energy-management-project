/**
 * Smart Classroom Energy Monitor - Integrated ESP32 Firmware
 * Developed for SmartEdge Solutions
 *
 * Integrated Hardware Logic:
 * - DHT11 (Temperature)
 * - Dual IR Sensor (Bidirectional People Counter)
 *
 * Dependencies:
 * - Firebase ESP Client (by Mobizt)
 * - DHT sensor library (by Adafruit)
 * - Adafruit Unified Sensor (by Adafruit)
 */

#include <DHT.h>
#include <Firebase_ESP_Client.h>
#include <WiFi.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info.
#include "addons/RTDBHelper.h"

// 1. WiFi Credentials
#define WIFI_SSID "sreejith"
#define WIFI_PASSWORD "Sreejith2"

// 2. Firebase Credentials (Pre-filled for your project)
#define API_KEY "AIzaSyCfZuHB13YusjkMBnbpq0rZ32_2c_thkto"
#define DATABASE_URL                                                           \
  "https://auto-classroom-energy-manager-default-rtdb.firebaseio.com"

// 3. Hardware Pins
#define DHTPIN 4
#define DHTTYPE DHT11
#define LDR_PIN 34 // Analog pin for LDR sensor
#define IR1 18
#define IR2 19

// 4. Constants
#define TIMEOUT 2000
#define SEND_INTERVAL 5000

// Objects
DHT dht(DHTPIN, DHTTYPE);
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// State Variables
unsigned long sendDataPrevMillis = 0;
unsigned long triggerTime = 0;
bool signupOK = false;
int peopleCount = 0;
float dailyUsage = 0.0; // Accumulated kWh

enum State { IDLE, ENTRY_WAIT, EXIT_WAIT };
State currentState = IDLE;

void setup() {
  Serial.begin(115200);

  // Sensor Setup
  pinMode(IR1, INPUT_PULLUP);
  pinMode(IR2, INPUT_PULLUP);
  dht.begin();

  // WiFi Setup
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Firebase Setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase Signup OK");
    signupOK = true;
  } else {
    Serial.printf("Signup Error: %s\n",
                  config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // -------- PEOPLE COUNTING (BI-DIRECTIONAL) --------
  bool s1 = digitalRead(IR1) == LOW;
  bool s2 = digitalRead(IR2) == LOW;

  switch (currentState) {
  case IDLE:
    if (s1 && !s2) {
      currentState = ENTRY_WAIT;
      triggerTime = millis();
    } else if (s2 && !s1) {
      currentState = EXIT_WAIT;
      triggerTime = millis();
    }
    break;

  case ENTRY_WAIT:
    if (s2) {
      peopleCount++;
      Serial.print("Entered | Total: ");
      Serial.println(peopleCount);
      currentState = IDLE;
      delay(300);
    } else if (millis() - triggerTime > TIMEOUT) {
      currentState = IDLE;
    }
    break;

  case EXIT_WAIT:
    if (s1) {
      if (peopleCount > 0)
        peopleCount--;
      Serial.print("Exited | Total: ");
      Serial.println(peopleCount);
      currentState = IDLE;
      delay(300);
    } else if (millis() - triggerTime > TIMEOUT) {
      currentState = IDLE;
    }
    break;
  }

  // -------- SEND DATA TO FIREBASE --------
  if (Firebase.ready() && signupOK &&
      (millis() - sendDataPrevMillis > SEND_INTERVAL ||
       sendDataPrevMillis == 0)) {
    unsigned long currentMillis = millis();
    float timeDiffHours =
        (currentMillis -
         (sendDataPrevMillis == 0 ? currentMillis : sendDataPrevMillis)) /
        3600000.0;
    sendDataPrevMillis = currentMillis;

    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    bool occupancy = (peopleCount > 0);

    // Calculate Dynamic Power Load
    float powerLoad = 0.0;
    if (occupancy) {
      powerLoad = 40.0 + (peopleCount * 2.0);
      powerLoad += (random(-20, 21) / 10.0);
    }

    dailyUsage += (powerLoad * timeDiffHours) / 1000.0;

    // --- Smart Device Logic ---
    int fanSpeed = 0;
    int brightness = 0;
    int rawLDR = analogRead(LDR_PIN);
    // Map raw ADC (0-4095) to percentage (0-100)
    // Inverting map if LDR resistance decreases with light
    int ldr_value = map(rawLDR, 0, 4095, 0, 100);

    if (occupancy) {
      if (temp > 22.0) {
        fanSpeed = 20 + (int)((temp - 22.0) * 10);
        if (fanSpeed > 100)
          fanSpeed = 100;
      } else {
        fanSpeed = 20;
      }
      brightness = (peopleCount > 4) ? 100 : 80;
    }

    Serial.println("--- Syncing with Firebase ---");

    FirebaseJson json;
    // Only send temperature if it's a valid number
    if (!isnan(temp)) {
      json.set("temperature", temp);
    } else {
      Serial.println("Note: DHT Temperature sensor not detected");
      json.set("temperature", "N/A");
    }

    // Only send humidity if it's a valid number
    if (!isnan(hum)) {
      json.set("humidity", hum);
    } else {
      Serial.println("Note: DHT Humidity sensor not detected");
      json.set("humidity", "N/A");
    }

    json.set("occupancy", occupancy);
    json.set("occupancy_count", peopleCount);
    json.set("power_load", powerLoad);
    json.set("daily_usage", dailyUsage);
    json.set("fan_speed", fanSpeed);
    json.set("brightness", brightness);
    json.set("ldr_value", ldr_value); // New LDR reading
    json.set("network", true);

    // Heartbeat: Use Firebase server time
    FirebaseJson lastSeen;
    lastSeen.set(".sv", "timestamp");
    json.set("last_seen", lastSeen);

    if (Firebase.RTDB.updateNode(&fbdo, "/classroom", &json)) {
      Serial.println("Update Successful!");
      if (!isnan(temp)) {
        Serial.print("Temp: ");
        Serial.print(temp);
        Serial.println("°C");
      }
      if (!isnan(hum)) {
        Serial.print("Humidity: ");
        Serial.print(hum);
        Serial.println("%");
      }
      Serial.print("People: ");
      Serial.println(peopleCount);
      Serial.print("Fan: ");
      Serial.print(fanSpeed);
      Serial.println("%");
      Serial.print("Brightness: ");
      Serial.print(brightness);
      Serial.println("%");
      Serial.print("Daily Usage: ");
      Serial.print(dailyUsage, 6);
      Serial.println(" kWh");
    } else {
      Serial.print("Update FAILED: ");
      Serial.println(fbdo.errorReason());
    }
  }
}
