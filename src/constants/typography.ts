import { TextStyle } from 'react-native';
import { Colors } from './colors';

interface Typography {
  HEADER: TextStyle;
  SUBTITLE: TextStyle;
  BODY: TextStyle;
  NUMBER: TextStyle;
  NUMBER_LARGE: TextStyle;
  NUMPAD: TextStyle;
  CURRENCY_CODE: TextStyle;
  CURRENCY_NAME: TextStyle;
}

export const Typography: Typography = {
  HEADER: {
    fontFamily: 'System', // Will use SF Pro on iOS
    fontSize: 15,
    fontWeight: '900',
    color: Colors.TEXT_PRIMARY,
  },
  SUBTITLE: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
  },
  BODY: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: Colors.TEXT_BODY,
  },
  NUMBER: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
  },
  NUMBER_LARGE: {
    fontFamily: 'System',
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.TEXT_WHITE,
  },
  NUMPAD: {
    fontFamily: 'System',
    fontSize: 26,
    fontWeight: '400',
    color: Colors.TEXT_PRIMARY,
  },
  CURRENCY_CODE: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  CURRENCY_NAME: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: Colors.TEXT_BODY,
  },
};