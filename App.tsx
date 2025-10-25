import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './src/navigation';
import { ActivityIndicator } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const auth0ClientId = process.env.AUTH0_CLIENT_ID;
const auth0Domain = process.env.AUTH0_DOMAIN;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'exp',
  path: '',
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId!,
      responseType: 'token',
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        nonce: 'nonce',
      },
      usePKCE: false,
    },
    {
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
      tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    }
  );

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    loadToken();
  }, []);

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        const { access_token } = response.params;
        await AsyncStorage.setItem('authToken', access_token);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    handleResponse();
  }, [response]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        {request && (
          <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
