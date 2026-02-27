import { renderHook } from '@testing-library/react-native';
import { useCurrencyConversion } from '../../hooks/useCurrencyConversion';

describe('useCurrencyConversion', () => {
  const mockRates = {
    base: 'USD',
    rates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.5,
    },
  };

  const mockCurrencyCodes = ['USD', 'EUR', 'GBP', 'JPY'];

  it('should return empty conversions for zero effective value', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('0', 'USD', mockCurrencyCodes, mockRates)
    );

    expect(result.current.computedConversions).toEqual({});
  });

  it('should compute conversions for given amount and currency', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('100', 'USD', mockCurrencyCodes, mockRates)
    );

    expect(result.current.computedConversions.USD).toBe(100);
    expect(result.current.computedConversions.EUR).toBeCloseTo(85, 1);
    expect(result.current.computedConversions.GBP).toBeCloseTo(73, 1);
    expect(result.current.computedConversions.JPY).toBeCloseTo(11050, 0);
  });

  it('should handle decimal amounts', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('50.5', 'USD', mockCurrencyCodes, mockRates)
    );

    expect(result.current.computedConversions.EUR).toBeCloseTo(42.925, 2);
    expect(result.current.computedConversions.GBP).toBeCloseTo(36.865, 2);
  });

  it('should convert from non-USD base currency', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('100', 'EUR', mockCurrencyCodes, mockRates)
    );

    // 100 EUR should be kept as is
    expect(result.current.computedConversions.EUR).toBe(100);
    // 100 EUR -> USD: 100 / 0.85 ≈ 117.65
    expect(result.current.computedConversions.USD).toBeCloseTo(117.65, 1);
  });

  it('should handle null exchange rates', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('100', 'USD', mockCurrencyCodes, null)
    );

    expect(result.current.computedConversions).toEqual({});
  });

  it('should handle empty effective value', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('', 'USD', mockCurrencyCodes, mockRates)
    );

    expect(result.current.computedConversions).toEqual({});
  });

  it('should provide createConversions function', () => {
    const { result } = renderHook(() =>
      useCurrencyConversion('0', 'USD', mockCurrencyCodes, mockRates)
    );

    const conversions = result.current.createConversions('200');

    expect(conversions.USD).toBe(200);
    expect(conversions.EUR).toBeCloseTo(170, 1);
    expect(conversions.GBP).toBeCloseTo(146, 1);
  });

  it('should update conversions when effective value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useCurrencyConversion(value, 'USD', mockCurrencyCodes, mockRates),
      { initialProps: { value: '100' } }
    );

    const firstEUR = result.current.computedConversions.EUR;
    expect(firstEUR).toBeCloseTo(85, 1);

    rerender({ value: '200' });

    expect(result.current.computedConversions.EUR).toBeCloseTo(170, 1);
    expect(result.current.computedConversions.EUR).toBeCloseTo(firstEUR * 2, 1);
  });
});
