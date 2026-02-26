import { useState, useMemo } from 'react';

interface CalculatorState {
  inputValue: string;
  previousValue: string | null;
  operator: string | null;
  waitingForNewNumber: boolean;
}

export const useCalculator = () => {
  const [inputValue, setInputValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewNumber, setWaitingForNewNumber] = useState(false);

  const getOperatorSymbol = (op: string): string => {
    const symbols: Record<string, string> = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
    };
    return symbols[op] || op;
  };

  const performCalculation = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const displayExpression = useMemo(() => {
    if (previousValue !== null && operator !== null) {
      return `${previousValue}${getOperatorSymbol(operator)}${waitingForNewNumber ? '' : inputValue}`;
    }
    return inputValue;
  }, [previousValue, operator, inputValue, waitingForNewNumber]);

  const effectiveValue = useMemo(() => {
    if (previousValue !== null && operator !== null) {
      if (waitingForNewNumber) {
        return previousValue;
      }
      const prev = Number.parseFloat(previousValue);
      const current = Number.parseFloat(inputValue) || 0;
      const result = performCalculation(prev, current, operator);
      return String(Number.parseFloat(result.toFixed(8)));
    }
    return inputValue;
  }, [inputValue, previousValue, operator, waitingForNewNumber]);

  const handleNumberPress = (num: string) => {
    if (waitingForNewNumber) {
      setInputValue(num);
      setWaitingForNewNumber(false);
    } else if (inputValue === '0') {
      setInputValue(num);
    } else {
      setInputValue(inputValue + num);
    }
  };

  const handleDecimalPress = () => {
    if (waitingForNewNumber) {
      setInputValue('0.');
      setWaitingForNewNumber(false);
    } else if (!inputValue.includes('.')) {
      setInputValue(inputValue + '.');
    }
  };

  const handleBackspacePress = () => {
    if (inputValue.length > 1) {
      setInputValue(inputValue.slice(0, -1));
    } else {
      setInputValue('0');
    }
  };

  const handleClearPress = () => {
    setInputValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewNumber(false);
  };

  const handleOperatorPress = (op: string) => {
    const currentValue = Number.parseFloat(inputValue) || 0;

    if (previousValue !== null && operator && !waitingForNewNumber) {
      const result = performCalculation(parseFloat(previousValue), currentValue, operator);
      const resultStr = String(Number.parseFloat(result.toFixed(8)));
      setInputValue(resultStr);
      setPreviousValue(resultStr);
    } else {
      setPreviousValue(inputValue);
    }

    setOperator(op);
    setWaitingForNewNumber(true);
  };

  const handleEqualsPress = () => {
    if (previousValue === null || operator === null) {
      return;
    }

    const prev = Number.parseFloat(previousValue);
    const current = Number.parseFloat(inputValue) || 0;
    const result = performCalculation(prev, current, operator);
    const resultStr = String(Number.parseFloat(result.toFixed(8)));

    setInputValue(resultStr);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewNumber(true);
  };

  const completePendingCalculation = (): string => {
    if (previousValue !== null && operator !== null) {
      const prev = Number.parseFloat(previousValue);
      const current = Number.parseFloat(inputValue) || 0;
      const result = performCalculation(prev, current, operator);
      const finalValue = String(Number.parseFloat(result.toFixed(8)));
      setInputValue(finalValue);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewNumber(true);
      return finalValue;
    }
    return inputValue;
  };

  return {
    inputValue,
    displayExpression,
    effectiveValue,
    handleNumberPress,
    handleDecimalPress,
    handleBackspacePress,
    handleClearPress,
    handleOperatorPress,
    handleEqualsPress,
    completePendingCalculation,
  };
};
