import { Field } from '../types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates a form field value against its schema rules and custom settings.
 * Designed to run in external JS/React contexts, including Next.js (SSR safe).
 *
 * @param field The field definition object
 * @param value The current field value
 * @param t The translation helper function (fallback to english)
 * @returns ValidationResult
 */
export function validateField(
  field: Field,
  value: any,
  t: (key: string, defaultText: string) => string = (_, d) => d
): ValidationResult {
  const isRequired = field.required;
  const settings = field.settings || {};
  const valueStr = value !== null && value !== undefined ? String(value).trim() : '';

  // 1. Required Validation
  if (isRequired && (!value || (Array.isArray(value) && value.length === 0) || valueStr === '')) {
    return {
      isValid: false,
      message: settings.validation_message || t('field_required', 'This field is required.')
    };
  }

  // If empty and not required, it is valid
  if (!value && value !== 0 && value !== false) {
    return { isValid: true, message: '' };
  }

  // 2. Specific Field Type Validations
  switch (field.type) {
    case 'text':
    case 'textarea': {
      const minLength = settings.minLength !== undefined ? Number(settings.minLength) : null;
      const maxLength = settings.maxLength !== undefined ? Number(settings.maxLength) : null;
      const pattern = settings.pattern;

      if (minLength !== null && minLength > 0 && valueStr.length < minLength) {
        return {
          isValid: false,
          message: settings.validation_message || t('min_characters', `Enter at least ${minLength} characters.`)
        };
      }
      if (maxLength !== null && maxLength > 0 && valueStr.length > maxLength) {
        return {
          isValid: false,
          message: settings.validation_message || t('max_characters', `Enter at most ${maxLength} characters.`)
        };
      }
      if (pattern) {
        try {
          const regex = prepareRegex(pattern);
          if (!regex.test(valueStr)) {
            return {
              isValid: false,
              message: settings.validation_message || t('invalid_format', 'The entered value does not match the expected format.')
            };
          }
        } catch (e) {
          // Silent catch for malformed regex patterns
        }
      }
      break;
    }

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valueStr)) {
        return {
          isValid: false,
          message: settings.validation_message || t('invalid_email', 'Please enter a valid email address.')
        };
      }
      break;
    }

    case 'cpf_cnpj': {
      const mode = settings.mode || 'auto';
      const cleanVal = valueStr.replace(/\D/g, '');

      if (mode === 'cpf' || (mode === 'auto' && cleanVal.length <= 11)) {
        if (!isValidCPF(cleanVal)) {
          return {
            isValid: false,
            message: settings.validation_message || t('invalid_cpf', 'Invalid CPF.')
          };
        }
      } else if (mode === 'cnpj' || (mode === 'auto' && cleanVal.length > 11)) {
        if (!isValidCNPJ(cleanVal)) {
          return {
            isValid: false,
            message: settings.validation_message || t('invalid_cnpj', 'Invalid CNPJ.')
          };
        }
      }
      break;
    }

    case 'url': {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (!urlRegex.test(valueStr)) {
        return {
          isValid: false,
          message: settings.validation_message || t('invalid_url', 'Please enter a valid URL.')
        };
      }
      break;
    }
  }

  return { isValid: true, message: '' };
}

/**
 * Prepares a PHP-style regular expression (which may have delimiters like "/.../i") for JavaScript.
 */
function prepareRegex(pattern: string): RegExp {
  const trimmed = pattern.trim();
  const delimiters = ['/', '#', '~'];
  const first = trimmed.charAt(0);
  const last = trimmed.charAt(trimmed.length - 1);

  if (delimiters.includes(first) && last === first) {
    const lastDelimiterIndex = trimmed.lastIndexOf(first);
    const source = trimmed.substring(1, lastDelimiterIndex);
    const flags = trimmed.substring(lastDelimiterIndex + 1);
    return new RegExp(source, flags);
  }

  return new RegExp(trimmed);
}

/**
 * Mathematical validator for CPF.
 */
function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10), 10)) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(cpf.substring(10, 11), 10);
}

/**
 * Mathematical validator for CNPJ.
 */
function isValidCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
}
