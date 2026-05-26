export interface ConditionalRule {
  id: string;
  fieldId: string;
  operator:
    | '=='
    | '!='
    | 'contains'
    | 'empty'
    | 'not_empty'
    | '>'
    | '<'
    | '>='
    | '<=';
  value: any;
}

export interface ConditionalGroup {
  id: string;
  rules: ConditionalRule[];
}

export interface ConditionalLogic {
  enabled: boolean;
  action: 'show' | 'hide';
  match: 'all' | 'any';
  groups: ConditionalGroup[];
}

export interface Field {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  description?: string;
  settings?: Record<string, any>;
  conditional_logic?: ConditionalLogic;
}

export interface FormSettings {
  expirationDate?: string;
  responseLimit?: number;
  allowMultipleSubmissions?: boolean;
  requireLogin?: boolean;
  enableCaptcha?: boolean;
  submitButtonText?: string;
  notificationEmail?: string;
  sendConfirmationEmail?: boolean;
  sendAdminNotification?: boolean;
  redirectUrl?: string;
  successMessage?: string;
  customCSS?: string;
  customJS?: string;
  shareEnabled?: boolean;
  sharePassword?: string;
  shareToken?: string;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  post_status?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  version?: string;
  settings?: FormSettings;
  form_data?: {
    fields: Field[];
    description?: string;
  };
}
