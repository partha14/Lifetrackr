import React from 'react'

interface FormErrorMessageProps {
  name: string
  errors: Record<string, string>
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ name, errors }) => {
  if (!errors[name]) return null

  return (
    <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
  )
}
