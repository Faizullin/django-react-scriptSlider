import * as React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import Layout from '../../components/layouts/Layout';
import AuthLayout from '../../components/layouts/AuthLayout';

interface ILoginProps {
    status?: boolean
}

export default function Login (props: ILoginProps) {
    return (
        <AuthLayout>
            {/* <Head title="Log in" /> */}
            {props.status && <div className="mb-4 font-medium text-sm text-green-600">{props.status}</div>}
            <LoginForm />
        </AuthLayout>
    );
}
