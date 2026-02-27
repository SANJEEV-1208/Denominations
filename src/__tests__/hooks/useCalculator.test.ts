import { renderHook, act } from '@testing-library/react-native';
import { useCalculator } from '../../hooks/useCalculator';

describe('useCalculator', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.inputValue).toBe('0');
    expect(result.current.displayExpression).toBe('0');
  });

  it('should append digit to input value', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    expect(result.current.inputValue).toBe('5');

    act(() => {
      result.current.handleNumberPress('3');
    });

    expect(result.current.inputValue).toBe('53');
  });

  it('should handle decimal point correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleDecimalPress();
    });

    act(() => {
      result.current.handleNumberPress('2');
    });

    expect(result.current.inputValue).toBe('5.2');
  });

  it('should not add multiple decimal points', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleDecimalPress();
    });

    act(() => {
      result.current.handleNumberPress('2');
    });

    act(() => {
      result.current.handleDecimalPress();
    });

    act(() => {
      result.current.handleNumberPress('3');
    });

    expect(result.current.inputValue).toBe('5.23');
  });

  it('should clear display when AC is pressed', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleNumberPress('3');
    });

    act(() => {
      result.current.handleClearPress();
    });

    expect(result.current.inputValue).toBe('0');
    expect(result.current.displayExpression).toBe('0');
  });

  it('should handle backspace correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleNumberPress('3');
    });

    act(() => {
      result.current.handleNumberPress('7');
    });

    act(() => {
      result.current.handleBackspacePress();
    });

    expect(result.current.inputValue).toBe('53');

    act(() => {
      result.current.handleBackspacePress();
    });

    expect(result.current.inputValue).toBe('5');

    act(() => {
      result.current.handleBackspacePress();
    });

    expect(result.current.inputValue).toBe('0');
  });

  it('should perform addition correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleOperatorPress('+');
    });

    act(() => {
      result.current.handleNumberPress('3');
    });

    act(() => {
      result.current.handleEqualsPress();
    });

    expect(result.current.inputValue).toBe('8');
  });

  it('should perform subtraction correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('1');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    act(() => {
      result.current.handleOperatorPress('-');
    });

    act(() => {
      result.current.handleNumberPress('3');
    });

    act(() => {
      result.current.handleEqualsPress();
    });

    expect(result.current.inputValue).toBe('7');
  });

  it('should perform multiplication correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('6');
    });

    act(() => {
      result.current.handleOperatorPress('*');
    });

    act(() => {
      result.current.handleNumberPress('7');
    });

    act(() => {
      result.current.handleEqualsPress();
    });

    expect(result.current.inputValue).toBe('42');
  });

  it('should perform division correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('2');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    act(() => {
      result.current.handleOperatorPress('/');
    });

    act(() => {
      result.current.handleNumberPress('4');
    });

    act(() => {
      result.current.handleEqualsPress();
    });

    expect(result.current.inputValue).toBe('5');
  });

  it('should handle division by zero', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleOperatorPress('/');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    act(() => {
      result.current.handleEqualsPress();
    });

    expect(result.current.inputValue).toBe('0');
  });

  it('should complete pending calculation', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberPress('1');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    act(() => {
      result.current.handleOperatorPress('+');
    });

    act(() => {
      result.current.handleNumberPress('5');
    });

    act(() => {
      result.current.handleNumberPress('0');
    });

    let completed: string = '';
    act(() => {
      completed = result.current.completePendingCalculation();
    });

    expect(completed).toBe('150');
    expect(result.current.inputValue).toBe('150');
  });
});
