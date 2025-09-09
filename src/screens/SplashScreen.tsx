import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[Colors.SECONDARY, Colors.PRIMARY]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <View style={styles.textContainer}>
            <Text style={styles.deText}>de</Text>
            <Text style={styles.oText}>o</Text>
            <Text style={styles.miText}>mi</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.naText}>Na</Text>
            <Text style={styles.crossText}>✝</Text>
            <Text style={styles.ionText}>ion</Text>
          </View>
          <Text style={styles.dollarSign}>$</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 30,
    padding: 40,
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  oText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
    marginHorizontal: 5,
  },
  miText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  naText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  crossText: {
    fontSize: 24,
    color: Colors.TEXT_PRIMARY,
    marginHorizontal: 5,
  },
  ionText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 2,
  },
  dollarSign: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginTop: 20,
  },
});