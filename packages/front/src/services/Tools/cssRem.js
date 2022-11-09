export const trimUnit = (value) => value / (value * 0 + 1);

export const remCalc = (value) => `${(value / trimUnit(16))}rem`;

export const spacing = (value) => `${value * 8}px`;

export const spacingRem = (value) => remCalc(value * 8);
