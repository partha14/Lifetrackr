import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
      <div className="flex">
        <div className="py-1"><FaExclamationCircle className="text-red-500 mr-4" /></div>
        <div>{message}</div>
      </div>
    </div>
  )
}
