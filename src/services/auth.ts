import Auth0, { Credentials } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID
});

export const login = async (): Promise<void> => {
  try {
    const credentials: Credentials = await auth0.webAuth.authorize({
      scope: 'openid profile email'
    });
    await AsyncStorage.setItem('authToken', credentials.accessToken);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth0.webAuth.clearSession();
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = async (): Promise<any> => {
  try {
    const userInfo = await auth0.auth.userInfo({
      token: await AsyncStorage.getItem('authToken') || ''
    });
    return userInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};