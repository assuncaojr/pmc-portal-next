"use client";

import React, { useState, useEffect } from 'react';
import { Field, FormData as WPFBFormData } from './types';
import { WPFBFieldWrapper } from './WPFBFieldWrapper';
import { WPFBGenericInput } from './WPFBFieldComponents';
import { evaluateConditionalLogic } from './utils/conditional-logic';
import { validateField } from './utils/validation-engine';
import './wpfb-styles.css';

export interface WPFBFormRendererProps {
  formData: WPFBFormData;
  apiBaseUrl: string; // The URL to your WordPress backend REST endpoint, ex.: "https://your-site.com/wp-json/wp-form-builder/v1"
  onSubmitSuccess?: (response: any) => void;
  onSubmitError?: (error: string) => void;
  locale?: Record<string, string>;
  className?: string;
  nonce?: string;
}

/**
 * Portable, standalone form renderer component styled dynamically with Tailwind CSS.
 * Demarcated with `"use client"` for optimal Next.js (App Router) support.
 */
export const WPFBFormRenderer: React.FC<WPFBFormRendererProps> = ({
  formData,
  apiBaseUrl,
  onSubmitSuccess,
  onSubmitError,
  locale = {},
  className = '',
  nonce,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibleFieldIds, setVisibleFieldIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    text: string;
  } | null>(null);

  const [availability, setAvailability] = useState<Record<string, { disabled_options?: string[]; exhausted_text?: string }>>({});

  const fields = formData.form_data?.fields || formData.fields || [];

  // Translation helper function
  const t = (key: string, defaultText: string) => locale[key] || defaultText;

  const formId = formData?.id;

  // Initialize values
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    const initializeField = (field: Field) => {
      if (field.type === 'group' && field.fields) {
        field.fields.forEach(initializeField);
      } else {
        initialValues[field.id] = field.settings?.defaultValue || '';
      }
    };
    fields.forEach(initializeField);
    setValues(initialValues);
    setErrors({});
    setAlertMessage(null);
    setModal(null);
  }, [formId]);

  // Modal auto-dismiss is disabled to ensure user explicitly acknowledges form feedback

  // Query advanced response limits availability dynamically
  useEffect(() => {
    if (!formId) return;

    const checkAvailability = async () => {
      try {
        const endpoint = `${apiBaseUrl.replace(/\/$/, '')}/forms/${formId}/check-availability`;
        const payload: Record<string, any> = {};
        
        // Normalize values to pass to selection check
        Object.keys(values).forEach(key => {
          const cleanKey = key.replace(/\[\]$/, '');
          payload[cleanKey] = values[key];
        });

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          setAvailability(data || {});
        }
      } catch (error) {
        console.error('Failed to query field response limits availability:', error);
      }
    };

    checkAvailability();
  }, [values, formId, apiBaseUrl]);

  // Evaluate conditional visibility reactively
  useEffect(() => {
    const visible = new Set<string>();
    const evaluateFieldVisibility = (field: Field) => {
      if (evaluateConditionalLogic(field, values)) {
        visible.add(field.id);
        if (field.type === 'group' && field.fields) {
          field.fields.forEach(evaluateFieldVisibility);
        }
      }
    };
    fields.forEach(evaluateFieldVisibility);
    setVisibleFieldIds(visible);
  }, [values, formId]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));

    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleFieldBlur = (field: Field) => {
    const value = values[field.id];
    const validation = validateField(field, value, t);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field.id]: validation.message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);

    // 1. Client-Side Validation check
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    const validateSingleField = (field: Field) => {
      if (field.type === 'group' && field.fields) {
        field.fields.forEach(validateSingleField);
        return;
      }

      // Ignore hidden fields
      if (!visibleFieldIds.has(field.id)) return;

      const validation = validateField(field, values[field.id], t);
      if (!validation.isValid) {
        newErrors[field.id] = validation.message;
        hasErrors = true;
      }
    };

    fields.forEach(validateSingleField);

    if (hasErrors) {
      setErrors(newErrors);
      // Automatically focus the first input with a validation error
      const firstErrorId = Object.keys(newErrors)[0];
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.focus();
      }
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('form_id', formData.id);
      if (nonce) {
        payload.append('wpfb_nonce', nonce);
      }

      // Format standard fields into the 'fields' array of {id, value} pairs
      const submittedFields = Object.keys(values)
        .filter(
          id =>
            visibleFieldIds.has(id) &&
            !(values[id] instanceof File) &&
            !(Array.isArray(values[id]) && values[id][0] instanceof File)
        )
        .map(id => ({
          id,
          value: values[id],
        }));

      payload.append('fields', JSON.stringify(submittedFields));

      // Append multipart files
      Object.keys(values).forEach(id => {
        if (!visibleFieldIds.has(id)) return;
        const val = values[id];
        if (val instanceof File) {
          payload.append(id, val);
        } else if (Array.isArray(val) && val[0] instanceof File) {
          val.forEach((file: File) => payload.append(`${id}[]`, file));
        }
      });

      const endpoint = `${apiBaseUrl.replace(/\/$/, '')}/forms/${formData.id}/submit`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: payload,
      });

      const json = await response.json();

      if (!response.ok) {
        // Handle server-side validation error matching
        if (json.code === 'validation_failed' && json.data?.errors) {
          const apiErrors: Record<string, string> = {};
          Object.keys(json.data.errors).forEach(fId => {
            apiErrors[fId] =
              json.data.errors[fId][0]?.message || t('invalid_value', 'Invalid value');
          });
          setErrors(apiErrors);
        }
        throw new Error(json.message || t('submission_failed', 'Submission failed'));
      }

      const successMsg =
        formData.settings?.successMessage ||
        t('submit_success', 'Form submitted successfully');
      
      setModal({
        type: 'success',
        title: t('success_title', 'Sucesso!'),
        text: successMsg,
      });

      onSubmitSuccess?.(json);

      // 1. Reset Form state to defaults
      const initialValues: Record<string, any> = {};
      const initializeField = (field: Field) => {
        if (field.type === 'group' && field.fields) {
          field.fields.forEach(initializeField);
        } else {
          initialValues[field.id] = field.settings?.defaultValue || '';
        }
      };
      fields.forEach(initializeField);
      setValues(initialValues);
      setErrors({});

      // 2. Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 3. Handle redirect if configured (delay slightly so user sees success toast)
      const redirectUrl = formData.settings?.redirectUrl || formData.settings?.redirect_url;
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (err: any) {
      setModal({
        type: 'error',
        title: t('error_title', 'Ocorreu um erro'),
        text: err.message || t('submission_error', 'An error occurred during submission.'),
      });
      onSubmitError?.(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`fbui-form-container ${className}`} data-form-id={formData.id}>
      {modal && (
        <div className="wpfb-modal-overlay" onClick={() => setModal(null)}>
          <div 
            className="wpfb-modal-dialog" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={`wpfb-modal-icon-container wpfb-modal-icon-container--${modal.type}`}>
              {modal.type === 'success' ? (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
            </div>
            <h3 className="wpfb-modal-title">{modal.title}</h3>
            <p className="wpfb-modal-message">{modal.text}</p>
            <button 
              type="button" 
              className="wpfb-modal-close-btn"
              onClick={() => setModal(null)}
            >
              {t('close_button', 'Fechar')}
            </button>
          </div>
        </div>
      )}

      <form className="fbui-form" id={`fbui-form-${formData.id}`} onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="form_id" value={formData.id} />

        {formData.title && (
          <div className="fbui-form-header">
            <h2 className="fbui-form-title">{formData.title}</h2>
            {(formData.form_data?.description || formData.description) && (
              <div 
                className="fbui-form-description"
                dangerouslySetInnerHTML={{ __html: formData.form_data?.description || formData.description || '' }}
              />
            )}
          </div>
        )}

        <div className="fbui-fields">
          {fields.map(field => {
            if (!visibleFieldIds.has(field.id)) return null;

            if (field.type === 'group') {
              const nestedFields = field.fields || [];
              return (
                <div key={field.id} className="fbui-field-group" id={field.id}>
                  {field.description && (
                    <div className="fbui-description">
                      {field.description}
                    </div>
                  )}

                  <div className="fbui-form-input-wrapper">
                    <div className="fbui-group-items" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {nestedFields.map(nested => {
                        if (!visibleFieldIds.has(nested.id)) return null;

                        const isLayoutOnlyNested = nested.type === 'divider' || nested.type === 'section' || nested.type === 'image' || nested.type === 'spacer';
                        const cleanNestedId = nested.id.replace(/\[\]$/, '');
                        const nestedAvailability = availability[nested.id] || availability[cleanNestedId];

                        if (isLayoutOnlyNested) {
                          return (
                            <WPFBGenericInput
                              key={nested.id}
                              field={nested}
                              value=""
                              onChange={() => {}}
                              onBlur={() => {}}
                              disabled={submitting}
                              t={t}
                              availability={nestedAvailability}
                            />
                          );
                        }

                        return (
                          <WPFBFieldWrapper
                            key={nested.id}
                            field={nested}
                            error={errors[nested.id]}
                          >
                            <WPFBGenericInput
                              field={nested}
                              value={values[nested.id] || ''}
                              onChange={val => handleFieldChange(nested.id, val)}
                              onBlur={() => handleFieldBlur(nested)}
                              disabled={submitting}
                              t={t}
                              availability={nestedAvailability}
                            />
                          </WPFBFieldWrapper>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Dividers, sections, images & spacers don't have wrappers
            const isLayoutOnly = field.type === 'divider' || field.type === 'section' || field.type === 'image' || field.type === 'spacer';

            const cleanFieldId = field.id.replace(/\[\]$/, '');
            const fieldAvailability = availability[field.id] || availability[cleanFieldId];

            if (isLayoutOnly) {
              return (
                <WPFBGenericInput
                  key={field.id}
                  field={field}
                  value=""
                  onChange={() => {}}
                  onBlur={() => {}}
                  disabled={submitting}
                  t={t}
                  availability={fieldAvailability}
                />
              );
            }

            return (
              <WPFBFieldWrapper
                key={field.id}
                field={field}
                error={errors[field.id]}
              >
                <WPFBGenericInput
                  field={field}
                  value={values[field.id] || ''}
                  onChange={val => handleFieldChange(field.id, val)}
                  onBlur={() => handleFieldBlur(field)}
                  disabled={submitting}
                  t={t}
                  availability={fieldAvailability}
                />
              </WPFBFieldWrapper>
            );
          })}
        </div>

        <div className="fbui-form-actions">
          <button
            type="submit"
            disabled={submitting}
            className={`fbui-button fbui-button--primary fbui-button--lg ${submitting ? 'disabled' : ''}`}
          >
            <span>
              {submitting
                ? t('submitting', 'Submitting...')
                : formData.settings?.submitButtonText || t('submit', 'Submit Form')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WPFBFormRenderer;
