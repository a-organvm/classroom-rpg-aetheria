/**
 * User-friendly error messages for various error scenarios.
 * Provides context-specific messages that help users understand what went wrong.
 */

export interface ErrorDetails {
  title: string
  description: string
  action?: string
}

/**
 * Get user-friendly error message for LLM/API errors
 */
export function getLLMErrorMessage(error: unknown): ErrorDetails {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const lowerMessage = errorMessage.toLowerCase()

  // Rate limiting
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('429') || lowerMessage.includes('too many')) {
    return {
      title: 'Too Many Requests',
      description: 'The AI service is busy. Please wait a moment before trying again.',
      action: 'Wait 30 seconds and try again'
    }
  }

  // Network errors
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('offline')) {
    return {
      title: 'Connection Error',
      description: 'Unable to connect to the AI service. Check your internet connection.',
      action: 'Check your connection and try again'
    }
  }

  // Timeout
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      title: 'Request Timeout',
      description: 'The AI is taking too long to respond. This might be due to high demand.',
      action: 'Try again in a few moments'
    }
  }

  // Service unavailable
  if (lowerMessage.includes('503') || lowerMessage.includes('unavailable') || lowerMessage.includes('service')) {
    return {
      title: 'Service Unavailable',
      description: 'The AI service is temporarily unavailable. Please try again later.',
      action: 'Try again in a few minutes'
    }
  }

  // Parse/validation errors
  if (lowerMessage.includes('parse') || lowerMessage.includes('json') || lowerMessage.includes('invalid')) {
    return {
      title: 'Processing Error',
      description: 'There was an issue processing the AI response. Please try again.',
      action: 'Try submitting again'
    }
  }

  // Default error
  return {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred while communicating with the AI.',
    action: 'Please try again'
  }
}

/**
 * Get user-friendly error message for submission errors
 */
export function getSubmissionErrorMessage(error: unknown): ErrorDetails {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const lowerMessage = errorMessage.toLowerCase()

  if (lowerMessage.includes('network') || lowerMessage.includes('offline')) {
    return {
      title: 'Connection Lost',
      description: 'Your submission could not be sent. Please check your internet connection.',
      action: 'Check your connection and try again'
    }
  }

  if (lowerMessage.includes('timeout')) {
    return {
      title: 'Submission Timeout',
      description: 'The submission is taking longer than expected.',
      action: 'Try again with a shorter response'
    }
  }

  if (lowerMessage.includes('too long') || lowerMessage.includes('too large')) {
    return {
      title: 'Submission Too Long',
      description: 'Your response exceeds the maximum length. Please shorten it.',
      action: 'Reduce the length and try again'
    }
  }

  return {
    title: 'Submission Failed',
    description: 'Unable to submit your response. Please try again.',
    action: 'Try submitting again'
  }
}

/**
 * Get user-friendly error message for import errors
 */
export function getImportErrorMessage(error: unknown): ErrorDetails {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const lowerMessage = errorMessage.toLowerCase()

  if (lowerMessage.includes('json') || lowerMessage.includes('parse')) {
    return {
      title: 'Invalid Format',
      description: 'The import data is not valid JSON. Make sure you copied the entire export.',
      action: 'Copy the complete export and try again'
    }
  }

  if (lowerMessage.includes('structure') || lowerMessage.includes('schema') || lowerMessage.includes('validation')) {
    return {
      title: 'Invalid Data Structure',
      description: 'The import data format is not recognized. It may be from an older version.',
      action: 'Ensure the data was exported from this application'
    }
  }

  if (lowerMessage.includes('size') || lowerMessage.includes('large')) {
    return {
      title: 'File Too Large',
      description: 'The import data exceeds the maximum size limit.',
      action: 'Try importing fewer items at once'
    }
  }

  if (lowerMessage.includes('empty')) {
    return {
      title: 'No Data',
      description: 'The import data is empty. Please paste your export data.',
      action: 'Paste the export data and try again'
    }
  }

  return {
    title: 'Import Failed',
    description: 'Unable to import the data. Please check the format.',
    action: 'Verify the data and try again'
  }
}
