import React from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import ForgotPasswordConfirmForm from '../../components/form/auth/ForgotPasswordConfirmForm'

type Props = {}

const ForgotPasswordConfirm = (props: Props) => {
  return (
    <AuthLayout>
        <div className="mb-4 text-sm text-gray-600">
            This is a secure area of the application. Please confirm your password before continuing.
        </div>
        <ForgotPasswordConfirmForm />
    </AuthLayout>
  )
}

export default ForgotPasswordConfirm