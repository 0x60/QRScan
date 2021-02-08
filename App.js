import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Button,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRWrapper = (props) => (
  <QRCodeScanner onRead={(e) => props.callback(e.data)} />
);

const AppBody = () => {
  const [response, setResponse] = useState(null); // fake API response
  const [code, setCode] = useState(null); // qr code

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;

      fetch('https://google.com/', { // using a random url as an example
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(code),
      })
        .then((response) => response.text()) // .then(response => response.json())
        .then(setResponse)
        .catch((error) => {
          Alert.alert('Error Loading Data', error.message);
        });
    };

    fetchData();
  }, [code]);

  // Show QR code scanner if no code data
  if (!code) {
    return (
      <View style={styles.container}>
        <Text style={styles.prompt}>Scan a QR code.</Text>
        <QRWrapper callback={setCode} />
      </View>
    );
  }

  // Show loading indicator if waiting for response
  if (!response) {
    return (
      <Text style={styles.prompt}>Loading...</Text>
    );
  }

  // Show response data
  return (
    <View>
      <Button onPress={(_) => setCode(null)} title="Scan Again" />
      <ScrollView>
        <Text style={styles.code}>{response}</Text>
      </ScrollView>
    </View>
  );
};

const App = () => (
  <SafeAreaView style={styles.container}>
      <AppBody />
    <StatusBar style="auto" />
  </SafeAreaView>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 14,
    marginTop: 14,
    marginBottom: 14,
  },
  code: {
    padding: 10,
    backgroundColor: '#ccc',
    fontFamily: 'Menlo', // NOTE: this font is ios specific
  },
});
