import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ForgotPasswordForm from '../../components/form/auth/ForgotPasswordForm';

interface IForgotPasswordProps {
    status?: string
}

export default function ForgotPassword({ status }: IForgotPasswordProps) {
    return (
        <AuthLayout>
            {/* <Head title="Forgot Password" /> */}
            <div className="mb-4 text-sm text-gray-500 leading-normal">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>

            { status && <div className="mb-4 font-medium text-sm text-green-600">{ status }</div>}
            <ForgotPasswordForm />
        </AuthLayout>
    );
}