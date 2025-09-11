import React from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface CustomBlurViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  children: React.ReactNode;
  fallbackStyle?: ViewStyle;
}

export const CustomBlurView: React.FC<CustomBlurViewProps> = ({
  intensity = 80,
  tint,
  style,
  children,
  fallbackStyle,
}) => {
  const theme = useTheme();
  // Use theme tint if not explicitly provided
  const blurTint = tint || theme.colors.BLUR_TINT;
  
  // iOS: Use native BlurView with subtle shadow
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={intensity} 
        tint={blurTint} 
        style={[
          style,
          {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }
        ]}
      >
        {children}
      </BlurView>
    );
  }

  // Android: Use semi-transparent background with elevation
  if (Platform.OS === 'android') {
    const backgroundColor = theme.dark 
      ? 'rgba(0, 0, 0, 0.92)' 
      : 'rgba(255, 255, 255, 0.92)';
    
    return (
      <View
        style={[
          style,
          {
            backgroundColor,
            elevation: 8,
          },
          fallbackStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  // Web: Use CSS backdrop-filter with shadow
  const backgroundColor = theme.dark 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)';
    
  return (
    <View
      style={[
        style,
        {
          backgroundColor,
          // @ts-ignore - Web-specific style
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        fallbackStyle,
      ]}
    >
      {children}
    </View>
  );
};