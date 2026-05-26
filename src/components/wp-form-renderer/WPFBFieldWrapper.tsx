import React from 'react';
import { Field } from './types';

interface WPFBFieldWrapperProps {
  field: Field;
  error?: string;
  children: React.ReactNode;
}

/**
 * Replicates the HTML class and node structure of `templates/field-wrapper.php`
 * styled beautifully with Tailwind CSS utilities to match the Next.js portal.
 */
export const WPFBFieldWrapper: React.FC<WPFBFieldWrapperProps> = ({
  field,
  error,
  children,
}) => {
  const isRequired = !!field.required;
  const label = field.label;
  const description = field.description;

  const classes = [
    'fbui-form-group',
    'fbui-field',
    `fbui-field--${field.type}`,
    isRequired ? 'fbui-field--required' : '',
    error ? 'fbui-field--error' : '',
    field.settings?.css_class || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {label && (
        <label 
          className="fbui-label" 
          htmlFor={field.id}
        >
          {label}
          {isRequired && <span className="fbui-required">*</span>}
        </label>
      )}

      {description && (
        <div
          className="fbui-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      <div className="fbui-form-input-wrapper">
        {children}
        {error && (
          <div className="fbui-form-input-error-message form-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WPFBFieldWrapper;
