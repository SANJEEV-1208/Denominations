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
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: Colors.TEXT_PRIMARY,
  },
  SUBTITLE: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
  },
  BODY: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.TEXT_BODY,
  },
  NUMBER: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    color: Colors.TEXT_PRIMARY,
  },
  NUMBER_LARGE: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 30,
    color: Colors.TEXT_WHITE,
  },
  NUMPAD: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 26,
    color: Colors.TEXT_PRIMARY,
  },
  CURRENCY_CODE: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: Colors.TEXT_PRIMARY,
  },
  CURRENCY_NAME: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    color: Colors.TEXT_BODY,
  },
};