import { toast } from 'react-hot-toast';

export const handleError = (error: any, customMessage?: string) => {
  console.error('Error:', error);
  let errorMessage = customMessage || 'An unexpected error occurred. Please try again.';
  
  if (error.message) {
    errorMessage += ` Error details: ${error.message}`;
  }
  
  if (error.details) {
    errorMessage += ` Additional details: ${error.details}`;
  }
  
  toast.error(errorMessage);
};
