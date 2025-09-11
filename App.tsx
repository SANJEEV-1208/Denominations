import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { CurrencyProvider } from './src/context/CurrencyContext';
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
          'MonomaniacOne-Regular': require('./assets/fonts/MonomaniacOne-Regular.ttf'),
          'SpaceGrotesk-Regular': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
          'SpaceGrotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf'),
          'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font loading error:', e);
      } finally {
        setFontsLoaded(true);
        // Add a small delay to make the transition smoother
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 500);
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
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen 
            name="Calculate" 
            component={CalculateScreen}
            options={{
              animationEnabled: true,
              animationTypeForReplace: 'push',
            }}
          />
          <Stack.Screen 
            name="EditList" 
            component={EditListScreen}
            options={{
              animationEnabled: true,
              animationTypeForReplace: 'push',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CurrencyProvider>
  );
}
