 #include <Arduino.h>
#include <Stream.h>

//dht sensor includes

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

//AWS
#include "sha256.h"
#include "Utils.h"

//WEBSockets
#include <Hash.h>
#include <WebSocketsClient.h>


//MQTT PUBSUBCLIENT LIB
#include <PubSubClient.h>

//AWS MQTT Websocket
#include "Client.h"
#include "AWSWebSocketClient.h"
#include "CircularByteBuffer.h"


extern "C" {
  #include "user_interface.h"
}


//AWS IOT config, change these:
char wifi_ssid[]       = "esiot";
char wifi_password[]   = "ttt33333";
char aws_endpoint[]    = "a24tnq52e443wf-ats.iot.us-east-2.amazonaws.com";
char aws_key[]         = "aws_key";
char aws_secret[]      = "aws_secret";
char aws_region[]      = "us-east-2";
const char* aws_topic  = "topic_1";
int port = 443;


//MQTT config
const int maxMQTTpackageSize = 512;
const int maxMQTTMessageHandlers = 1;

const int sensor_pin = A0;  /* Connect Soil moisture analog sensor pin to A0 of NodeMCU */


ESP8266WiFiMulti WiFiMulti;

AWSWebSocketClient awsWSclient(1000);

PubSubClient client(awsWSclient);

//# of connections
long connection = 0;


//generate random mqtt clientID
char* generateClientID () {
  char* cID = new char[23]();
  for (int i=0; i<22; i+=1)
    cID[i]=(char)random(1, 256);
  return cID;
}


//count messages arrived
int arrivedcount = 0;


//callback to handle mqtt messages
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}


//connects to websocket layer and mqtt layer
bool connect () {

    if (client.connected()) {
        client.disconnect ();
    }
    //delay is not necessary... it just help us to get a "trustful" heap space value
    delay (1000);
    Serial.print (millis ());
    Serial.print (" - conn: ");
    Serial.print (++connection);
    Serial.print (" - (");
    Serial.print (ESP.getFreeHeap ());
    Serial.println (")");

    //creating random client id
    char* clientID = generateClientID ();

    client.setServer(aws_endpoint, port);
    if (client.connect(clientID)) {
      Serial.println("connected");
      return true;
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      return false;
    }

}


//subscribe to a mqtt topic
void subscribe () {
    client.setCallback(callback);
    client.subscribe(aws_topic);
   //subscript to a topic
    Serial.println("MQTT subscribed");
}


//send a message to a mqtt topic
void sendmessage (float data) {
    //send a message
    char buf[100];
    char str[20]  = "";
    sprintf(str, "%f", data);
    strcpy(buf, str);
    int rc = client.publish(aws_topic, buf);
    delay(20000);
}

void setup() {
    wifi_set_sleep_type(NONE_SLEEP_T);
    Serial.begin (115200);
    delay (2000);
    Serial.setDebugOutput(1);


    //fill with ssid and wifi password
    WiFiMulti.addAP(wifi_ssid, wifi_password);
    Serial.println ("connecting to wifi");
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
        Serial.print (".");
    }
    Serial.println ("\nconnected");


    //fill AWS parameters
    awsWSclient.setAWSRegion(aws_region);
    awsWSclient.setAWSDomain(aws_endpoint);
    awsWSclient.setAWSKeyID(aws_key);
    awsWSclient.setAWSSecretKey(aws_secret);
    awsWSclient.setUseSSL(true);


    if (connect ()){
      subscribe ();
    }


}


void loop() {
  //keep the mqtt up and running
  if (awsWSclient.connected ()) {
      client.loop ();
  } else {
    //handle reconnection
    if (connect ()){
      subscribe ();
    }
  }


  float t;
  t = ( 100.00 - ( (analogRead(sensor_pin)/1023.00) * 100.00 ) );
  sendmessage(t);
}
