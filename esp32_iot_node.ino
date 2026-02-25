/**
 * Smart Classroom Energy Monitor - ESP32 Firmware
 * Developed for SmartEdge Solutions
 *
 * Dependencies:
 * - Firebase ESP Client (by Mobizt)
 */

#include <Firebase_ESP_Client.h>
#include <WiFi.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info.
#include "addons/RTDBHelper.h"

// 1. WiFi Credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// 2. Firebase Credentials
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_DATABASE_URL"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

// Simulated Sensor Data (Replace with real sensor reads)
float temperature = 25.0;
bool isOccupied = true;

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase ok");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see
                                                      // addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK &&
      (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // --- READ YOUR SENSORS HERE ---
    // Example: temperature = dht.readTemperature();
    // Example: isOccupied = digitalRead(PIR_PIN);

    // Simulate some changes for testing
    temperature += (random(-5, 6) / 10.0);
    if (random(0, 100) > 90)
      isOccupied = !isOccupied;

    // Send Temperature to Firebase
    if (Firebase.RTDB.setFloat(&fbdo, "classroom/temperature", temperature)) {
      Serial.print("Temp Sent: ");
      Serial.println(temperature);
    } else {
      Serial.println("FAILED: " + fbdo.errorReason());
    }

    // Send Occupancy Status to Firebase
    if (Firebase.RTDB.setBool(&fbdo, "classroom/occupancy", isOccupied)) {
      Serial.print("Occupancy Sent: ");
      Serial.println(isOccupied ? "YES" : "NO");

      // Send Occupancy Count (Simulated)
      int peopleCount = isOccupied ? random(5, 30) : 0;
      if (Firebase.RTDB.setInt(&fbdo, "classroom/occupancy_count",
                               peopleCount)) {
        Serial.print("Count Sent: ");
        Serial.println(peopleCount);
      }
    } else {
      Serial.println("FAILED: " + fbdo.errorReason());
    }
  }
}
