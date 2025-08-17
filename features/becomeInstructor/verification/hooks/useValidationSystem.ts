"use client";

import { useState, useCallback, useEffect } from 'react';
import { useInstructorApplicationStore } from '@/stores/verification.store';
import { useNotificationSystem, ValidationResult, StepValidation } from './useNotificationSystem';

export interface FieldValidation {
  field: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  value: any;
  required: boolean;
  completed: boolean;
}

export interface ValidationRule {
  field: string;
  validator: (value: any, allData?: any) => { isValid: boolean; errors: string[]; warnings: string[] };
  required?: boolean;
  message?: string;
}

export function useValidationSystem() {
  const store = useInstructorApplicationStore();
  const { updateValidationResults, showStepCompletion } = useNotificationSystem();
  const [fieldValidations, setFieldValidations] = useState<Record<string, FieldValidation>>({});
  const [stepValidations, setStepValidations] = useState<Record<string, StepValidation>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Validation rules for each step
  const validationRules: Record<string, ValidationRule[]> = {
    'personal-info': [
      {
        field: 'firstName',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('First name is required');
          } else if (value.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
          } else if (value.trim().length > 50) {
            warnings.push('First name seems unusually long');
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'lastName',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Last name is required');
          } else if (value.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'email',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Email address is required');
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push('Please enter a valid email address');
            }
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'phoneNumber',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Phone number is required');
          } else {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
              warnings.push('Please ensure your phone number is in a valid format');
            }
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'dateOfBirth',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value) {
            errors.push('Date of birth is required');
          } else {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (age < 18) {
              errors.push('You must be at least 18 years old to apply');
            } else if (age > 100) {
              warnings.push('Please verify your date of birth');
            }
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'nationality',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Nationality is required');
          }
          
          return { isValid: errors.length === 0, errors, warnings: [] };
        }
      },
      {
        field: 'country',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Country is required');
          }
          
          return { isValid: errors.length === 0, errors, warnings: [] };
        }
      }
    ],
    'professional-background': [
      {
        field: 'education',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.length === 0) {
            errors.push('At least one education entry is required');
          } else {
            value.forEach((edu: any, index: number) => {
              if (!edu.institution || edu.institution.trim().length === 0) {
                errors.push(`Education ${index + 1}: Institution is required`);
              }
              if (!edu.degree || edu.degree.trim().length === 0) {
                errors.push(`Education ${index + 1}: Degree is required`);
              }
              if (!edu.field || edu.field.trim().length === 0) {
                errors.push(`Education ${index + 1}: Field of study is required`);
              }
            });
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'experience',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.length === 0) {
            errors.push('At least one work experience entry is required');
          } else {
            value.forEach((exp: any, index: number) => {
              if (!exp.company || exp.company.trim().length === 0) {
                errors.push(`Experience ${index + 1}: Company is required`);
              }
              if (!exp.position || exp.position.trim().length === 0) {
                errors.push(`Experience ${index + 1}: Position is required`);
              }
              if (!exp.startDate) {
                errors.push(`Experience ${index + 1}: Start date is required`);
              }
            });
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'references',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.length < 2) {
            errors.push('At least two professional references are required');
          } else {
            value.forEach((ref: any, index: number) => {
              if (!ref.name || ref.name.trim().length === 0) {
                errors.push(`Reference ${index + 1}: Name is required`);
              }
              if (!ref.email || ref.email.trim().length === 0) {
                errors.push(`Reference ${index + 1}: Email is required`);
              }
              if (!ref.position || ref.position.trim().length === 0) {
                errors.push(`Reference ${index + 1}: Position is required`);
              }
            });
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      }
    ],
    'teaching-information': [
      {
        field: 'subjectsToTeach',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.length === 0) {
            errors.push('At least one subject to teach is required');
          } else {
            value.forEach((subject: any, index: number) => {
              if (!subject.subject || subject.subject.trim().length === 0) {
                errors.push(`Subject ${index + 1}: Subject name is required`);
              }
              if (!subject.category || subject.category.trim().length === 0) {
                warnings.push(`Subject ${index + 1}: Category is recommended`);
              }
            });
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'teachingMotivation',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Teaching motivation is required');
          } else if (value.trim().length < 100) {
            errors.push('Teaching motivation must be at least 100 characters');
          } else if (value.trim().length > 1000) {
            warnings.push('Teaching motivation is quite long. Consider being more concise.');
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'teachingPhilosophy',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.trim().length === 0) {
            errors.push('Teaching philosophy is required');
          } else if (value.trim().length < 50) {
            errors.push('Teaching philosophy must be at least 50 characters');
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      },
      {
        field: 'targetAudience',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          
          if (!value || value.length === 0) {
            errors.push('At least one target audience must be selected');
          }
          
          return { isValid: errors.length === 0, errors, warnings: [] };
        }
      }
    ],
    'documents': [
      {
        field: 'identityDocument',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          
          if (!value) {
            errors.push('Government-issued ID is required for identity verification');
          } else if (value.verificationStatus === 'failed') {
            errors.push('Identity document verification failed. Please upload a clearer copy.');
          }
          
          return { isValid: errors.length === 0, errors, warnings: [] };
        }
      },
      {
        field: 'profilePhoto',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          
          if (!value) {
            errors.push('Professional profile photo is required');
          } else if (value.verificationStatus === 'failed') {
            errors.push('Profile photo verification failed. Please upload a better quality photo.');
          }
          
          return { isValid: errors.length === 0, errors, warnings: [] };
        }
      },
      {
        field: 'educationCertificates',
        required: true,
        validator: (value) => {
          const errors: string[] = [];
          const warnings: string[] = [];
          
          if (!value || value.length === 0) {
            errors.push('At least one education certificate is required');
          } else {
            value.forEach((cert: any, index: number) => {
              if (cert.verificationStatus === 'failed') {
                warnings.push(`Education certificate ${index + 1} verification failed. Consider uploading a clearer copy.`);
              }
            });
          }
          
          return { isValid: errors.length === 0, errors, warnings };
        }
      }
    ]
  };

  // Validate a single field
  const validateField = useCallback((stepId: string, field: string, value: any) => {
    const rules = validationRules[stepId] || [];
    const rule = rules.find(r => r.field === field);
    
    if (!rule) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const result = rule.validator(value, store);
    
    setFieldValidations(prev => ({
      ...prev,
      [`${stepId}.${field}`]: {
        field,
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings,
        value,
        required: rule.required || false,
        completed: value !== null && value !== undefined && value !== ''
      }
    }));

    return result;
  }, [store]);

  // Validate an entire step
  const validateStep = useCallback((stepId: string) => {
    const rules = validationRules[stepId] || [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const requiredFields: string[] = [];
    const optionalFields: string[] = [];
    const completedFields: string[] = [];

    rules.forEach(rule => {
      if (rule.required) {
        requiredFields.push(rule.field);
      } else {
        optionalFields.push(rule.field);
      }

      // Get the value from the store based on step
      let value: any;
      switch (stepId) {
        case 'personal-info':
          value = store.personalInfo[rule.field as keyof typeof store.personalInfo];
          break;
        case 'professional-background':
          value = store.professionalBackground[rule.field as keyof typeof store.professionalBackground];
          break;
        case 'teaching-information':
          value = store.teachingInformation[rule.field as keyof typeof store.teachingInformation];
          break;
        case 'documents':
          value = store.documents[rule.field as keyof typeof store.documents];
          break;
        default:
          value = null;
      }

      const result = rule.validator(value, store);
      errors.push(...result.errors);
      warnings.push(...result.warnings);

      if (value !== null && value !== undefined && value !== '') {
        completedFields.push(rule.field);
      }
    });

    const completionPercentage = Math.round((completedFields.length / (requiredFields.length + optionalFields.length)) * 100);
    const isValid = errors.length === 0;

    const stepValidation: StepValidation = {
      stepId,
      stepName: getStepName(stepId),
      isValid,
      errors,
      warnings,
      completionPercentage,
      requiredFields,
      optionalFields,
      completedFields
    };

    setStepValidations(prev => ({
      ...prev,
      [stepId]: stepValidation
    }));

    // Update store step completion
    store.updateStepCompletion(stepId, isValid, errors, warnings);

    // Show step completion notification
    showStepCompletion(getStepName(stepId), isValid, errors);

    return stepValidation;
  }, [store, showStepCompletion]);

  // Validate entire application
  const validateApplication = useCallback(() => {
    setIsValidating(true);
    
    const stepIds = ['personal-info', 'professional-background', 'teaching-information', 'documents'];
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const missingRequirements: string[] = [];
    const recommendations: string[] = [];
    let totalCompletion = 0;

    stepIds.forEach(stepId => {
      const stepValidation = validateStep(stepId);
      allErrors.push(...stepValidation.errors);
      allWarnings.push(...stepValidation.warnings);
      totalCompletion += stepValidation.completionPercentage;

      if (!stepValidation.isValid) {
        missingRequirements.push(`${stepValidation.stepName}: ${stepValidation.errors.length} error(s)`);
      }

      if (stepValidation.warnings.length > 0) {
        recommendations.push(`${stepValidation.stepName}: Consider addressing ${stepValidation.warnings.length} warning(s)`);
      }
    });

    const overallCompletion = Math.round(totalCompletion / stepIds.length);
    const isValid = allErrors.length === 0;

    const validationResult: ValidationResult = {
      isValid,
      errors: allErrors,
      warnings: allWarnings,
      completionPercentage: overallCompletion,
      missingRequirements,
      recommendations
    };

    updateValidationResults(validationResult);
    setIsValidating(false);

    return validationResult;
  }, [validateStep, updateValidationResults]);

  // Get step name
  const getStepName = useCallback((stepId: string): string => {
    const stepNames: Record<string, string> = {
      'personal-info': 'Personal Information',
      'professional-background': 'Professional Background',
      'teaching-information': 'Teaching Information',
      'documents': 'Documents & Verification',
      'review': 'Review & Submit'
    };
    return stepNames[stepId] || stepId;
  }, []);

  // Get field validation
  const getFieldValidation = useCallback((stepId: string, field: string): FieldValidation | null => {
    return fieldValidations[`${stepId}.${field}`] || null;
  }, [fieldValidations]);

  // Get step validation
  const getStepValidation = useCallback((stepId: string): StepValidation | null => {
    return stepValidations[stepId] || null;
  }, [stepValidations]);

  // Check if field has errors
  const hasFieldErrors = useCallback((stepId: string, field: string): boolean => {
    const validation = getFieldValidation(stepId, field);
    return validation ? validation.errors.length > 0 : false;
  }, [getFieldValidation]);

  // Check if field has warnings
  const hasFieldWarnings = useCallback((stepId: string, field: string): boolean => {
    const validation = getFieldValidation(stepId, field);
    return validation ? validation.warnings.length > 0 : false;
  }, [getFieldValidation]);

  // Get field error messages
  const getFieldErrors = useCallback((stepId: string, field: string): string[] => {
    const validation = getFieldValidation(stepId, field);
    return validation ? validation.errors : [];
  }, [getFieldValidation]);

  // Get field warning messages
  const getFieldWarnings = useCallback((stepId: string, field: string): string[] => {
    const validation = getFieldValidation(stepId, field);
    return validation ? validation.warnings : [];
  }, [getFieldValidation]);

  // Auto-validate on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      validateApplication();
    }, 1000);
    return () => clearTimeout(timer);
  }, [store.personalInfo, store.professionalBackground, store.teachingInformation, store.documents]);

  return {
    // State
    fieldValidations,
    stepValidations,
    isValidating,
    
    // Actions
    validateField,
    validateStep,
    validateApplication,
    
    // Getters
    getFieldValidation,
    getStepValidation,
    hasFieldErrors,
    hasFieldWarnings,
    getFieldErrors,
    getFieldWarnings,
    getStepName,
    
    // Validation rules
    validationRules
  };
}
