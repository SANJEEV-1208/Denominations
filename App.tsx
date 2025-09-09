import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { SplashScreen as AppSplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CalculateScreen } from './src/screens/CalculateScreen';
import { EditListScreen } from './src/screens/EditListScreen';
import { RootStackParamList } from './src/types';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
          'SpaceGrotesk-Regular': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
          'SpaceGrotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CurrencyProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen 
            name="Splash" 
            component={AppSplashScreen}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              animationEnabled: true,
              animationTypeForReplace: 'push',
            }}
          />
          <Stack.Screen 
            name="Calculate" 
            component={CalculateScreen}
            options={{
              presentation: 'modal',
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="EditList" 
            component={EditListScreen}
            options={{
              presentation: 'modal',
              animationEnabled: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
  );
}
