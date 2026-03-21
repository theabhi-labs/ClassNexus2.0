// Server/src/validators/certificate.validator.js
import Joi from 'joi';

// Validate certificate issue request (for params)
export const validateCertificateIssue = Joi.object({
  enrollmentId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid enrollment ID format. Must be a valid MongoDB ObjectId',
      'any.required': 'Enrollment ID is required'
    })
});

// Validate certificate verification request
export const validateCertificateVerification = Joi.object({
  certificateId: Joi.string()
    .required()
    .min(5)
    .max(100)
    .messages({
      'string.empty': 'Certificate ID is required',
      'any.required': 'Certificate ID is required',
      'string.min': 'Certificate ID must be at least 5 characters',
      'string.max': 'Certificate ID must be less than 100 characters'
    })
});

// Validate certificate download request
export const validateCertificateDownload = Joi.object({
  certificateId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Certificate ID is required',
      'any.required': 'Certificate ID is required'
    })
});

// Validate get certificate by enrollment
export const validateGetCertificateByEnrollment = Joi.object({
  enrollmentNumber: Joi.string()
    .required()
    .min(3)
    .max(50)
    .messages({
      'string.empty': 'Enrollment number is required',
      'any.required': 'Enrollment number is required',
      'string.min': 'Enrollment number must be at least 3 characters',
      'string.max': 'Enrollment number must be less than 50 characters'
    })
});

// Validate revoke certificate request
export const validateRevokeCertificate = Joi.object({
  certificateId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid certificate ID format. Must be a valid MongoDB ObjectId',
      'any.required': 'Certificate ID is required'
    })
});

// Export all validators
export default {
  validateCertificateIssue,
  validateCertificateVerification,
  validateCertificateDownload,
  validateGetCertificateByEnrollment,
  validateRevokeCertificate
};