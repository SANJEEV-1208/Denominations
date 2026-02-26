import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

// @ts-ignore
import CalculateIcon from '../assets/Calculate.svg';
// @ts-ignore
import DeleteIcon from '../assets/delete.svg';
// @ts-ignore
import PlusIcon from '../assets/plus.svg';
// @ts-ignore
import MinusIcon from '../assets/minus.svg';
// @ts-ignore
import DivideIcon from '../assets/divide.svg';
// @ts-ignore
import MultiplyIcon from '../assets/multiply.svg';

const { width } = Dimensions.get('window');

interface CalculatorNumberPadProps {
  displayExpression: string;
  onNumberPress: (num: string) => void;
  onDecimalPress: () => void;
  onBackspacePress: () => void;
  onClearPress: () => void;
  onOperatorPress: (op: string) => void;
  onCalculatePress: () => void;
}

export const CalculatorNumberPad: React.FC<CalculatorNumberPadProps> = ({
  displayExpression,
  onNumberPress,
  onDecimalPress,
  onBackspacePress,
  onClearPress,
  onOperatorPress,
  onCalculatePress,
}) => {
  const theme = useTheme();

  const buttonBg = theme.dark ? '#000000' : '#FFFFFF';
  const textColor = theme.dark ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.numPadWrapper}>
      <BlurView
        intensity={40}
        tint={theme.dark ? "dark" : "light"}
        style={styles.numPadBlurContainer}
      >
        <View style={[styles.numPadInnerContainer, {
          backgroundColor: theme.dark ? 'rgba(117, 117, 117, 0.25)' : 'rgba(217, 217, 217, 0.25)'
        }]}>
          {/* Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputFieldWrapper}>
              <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
                <Text style={[styles.clearText, { color: textColor }]}>×</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: buttonBg }]}
                value={displayExpression}
                keyboardType="numeric"
                editable={false}
                placeholder="0"
                placeholderTextColor={theme.dark ? '#666666' : '#999999'}
              />
            </View>
            <TouchableOpacity style={styles.calculateButton} onPress={onCalculatePress}>
              <CalculateIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Row 1: 1, 2, 3, + */}
          <View style={styles.numPadRow}>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('1')}>
              <Text style={[styles.numPadText, { color: textColor }]}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('2')}>
              <Text style={[styles.numPadText, { color: textColor }]}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('3')}>
              <Text style={[styles.numPadText, { color: textColor }]}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onOperatorPress('+')}>
              <PlusIcon width={20} height={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Row 2: 4, 5, 6, - */}
          <View style={styles.numPadRow}>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('4')}>
              <Text style={[styles.numPadText, { color: textColor }]}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('5')}>
              <Text style={[styles.numPadText, { color: textColor }]}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('6')}>
              <Text style={[styles.numPadText, { color: textColor }]}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onOperatorPress('-')}>
              <MinusIcon width={20} height={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Row 3: 7, 8, 9, × */}
          <View style={styles.numPadRow}>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('7')}>
              <Text style={[styles.numPadText, { color: textColor }]}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('8')}>
              <Text style={[styles.numPadText, { color: textColor }]}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('9')}>
              <Text style={[styles.numPadText, { color: textColor }]}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onOperatorPress('*')}>
              <MultiplyIcon width={20} height={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Row 4: ., 0, ⌫, ÷ */}
          <View style={[styles.numPadRow, { marginBottom: 0 }]}>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={onDecimalPress}>
              <Text style={[styles.numPadText, { color: textColor }]}>.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onNumberPress('0')}>
              <Text style={[styles.numPadText, { color: textColor }]}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={onBackspacePress}>
              <DeleteIcon width={20} height={20} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.numPadButton, { backgroundColor: buttonBg }]} onPress={() => onOperatorPress('/')}>
              <DivideIcon width={20} height={20} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  numPadWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  numPadBlurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  numPadInnerContainer: {
    padding: 4,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 2,
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: ((width - 24) / 4) * 0.35,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: ((width - 24) / 4) * 0.7,
    fontSize: 24,
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    borderRadius: ((width - 24) / 4) * 0.35,
  },
  clearButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 20,
    fontWeight: '400',
  },
  calculateButton: {
    width: (width - 24) / 4,
    height: ((width - 24) / 4) * 0.7,
    backgroundColor: '#E300FF',
    borderRadius: ((width - 24) / 4) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E300FF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  numPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 2,
  },
  numPadButton: {
    width: (width - 24) / 4,
    height: ((width - 24) / 4) * 0.7,
    borderRadius: ((width - 24) / 4) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numPadText: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Regular',
    fontWeight: '400',
  },
});
