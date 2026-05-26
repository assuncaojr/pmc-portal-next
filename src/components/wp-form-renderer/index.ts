// Main public exports for external SPA & Next.js form rendering
export { WPFBFormRenderer } from './WPFBFormRenderer';
export type { WPFBFormRendererProps } from './WPFBFormRenderer';

export { WPFBFieldWrapper } from './WPFBFieldWrapper';

export {
  WPFBGenericInput,
  WPFBTextField,
  WPFBTextareaField,
  WPFBSelectField,
  WPFBCheckboxField,
  WPFBRadioField,
  WPFBCpfCnpjField,
  WPFBDividerField,
  WPFBSectionField,
  WPFBFileField,
} from './WPFBFieldComponents';

// Utility helper exports
export { validateField } from './utils/validation-engine';
export type { ValidationResult } from './utils/validation-engine';

export { evaluateConditionalLogic } from './utils/conditional-logic';
