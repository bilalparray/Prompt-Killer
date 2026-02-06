export interface ValidationRule {
  type: string;
  message: string;
}

export function getValidationClass(
  hasError: boolean,
  touched: boolean,
  isValid: boolean
): string {
  if (!touched) return "";
  if (hasError) return "invalid-input";
  if (isValid) return "valid-input";
  return "";
}
