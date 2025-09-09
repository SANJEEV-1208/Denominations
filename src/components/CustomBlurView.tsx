import React from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface CustomBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  children: React.ReactNode;
  fallbackStyle?: ViewStyle;
}

export const CustomBlurView: React.FC<CustomBlurViewProps> = ({
  intensity = 80,
  tint = 'light',
  style,
  children,
  fallbackStyle,
}) => {
  // iOS: Use native BlurView with subtle shadow
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={intensity} 
        tint={tint} 
        style={[
          style,
          {
            shadowColor: 'rgba(0, 0, 0, 0.08)',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 8,
          }
        ]}
      >
        {children}
      </BlurView>
    );
  }

  // Android: Use semi-transparent background with elevation
  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            elevation: 8,
          },
          fallbackStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  // Web: Use CSS backdrop-filter
  return (
    <View
      style={[
        style,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          // @ts-ignore - Web-specific style
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
        fallbackStyle,
      ]}
    >
      {children}
    </View>
  );
};