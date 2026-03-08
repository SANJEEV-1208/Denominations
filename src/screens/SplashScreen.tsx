import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // 2 seconds as per requirement

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Denominations</Text>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerTitle}>Āṟāycci</Text>
        <Text style={styles.footerSubtext}>POWERED BY</Text>
        <Text style={styles.footerSubtext}>KAASPRO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background to match Daylight design
    paddingBottom: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    marginBottom: 16,
    borderRadius: 21.33, // iOS app icon corner radius for 96x96
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 96,
    height: 96,
  },
  appName: {
    fontFamily: 'Inter-Black',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'normal',
    color: '#000000',
    letterSpacing: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 2,
  },
  footerTitle: {
    fontFamily: 'Montserrat-BlackItalic',
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
    color: '#000000',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0.8, height: 0.8 },
    textShadowRadius: 1.5,
  },
  footerSubtext: {
    fontSize: 9,
    fontWeight: '400',
    color: '#CCCCCC',
    letterSpacing: 0.8,
  },
});