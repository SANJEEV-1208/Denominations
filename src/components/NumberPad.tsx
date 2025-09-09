import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

interface NumberPadProps {
  onNumberPress: (value: string) => void;
  onBackspacePress: () => void;
  onDecimalPress: () => void;
}

const { width } = Dimensions.get('window');
const buttonSize = (width - 80) / 3;

export const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onBackspacePress,
  onDecimalPress,
}) => {
  const renderButton = (value: string, onPress: () => void, isSpecial = false) => {
    return (
      <TouchableOpacity
        style={[styles.button, isSpecial && styles.specialButton]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isSpecial && styles.specialButtonText]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderButton('1', () => onNumberPress('1'))}
        {renderButton('2', () => onNumberPress('2'))}
        {renderButton('3', () => onNumberPress('3'))}
      </View>
      <View style={styles.row}>
        {renderButton('4', () => onNumberPress('4'))}
        {renderButton('5', () => onNumberPress('5'))}
        {renderButton('6', () => onNumberPress('6'))}
      </View>
      <View style={styles.row}>
        {renderButton('7', () => onNumberPress('7'))}
        {renderButton('8', () => onNumberPress('8'))}
        {renderButton('9', () => onNumberPress('9'))}
      </View>
      <View style={styles.row}>
        {renderButton('.', onDecimalPress)}
        {renderButton('0', () => onNumberPress('0'))}
        {renderButton('<', onBackspacePress, true)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: buttonSize,
    height: buttonSize * 0.75,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  specialButton: {
    backgroundColor: '#FFE5E5',
  },
  buttonText: {
    fontSize: 26,
    fontFamily: 'SpaceMono-Regular',
    color: Colors.TEXT_PRIMARY,
  },
  specialButtonText: {
    color: '#FF0000',
  },
});