export const lightColors = {
  PRIMARY: '#E300FF', // Hyper Pink
  SECONDARY: '#D976CA', // Pale Pink
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#F9F9F9', // Lightest Grey
  
  // Gradient colors
  GRADIENT_START: '#D976CA',
  GRADIENT_END: '#E300FF',
  BORDER_GRADIENT_START: '#E300FF',
  BORDER_GRADIENT_END: '#880099',
  
  // Text colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#999999',
  TEXT_BODY: '#757575',
  TEXT_WHITE: '#FFFFFF',
  
  // Selected card colors
  SELECTED_CARD_BG: '#FBF1FA', // Light pink background for selected items
  SELECTED_CARD_BORDER: '#E300FF',
  
  // Glass morphism
  GLASS_BACKGROUND: 'rgba(255, 255, 255, 0.1)',
  GLASS_BORDER: 'rgba(255, 255, 255, 0.2)',
  
  // Button icon color
  BUTTON_ICON: '#FFBFFF',
  
  // Blur tint
  BLUR_TINT: 'light' as const,
};

export const darkColors = {
  PRIMARY: '#E300FF', // Keep brand color
  SECONDARY: '#D976CA', // Keep secondary brand color
  BACKGROUND: '#000000', // Pure black background
  CARD_BACKGROUND: '#1A1A1A', // Dark gray for cards
  
  // Gradient colors (slightly adjusted for dark mode)
  GRADIENT_START: '#D976CA',
  GRADIENT_END: '#E300FF',
  BORDER_GRADIENT_START: '#E300FF',
  BORDER_GRADIENT_END: '#880099',
  
  // Text colors (inverted for dark mode)
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#AAAAAA',
  TEXT_BODY: '#CCCCCC',
  TEXT_WHITE: '#FFFFFF',
  
  // Selected card colors
  SELECTED_CARD_BG: '#2A1A2A', // Dark purple background for selected items
  SELECTED_CARD_BORDER: '#E300FF',
  
  // Glass morphism (adjusted for dark mode)
  GLASS_BACKGROUND: 'rgba(0, 0, 0, 0.3)',
  GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
  
  // Button icon color
  BUTTON_ICON: '#FFBFFF',
  
  // Blur tint
  BLUR_TINT: 'dark' as const,
};

// Legacy export for backwards compatibility (will be removed after migration)
export const Colors = lightColors;