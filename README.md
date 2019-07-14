# Vineyard IOT Monitoring Platform

<p align="center">
<img src="https://github.com/flamel13/VineyardIOT/blob/master/screenshots/homepage.png" width="250">
</p>

<p align="center">
<img src="https://github.com/flamel13/VineyardIOT/blob/master/screenshots/sensorspage.png" width="250">
</p>

Repository per il progetto di Internet of Things.

# Directory

Il progetto si articola in 4 cartelle.
**Express Backend:** Backend scritto in Express.js, si occupa della ricezione dei dati provenienti da Amazon AWS prodotti dalla sensoristica. Li salva inoltre su InfluxDB.
**ReactJS Frontend:** Front-end scritto in ReactJS, si occupa della visualizzazione dei dati provenienti dal backend relativi alla sensoristica.
**NodeJS Clients:** Attraverso i client (degli agricoltori) è possibile monitorare il flusso dei dati prodotti dai sensori installati "on the field". Si può stoppare inoltre l'invio dei dati inviati a Amazon AWS.
**Sketches:** Arduino sketches che per ogni sensore, si occupano dell'invio dei dati a Amazon AWS attraverso il protocollo MQTT.

## Comandi di avvio

**Express Backend:**
```
node server.js
```
**ReactJS Frontend:**
```
cd src && npm start
```
**NodeJS Clients:**
```
node bridge.js
```

# Relazione

La [relazione](https://github.com/flamel13/VineyardIOT/blob/master/Relazione_Finale_IOT.pdf) con la descrizione integrale del progetto, completa della fasi di progettazione e implementazione è inclusa nel repository.
