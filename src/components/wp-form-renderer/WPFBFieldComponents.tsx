"use client";

import React, { useRef } from 'react';
import { Field } from './types';

interface FieldComponentProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  disabled?: boolean;
  t: (key: string, defaultText: string) => string;
  availability?: {
    disabled_options?: string[];
    exhausted_text?: string;
  };
}

const inputBaseClass = "fbui-form-control fbui-form-control--md";

function applyPhoneMask(digits: string) {
  const t = digits.slice(0, 11);
  const len = t.length;
  if (len === 0) return '';
  if (len <= 2) return `(${t}`;
  const s = t.slice(0, 2);
  if (len <= 6) {
    const l = t.slice(2);
    return `(${s}) ${l}`;
  }
  if (len <= 10) {
    const l = t.slice(2, 6);
    const c = t.slice(6);
    return `(${s}) ${l}-${c}`;
  }
  const i = t.slice(2, 7);
  const o = t.slice(7, 11);
  return `(${s}) ${i}-${o}`;
}

// 1. Text, Email, URL, Phone, Number Fields
export const WPFBTextField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};
  const typeMap: Record<string, string> = {
    text: 'text',
    email: 'email',
    url: 'text', // Standard text input with url validation
    phone: 'tel',
    number: 'number',
  };
  const inputType = typeMap[field.type] || 'text';
  const isPhone = field.type === 'phone';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (isPhone) {
      const digits = rawVal.replace(/\D/g, '').slice(0, 11);
      const masked = applyPhoneMask(digits);
      onChange(masked);
    } else {
      onChange(rawVal);
    }
  };

  const inputClass = isPhone 
    ? "fbui-form-control fbui-phone-field fbui-form-control--md" 
    : inputBaseClass;

  return (
    <input
      type={inputType}
      id={field.id}
      name={field.id}
      value={value || ''}
      disabled={disabled}
      placeholder={settings.placeholder || ''}
      onChange={handleInputChange}
      onBlur={onBlur}
      required={!!field.required}
      minLength={settings.minLength}
      maxLength={settings.maxLength}
      className={inputClass}
    />
  );
};

// 2. Textarea Field
export const WPFBTextareaField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};

  return (
    <textarea
      id={field.id}
      name={field.id}
      value={value || ''}
      disabled={disabled}
      placeholder={settings.placeholder || ''}
      rows={settings.rows || 4}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      required={!!field.required}
      minLength={settings.minLength}
      maxLength={settings.maxLength}
      className="fbui-form-control fbui-form-textarea fbui-form-control--md"
    />
  );
};

// 3. Select (Dropdown) Field
export const WPFBSelectField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  t,
  availability,
}) => {
  const options = field.options || field.settings?.options || [];

  return (
    <select
      id={field.id}
      name={field.id}
      value={value || ''}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      required={!!field.required}
      className="fbui-select fbui-form-control fbui-form-control--md"
    >
      <option value="" className="text-gray-400">{t('select_option', 'Select an option')}</option>
      {options.map((opt: any) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isOptionDisabled = availability?.disabled_options?.includes(String(val));
        const exhaustedText = availability?.exhausted_text || 'Esgotado';

        return (
          <option 
            key={val} 
            value={val} 
            disabled={isOptionDisabled}
            className="text-pmc-dark"
          >
            {label} {isOptionDisabled ? `(${exhaustedText})` : ''}
          </option>
        );
      })}
    </select>
  );
};

