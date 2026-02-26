import { useState, useEffect } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';

export const useKeyboardAnimation = () => {
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShowListener = Keyboard.addListener(showEvent, (e) => {
      const toValue = Platform.OS === 'android' ? 0 : e.endCoordinates.height;
      const duration = Platform.OS === 'ios' ? 250 : 0;

      Animated.timing(keyboardHeight, {
        toValue,
        duration,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHideListener = Keyboard.addListener(hideEvent, () => {
      const duration = Platform.OS === 'ios' ? 250 : 0;

      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
};