// 4. Checkbox (Multiple Choices) Field
export const WPFBCheckboxField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  availability,
}) => {
  const options = field.options || field.settings?.options || [];
  const currentValues: string[] = Array.isArray(value) ? value : [];

  const handleCheckboxChange = (optionVal: string, checked: boolean) => {
    let nextValues = [...currentValues];
    if (checked) {
      if (!nextValues.includes(optionVal)) {
        nextValues.push(optionVal);
      }
    } else {
      nextValues = nextValues.filter(v => v !== optionVal);
    }
    onChange(nextValues);
  };

  return (
    <div className="fbui-form-check-radio" onBlur={onBlur}>
      {options.map((opt: any, idx: number) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isOptionDisabled = availability?.disabled_options?.includes(String(val));
        const exhaustedText = availability?.exhausted_text || 'Esgotado';
        const inputId = `choice-${field.id}-${idx}`;

        return (
          <label 
            key={val} 
            className={`fbui-form-label-checkbox ${isOptionDisabled ? 'fbui-option--full' : ''}`} 
            htmlFor={inputId}
          >
            <input
              type="checkbox"
              id={inputId}
              name={`${field.id}[]`}
              value={val}
              disabled={disabled || isOptionDisabled}
              checked={currentValues.includes(val)}
              onChange={e => handleCheckboxChange(val, e.target.checked)}
            />
            <span>
              {label}{' '}
              {isOptionDisabled && (
                <span className="wpfb-exhausted-badge">({exhaustedText})</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

// 5. Radio (Single Choice) Field
export const WPFBRadioField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  availability,
}) => {
  const options = field.options || field.settings?.options || [];

  return (
    <div className="fbui-form-check-radio" onBlur={onBlur}>
      {options.map((opt: any, idx: number) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isOptionDisabled = availability?.disabled_options?.includes(String(val));
        const exhaustedText = availability?.exhausted_text || 'Esgotado';
        const inputId = `choice-${field.id}-${idx}`;

        return (
          <label 
            key={val} 
            className={`fbui-form-label-checkbox ${isOptionDisabled ? 'fbui-option--full' : ''}`} 
            htmlFor={inputId}
          >
            <input
              type="radio"
              id={inputId}
              name={field.id}
              value={val}
              disabled={disabled || isOptionDisabled}
              checked={String(value) === String(val)}
              onChange={() => onChange(val)}
            />
            <span>
              {label}{' '}
              {isOptionDisabled && (
                <span className="wpfb-exhausted-badge">({exhaustedText})</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

// Helper masking functions for CPF/CNPJ
function onlyDigits(val: string) {
  return val.replace(/\D/g, '');
}

function applyCpfMask(digits: string) {
  const d = digits.slice(0, 11);
  const len = d.length;
  if (len === 0) return '';
  if (len <= 3) return d;
  if (len <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (len <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function applyCnpjMask(digits: string) {
  const d = digits.slice(0, 14);
  const len = d.length;
  if (len === 0) return '';
  if (len <= 2) return d;
  if (len <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (len <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (len <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

// 6. CPF / CNPJ Document Input Field with reactive masking
export const WPFBCpfCnpjField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};
  const mode = settings.mode || 'auto';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digits = onlyDigits(rawVal);
    if (!digits) {
      onChange('');
      return;
    }

    const effectiveMode = mode === 'auto' ? (digits.length > 11 ? 'cnpj' : 'cpf') : mode;
    const masked = effectiveMode === 'cpf' ? applyCpfMask(digits) : applyCnpjMask(digits);
    onChange(masked);
  };

  return (
    <input
      type="text"
      id={field.id}
      name={field.id}
      value={value || ''}
      disabled={disabled}
      placeholder={settings.placeholder || ''}
      onChange={handleInputChange}
      onBlur={onBlur}
      required={!!field.required}
      inputMode="numeric"
      autoComplete="on"
      data-mode={mode}
      className="fbui-form-control fbui-form-cpfcnpj fbui-form-control--md"
    />
  );
};

// 7. Divider Layout Field
export const WPFBDividerField: React.FC<{ field: Field }> = ({ field }) => {
  const dividerColor = field.settings?.color || '#e5e7eb';
  return (
    <div
      className="fbui-field-divider"
      id={field.id}
      style={{
        backgroundColor: dividerColor,
        display: 'block',
        height: '1px',
        margin: '20px 0',
      }}
    />
  );
};

// 8. Section Header Layout Field
export const WPFBSectionField: React.FC<{ field: Field }> = ({ field }) => {
  const content = field.settings?.content || field.content || '';
  return (
    <div className="fbui-field-section" id={field.id}>
      {content && (
        <div
          className="fbui-field-section-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

// 8.5. Image Layout Field
export const WPFBImageField: React.FC<{ field: Field }> = ({ field }) => {
  const imageUrl = field.imageUrl || field.settings?.imageUrl;
  const altText = field.altText || field.settings?.altText || '';
  if (!imageUrl) return null;

  return (
    <div className="fbui-field-image" id={field.id}>
      <div className="fbui-field-image-container">
        <img
          src={imageUrl}
          alt={altText}
          className="fbui-field-image-img"
        />
      </div>
    </div>
  );
};

// 8.7. Spacer Layout Field
export const WPFBSpacerField: React.FC<{ field: Field }> = ({ field }) => {
  const height = field.settings?.height !== undefined ? `${field.settings.height}px` : '20px';
  return (
    <div
      className="fbui-field-spacer"
      id={field.id}
      style={{ height }}
    />
  );
};



// 9. Single / Multiple File Upload Field
export const WPFBFileField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
  t,
}) => {
  const settings = field.settings || {};
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onChange(null);
      return;
    }

    if (settings.multiple) {
      onChange(Array.from(files));
    } else {
      onChange(files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasFile = !!value;
  const isMultiple = !!settings.multiple;
  const acceptValue = settings.accept || '';
  const maxSizeBytes = settings.maxSizeBytes || (settings.maxSize ? (settings.maxSize > 32 ? settings.maxSize : settings.maxSize * 1024 * 1024) : 0);
  const maxSizeMbDisplay = maxSizeBytes > 0 ? Math.max(1, Math.round(maxSizeBytes / (1024 * 1024))) : 10;

  const fileLabel = () => {
    if (!value) return '';
    if (Array.isArray(value)) {
      return `${value.length} files`;
    }
    return (value as File).name;
  };

  const fileSizeLabel = () => {
    if (!value || Array.isArray(value)) return '';
    const sizeInMB = (value as File).size / (1024 * 1024);
    return `(${sizeInMB.toFixed(2)} MB)`;
  };

  return (
    <div className={`fbui-file-field ${hasFile ? 'fbui-file-field--has-file' : ''} ${disabled ? 'disabled' : ''}`} onBlur={onBlur}>
      {!hasFile && (
        <div 
          className="fbui-file-field--upload-area" 
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="fbui-file-field--upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-upload">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 9l5 -5l5 5" />
              <path d="M12 4l0 12" />
            </svg>
          </div>

          <div className="fbui-file-field--upload-text">
            <span className="fbui-file-field--upload-main">{t('choose_file', 'Choose File')}</span>
            <div className="fbui-file-field--upload-details">
              <span className="fbui-file-field--file-types">
                {acceptValue || t('no_type_selected', 'No type selected')}
              </span>
              <span className="fbui-file-field--file-separator"> &middot; </span>
              <span className="fbui-file-field--file-limits">
                Max: {maxSizeMbDisplay}MB {isMultiple && `· ${settings.maxFiles || t('multiple', 'Multiple')} files`}
              </span>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        id={field.id}
        name={field.id}
        ref={fileInputRef}
        disabled={disabled}
        multiple={isMultiple}
        accept={acceptValue || '*/*'}
        onChange={handleFileChange}
        className="fbui-file-field--input-hidden"
        style={{ display: 'none' }}
      />

      {hasFile && (
        <div className="fbui-file-field--info" style={{ display: 'flex' }}>
          <div className="fbui-file-info--content">
            <span className="fbui-file-field--name">{fileLabel()}</span>
            <span className="fbui-file-field--size">{fileSizeLabel()}</span>
          </div>
          <div className="fbui-file-field--remove" onClick={handleRemove}>
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
      )}
    </div>
  );
};

// 10. Date Field
export const WPFBDateField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};
  
  let includeTime = false;
  if (settings.includeTime !== undefined) {
    includeTime = typeof settings.includeTime === 'object' && settings.includeTime !== null
      ? !!(settings.includeTime as any).value
      : !!settings.includeTime;
  }

  const inputType = includeTime ? 'datetime-local' : 'date';

  return (
    <input
      type={inputType}
      id={field.id}
      name={field.id}
      value={value || ''}
      disabled={disabled}
      placeholder={settings.placeholder || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      required={!!field.required}
      min={settings.min}
      max={settings.max}
      className="fbui-form-control fbui-form-date fbui-form-control--md"
    />
  );
};

// 11. Slider (Range) Field
export const WPFBSliderField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};
  const min = settings.min !== undefined ? Number(settings.min) : 0;
  const max = settings.max !== undefined ? Number(settings.max) : 100;
  const step = settings.step !== undefined ? Number(settings.step) : 1;
  const currentValue = value !== undefined && value !== '' ? Number(value) : min;

  // Calculate percentage progress dynamically
  const percentage = max > min ? ((currentValue - min) / (max - min)) * 100 : 0;

  return (
    <div className="fbui-field__slider-container" onBlur={onBlur}>
      <div className="fbui-field__slider-wrapper" style={{ position: 'relative' }}>
        <input
          type="range"
          id={field.id}
          name={field.id}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          className="fbui-field__slider"
          style={{ '--slider-progress': `${percentage}%` } as React.CSSProperties}
        />
        <div 
          className="fbui-field__slider-value is-visible" 
          style={{ left: `${percentage}%` }}
        >
          {currentValue}
        </div>
      </div>
    </div>
  );
};

// 12. Rating Stars Field
export const WPFBRatingField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  onBlur,
  disabled,
}) => {
  const settings = field.settings || {};
  const maxRating = settings.maxRating !== undefined ? Number(settings.maxRating) : 5;
  const currentRating = value !== undefined && value !== '' ? Number(value) : 0;

  return (
    <div className="fbui-rating-stars" onBlur={onBlur}>
      {Array.from({ length: maxRating }).map((_, idx) => {
        const ratingValue = idx + 1;
        const isActive = ratingValue <= currentRating;
        return (
          <span
            key={ratingValue}
            className={`fbui-star ${isActive ? 'active' : ''}`}
            onClick={() => !disabled && onChange(ratingValue)}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

// 13. Unique ID Field (Read-only generated client side)
function generateUniqueId(format = 'uuid', customLength = 6, prefix = '', suffix = '') {
  let uniquePart = '';
  switch (format) {
    case 'numeric':
      uniquePart = Array.from({ length: customLength }, () => Math.floor(Math.random() * 10)).join('');
      break;
    case 'alphanumeric':
    case 'custom':
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      uniquePart = Array.from({ length: customLength }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
      break;
    case 'short_uuid':
      uniquePart = Math.random().toString(16).substring(2, 10);
      break;
    case 'uuid':
    default:
      if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        uniquePart = window.crypto.randomUUID();
      } else {
        uniquePart = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      break;
  }
  return prefix + uniquePart + suffix;
}

export const WPFBUniqueIdField: React.FC<FieldComponentProps> = ({
  field,
  value,
  onChange,
  disabled,
}) => {
  const settings = field.settings || {};
  const format = settings.format || 'uuid';
  const customLength = Number(settings.customLength) || 6;
  const prefix = settings.prefix || '';
  const suffix = settings.suffix || '';

  React.useEffect(() => {
    if (!value) {
      const newId = generateUniqueId(format, customLength, prefix, suffix);
      onChange(newId);
    }
  }, [value, format, customLength, prefix, suffix, onChange]);

  return (
    <input
      type="text"
      id={field.id}
      name={field.id}
      value={value || ''}
      readOnly={true}
      disabled={disabled}
      className="fbui-form-control fbui-form-control--md fbui-unique-id"
      style={{ cursor: 'not-allowed', backgroundColor: '#f1f5f9' }}
    />
  );
};


/**
 * Universal dynamic component router that renders the correct public field input based on type.
 */
export const WPFBGenericInput: React.FC<FieldComponentProps> = (props) => {
  const type = props.field.type;

  switch (type) {
    case 'text':
    case 'email':
    case 'url':
    case 'number':
      return <WPFBTextField {...props} />;
    case 'textarea':
      return <WPFBTextareaField {...props} />;
    case 'select':
    case 'multiple-choices-select':
      return <WPFBSelectField {...props} />;
    case 'checkbox':
    case 'multiple-choices':
      return <WPFBCheckboxField {...props} />;
    case 'radio':
    case 'multiple-choices-radio':
      return <WPFBRadioField {...props} />;
    case 'cpf_cnpj':
      return <WPFBCpfCnpjField {...props} />;
    case 'file':
      return <WPFBFileField {...props} />;
    case 'date':
      return <WPFBDateField {...props} />;
    case 'slider':
      return <WPFBSliderField {...props} />;
    case 'rating':
      return <WPFBRatingField {...props} />;
    case 'divider':
      return <WPFBDividerField field={props.field} />;
    case 'section':
      return <WPFBSectionField field={props.field} />;
    case 'image':
      return <WPFBImageField field={props.field} />;
    case 'spacer':
      return <WPFBSpacerField field={props.field} />;
    case 'unique_id':
      return <WPFBUniqueIdField {...props} />;
    default:
      // Fallback renderer
      return <WPFBTextField {...props} />;
  }
};
export default WPFBGenericInput;
